use std::{collections::HashSet, env, fs, path::PathBuf, sync::{Arc, LazyLock}, time::Duration};

use evdev::{EventType, KeyCode};
use futures::{StreamExt, stream::FuturesUnordered};
use klib::{Keyboard, linux_keyboard::{self, EventBroadcaster, VirtualKeyboard}};
use serde::{Deserialize, Serialize};
use tauri::State;
use tokio::sync::Mutex;
use tracing::{error, info};

static STOP_CHANNEL: LazyLock<Mutex<StopChannel>> = LazyLock::new(|| Mutex::new(StopChannel { chan: None }));
static DELAY_MS: Duration = Duration::from_millis(15);

struct StopChannel {
    chan: Option<tokio::sync::mpsc::Sender<u8>>
}

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet() -> String {
    "Hello! You've been greeted from Rust!".to_string()
}

#[tauri::command]
async fn start_listening(
    loadout_s: String,
    broadcaster: State<'_, Arc<EventBroadcaster>>,
    keyboard: State<'_, Arc<VirtualKeyboard>>
) -> Result<(), ()>
{
    info!("starting to listen for key events!");

    let loadout = match serde_json::from_str::<Loadout>(&loadout_s) {
        Ok(v) => v,
        Err(_) => {
            return Ok(())
        },
    };

    let bindings = loadout.bindings.iter().map(|e| {
        return (
            e.stratagem.name().to_string(),
            e.key_bindings.iter().map(|e| e.code).collect::<Vec<u16>>()
        );
    });

    let mut sets: Vec<(String, HashSet<u16>)> = vec![];
    for (v, k) in bindings {
        let mut hash_set = HashSet::new();
        for code in k {
            hash_set.insert(code);
        }

        sets.push((v, hash_set));
    }

    let (sen, mut rec) = tokio::sync::mpsc::channel::<u8>(100);
    let broadcaster = broadcaster.inner().clone();
    let keyboard = keyboard.inner().clone();
    STOP_CHANNEL.lock().await.chan = Some(sen);

    tokio::spawn(async move {
        info!("spawned thread");
        let strats = helldivers_common::Stratagem::all_stratagems();
        let hash_sets = sets;

        loop {
            let futs: Vec<_> = hash_sets.iter().map(|e| {
                let name = e.0.clone();
                let set = e.1.clone();
                let fut = broadcaster.listen_for_keys(set);
                async move {
                    (name, fut.await)
                }
            }).collect();


            let mut unordered = FuturesUnordered::new();
            for f in futs {
                unordered.push(f);
            }

            tokio::select! {
                _ = rec.recv() => {
                    info!("deactivating stratagem!");
                    break;
                }
                Some((name, res)) = unordered.next() => {
                    match res {
                        Ok(v) => match v {
                            Some(_) => {
                                let strat = match strats.iter().find(|s| s.name() == name) {
                                    Some(v) => v,
                                    None => {
                                        error!("failed matching stratagem name to actual stratagem");
                                        continue;
                                    },
                                };
                                let keys_to_execute: Vec<_> = strat.binding().iter().map(|e| {
                                    match e {
                                        helldivers_common::Binding::Up => KeyCode::KEY_W.code(),
                                        helldivers_common::Binding::Down => KeyCode::KEY_S.code(),
                                        helldivers_common::Binding::Left => KeyCode::KEY_A.code(),
                                        helldivers_common::Binding::Right => KeyCode::KEY_D.code(),
                                    }
                                }).collect();

                                

                                match keyboard.press(KeyCode::KEY_LEFTCTRL.code()).await
                                {
                                    Ok(_) => {},
                                    Err(e) => {
                                        error!("failed pressing tab: {:?}", e);
                                        return;
                                    }
                                };

                                tokio::time::sleep(DELAY_MS).await;

                                for key in keys_to_execute {
                                    // Delay is only between press and release
                                    match keyboard.tap_with_delay(key, DELAY_MS).await {
                                        Ok(_) => {},
                                        Err(e) => {
                                            error!("failed tapping: {:?}", e);
                                            break;
                                        },
                                    };
                                    tokio::time::sleep(DELAY_MS).await;
                                }

                                match keyboard.release(KeyCode::KEY_LEFTCTRL.code()).await
                                {
                                    Ok(_) => {},
                                    Err(e) => {
                                        error!("failed releaseing tab: {:?}", e);
                                        return;
                                    }
                                };

                                info!("successfully called {name}!");
                            },
                            None => {
                                error!("key listener ran out of events!");
                                break;
                            },
                        },
                        Err(e) => {
                            error!("unexpected error: {:?}", e);
                            break;
                        },
                    };
                }
                else => {
                    error!("no more key listeners?");
                    break;
                }
            };
        }
    });

    info!("successfully spawned virtual key presser");
    Ok(())
}

