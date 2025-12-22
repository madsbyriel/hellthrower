use std::sync::Arc;

use klib::{Keyboard, linux_keyboard::VirtualKeyboard};
use tauri::State;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
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
    let keyboard = match VirtualKeyboard::new() {
        Ok(v) => v,
        Err(_) => {
            println!("Couldn't create virual keyboard!");
            return;
        },
    };

    tauri::Builder::default()
        .manage(Arc::new(keyboard))
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet, press_enter])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
