use tauri::{
    AppHandle, CustomMenuItem, Manager, SystemTray, SystemTrayEvent, SystemTrayMenu,
    SystemTrayMenuItem, Wry,
};

pub fn set_tray_menu() -> SystemTray {
    let console = CustomMenuItem::new("console".to_string(), "控制台");
    let quit = CustomMenuItem::new("quit".to_string(), "关闭窗口");
    let hide = CustomMenuItem::new("hide".to_string(), "隐藏窗口");
    let tray_menu = SystemTrayMenu::new()
        .add_item(console)
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(quit)
        .add_item(hide);
    let system_tray = SystemTray::new().with_menu(tray_menu);
    return system_tray;
}

#[tauri::command]
fn show_window(app_handle: &AppHandle<Wry>) {
    let window = app_handle.get_window("main").unwrap();
    window.show().unwrap();
    // window.set_excluded_from_taskbar(true);
    // window.set_excluded_from_taskbar(true);
}

pub fn handle_click(app_handle: &AppHandle<Wry>, event: SystemTrayEvent) {
    match event {
        SystemTrayEvent::MenuItemClick { id, .. } => match id.as_str() {
            "console" => {
                show_window(&app_handle);
                println!("控制台");
            }
            "quit" => println!("quit"),
            "hide" => {
                let item_handle = app_handle.tray_handle().get_item(&id);
                let window = app_handle.get_window("main").unwrap();
                if window.is_visible().unwrap() {
                    println!("hide");
                    window.hide().unwrap();
                    item_handle.set_title("显示窗口").unwrap();
                } else {
                    window.show().unwrap();
                    item_handle.set_title("隐藏窗口").unwrap();
                }
            }
            _ => {}
        },
        _ => {}
    }
}
