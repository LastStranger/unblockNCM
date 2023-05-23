// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod command;
mod tray_menu;
// use fix_path_env;

// use std::net::TcpListener;
// use port_check;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

// #[tauri::command]
// fn if_port_available() -> bool {
//     // let if_free = port_check::is_local_port_free(8080);
//     // if_free
//     match TcpListener::bind("0.0.0.0:8080") {
//         Ok(_) => {
//             println!("Port 8080 is available.");
//             true
//         },
//         Err(e) => {
//             println!("Error: {}", e);
//             false
//         },
//     }
// }

fn main() {
    fix_path_env::fix();
    tauri::Builder::default()
        .system_tray(tray_menu::set_tray_menu())
        .on_system_tray_event(tray_menu::handle_click)
        .invoke_handler(tauri::generate_handler![
            greet,
            command::if_port_available,
            command::get_node_version,
            command::start_server,
            command::release_port,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