#[tauri::command]
async fn stop_listener() -> Result<(), ()>
{
    let chan = STOP_CHANNEL.lock().await;
    match &chan.chan {
        Some(v) => {
            match v.send(0).await {
                Ok(()) => {},
                Err(_) => {
                    error!("error sending stop event to deactivate stratagem!");
                },
            }
        },
        None => {
            error!("could not find a stop channel, loadout may still be active!");
        },
    };

    Ok(())
}

#[tauri::command]
async fn get_input() -> Result<String, ()> {
    let devices = match linux_keyboard::get_devices() {
        Ok(v) => v,
        Err(e) => {
            let resp = KeyResponse{name: "".to_string(), error: format!("Couldn't get devices: {:?}", e).to_string(), code: 0 };
            return Ok(serde_json::to_string(&resp).unwrap());
        }
    };

    let broadcaster = match EventBroadcaster::start_listening(devices) {
        Ok(v) => {v},
        Err(e) => {
            let resp = KeyResponse{name: "".to_string(), error: format!("Couldn't get eventbroadcaster: {:?}", e).to_string(), code: 0 };
            return Ok(serde_json::to_string(&resp).unwrap());
        },
    };

    let mut rec = match broadcaster.get_receiver().await {
        Ok(v) => {v},
        Err(e) => {
            let resp = KeyResponse{name: "".to_string(), error: format!("Couldn't get receiver for broadcaster: {:?}", e), code: 0 };
            return Ok(serde_json::to_string(&resp).unwrap());
        },
    };

    while let Some(inp) = rec.recv().await {
        match inp.event_type() {
            EventType::KEY => {
                let resp = KeyResponse{name: format!("{:?}", KeyCode::new(inp.code())), error: "".to_string(), code: inp.code() };
                let resp = serde_json::to_string(&resp).unwrap();
                info!("response: {resp}");
                return Ok(resp);
            }
            _ => {},
        }
    }

    let resp = KeyResponse{name: "".to_string(), error: format!("Did not receive any events"), code: 0 };
    Ok(serde_json::to_string(&resp).unwrap())
}

#[tauri::command]
fn stratagems() -> String {
    match serde_json::to_string(&helldivers_common::Stratagem::all_stratagems()) {
        Ok(v) => v,
        Err(e) => format!("Error: {e}"),
    }
}

#[tauri::command]
fn get_config() -> String {
    info!("get_config called");

    match serde_json::to_string(&read_config()) {
        Ok(v) => v,
        Err(_) => {
            error!("FATAL: Failed serializing configuration!");
            "{\"error\":\"Failed serializing configuration!\"}".to_string()
        },
    }
}

#[tauri::command]
async fn press_enter(keyboard: State<'_, Arc<VirtualKeyboard>>) -> Result<String, ()> {
    let kboard = keyboard.inner().clone();

    Ok(match kboard.tap(evdev::KeyCode::KEY_A.0).await {
        Ok(_) => {
            "pressed enter".to_string()
        },
        Err(_) => {
            format!("failed pressing enter").to_string()
        },
    })
}

