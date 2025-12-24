use std::{env, fs, path::PathBuf, sync::Arc};

use klib::{Keyboard, linux_keyboard::VirtualKeyboard};
use tauri::State;
use tracing::{error, info};

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet() -> String {
    info!("HELLO FROM GREET");
    "Hello! You've been greeted from Rust!".to_string()
}

#[tauri::command]
fn get_config(config: State<Config>) -> String {
    let config_file_content = config.contents.clone();

    info!("Calling get config");
    config_file_content
}

#[tauri::command]
fn press_enter(keyboard: State<Arc<VirtualKeyboard>>) -> String {
    let kboard = keyboard.clone();

    match kboard.tap(evdev::KeyCode::KEY_A.0) {
        Ok(_) => {
            "pressed enter".to_string()
        },
        Err(_) => {
            format!("failed pressing enter").to_string()
        },
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let home = match env::var("HOME") {
        Ok(v) => v,
        Err(e) => {
            error!("couldn't find variable HOME: {e}");
            return;
        },
    };

    let mut path = PathBuf::from(home);
    path.push(".cache");
    path.push("hellthrower");

    match fs::create_dir_all(path.clone()) {
        Ok(_) => {},
        Err(e) => {
            error!("Failed creating all directories: {e}");
            return;
        },
    }

    path.push("config.json");
    let config = match fs::read_to_string(path.clone()) {
        Ok(v) => v,
        Err(e1) => {
            match fs::write(path.clone(), "") {
                Ok(_) => "".to_string(),
                Err(e2) => {
                    error!("couldn't find config file: {e1} and tried instead to create it, which also failed: {e2}");
                    return;
                },
            }
        },
    };

    let config = Config{ contents: config };

    let keyboard = match VirtualKeyboard::new() {
        Ok(v) => v,
        Err(_) => {
            error!("Couldn't create virual keyboard!");
            return;
        },
    };

    tauri::Builder::default()
        .manage(Arc::new(keyboard))
        .manage(config)
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet, press_enter, get_config])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

struct Config {
    contents: String,
}