#[tauri::command]
fn save_config(config: &str) {
    info!("save_config: {config}");
    let config = serde_json::from_str::<Config>(config);

    let config = match config {
        Ok(v) => v,
        Err(e) => {
            error!("Couldn't save config: {e}");
            return;
        },
    };

    let path = match get_config_path() {
        Ok(v) => v,
        Err(e) => {
            error!("Failed getting config path: {e}");
            return;
        },
    };

    match fs::write(path, serde_json::to_string(&config).unwrap().bytes().collect::<Vec<u8>>()) {
        Ok(_) => {},
        Err(e) => {
            error!("Failed writing new config: {e}");
        },
    };
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let keyboard = match VirtualKeyboard::new() {
        Ok(v) => v,
        Err(_) => {
            error!("Couldn't create virual keyboard!");
            return;
        },
    };

    let devices = match linux_keyboard::get_devices() {
        Ok(v) => v,
        Err(_) => {
            error!("Couldn't get devices!");
            return;
        },
    };

    let eventbroadcaster = match EventBroadcaster::start_listening(devices) {
        Ok(v) => v,
        Err(_) => {
            error!("couldn't start event listener");
            return;
        },
    };

    tauri::Builder::default()
        .manage(Arc::new(keyboard))
        .manage(Arc::new(eventbroadcaster))
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet, press_enter, get_config, save_config, stratagems, get_input, start_listening, stop_listener])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn get_config_path() -> Result<PathBuf, String> {
    let mut dir = get_config_dir()?;
    dir.push("config.json");

    Ok(dir)
}

fn get_config_dir() -> Result<PathBuf, String> {
    let home = match env::var("HOME") {
        Ok(v) => v,
        Err(e) => {
            error!("couldn't find variable HOME: {e}");
            return Err("Couldn't find variable HOME".to_string());
        },
    };

    let mut path = PathBuf::from(home);
    path.push(".cache");
    path.push("hellthrower");

    Ok(path)
}

fn read_config() -> Config
{
    let path = match get_config_dir() {
        Ok(v) => v,
        Err(e) => {
            return Config::default_with_error(format!("FATAL: {e}").as_str())
        },
    };

    match fs::create_dir_all(path.clone()) {
        Ok(_) => {},
        Err(e) => {
            error!("Failed creating all directories: {e}");
            return Config::default_with_error("FATAL: Failed creating all directories");
        },
    }

    let path = match get_config_path() {
        Ok(v) => v,
        Err(e) => {
            return Config::default_with_error(format!("FATAL: {e}").as_str())
        },
    };

    let config = match fs::read_to_string(path.clone()) {
        Ok(v) => v,
        Err(e1) => {
            match fs::write(path.clone(), "") {
                Ok(_) => "".to_string(),
                Err(e2) => {
                    error!("couldn't find config file: {e1} and tried instead to create it, which also failed: {e2}");
                    return Config::default_with_error("FATAL: couldn't find config file and tried instead to create it, which also failed");
                },
            }
        },
    };

    if config.trim().len() == 0 {
        return Config { name: "".to_string(), error: "".to_string(), loadouts: vec![] }
    }

    match serde_json::from_str::<Config>(&config)
    {
        Ok(v) => v,
        Err(e) => {
            error!("Failed parsing config: {e}");
            Config::default_with_error("FATAL: couldn't parse raw config")
        },
    }
}

#[derive(Deserialize, Serialize)]
struct Config {
    name: String,
    error: String,
    loadouts: Vec<Loadout>,
}

#[derive(Deserialize, Serialize)]
struct Loadout {
    name: String,
    bindings: Vec<StratBinding>,
}

#[derive(Deserialize, Serialize)]
struct StratBinding {
    stratagem: helldivers_common::Stratagem,
    key_bindings: Vec<KeyBinding>,
}

#[derive(Deserialize, Serialize)]
struct KeyBinding {
    name: String,
    code: u16,
}

#[derive(Deserialize, Serialize)]
struct KeyResponse {
    name: String,
    error: String,
    code: u16,
}


impl Config {
    fn default_with_error(err: &str) -> Self
    {
        Config { name: "".to_string(), error: err.to_string(), loadouts: vec![] }
    }
}
