use std::net::TcpListener;
// use tauri::api::path::resource_dir;
// use tauri::PathResolver;
use tauri::api::process::{Command, CommandEvent};
use std::process::Command as SysCommand;
// use tauri::Wry;


// 测试端口是否被占用
#[tauri::command]
pub fn if_port_available() -> bool {
    // let if_free = port_check::is_local_port_free(8080);
    // if_free
    match TcpListener::bind("0.0.0.0:8080") {
        Ok(_) => {
            println!("Port 8080 is available.");
            true
        }
        Err(e) => {
            println!("Error: {}", e);
            false
        }
    }
}

// 释放端口
#[tauri::command]
pub fn release_port () -> bool {
    let output = SysCommand::new("lsof")
        .arg("-i")
        .arg(format!(":{}", 8080))
        .output()
        .unwrap();
    println!("{:?}haha", output.stdout);

    let output_string = String::from_utf8_lossy(&output.stdout);
    for line in output_string.lines() {
        println!("{}", line);
        let parts: Vec<&str> = line.split_whitespace().collect();
        if parts.len() > 1 && parts[0] != "COMMAND" {
            let pid = parts[1];
            SysCommand::new("kill").arg("-9").arg(pid).output().unwrap();
        }
    }
    true
}

// rust端启动node服务,未完全完成,仅启动了node服务,未获取unblockMusic的输出
#[tauri::command]
pub fn start_server(app_handle: tauri::AppHandle) {
    tauri::async_runtime::spawn(async move {
        let path = app_handle.path_resolver().resource_dir().unwrap();
        let full_path = path.join("unblockMusic/src/app.cjs");
        let pp = full_path.to_str().unwrap();
        println!("{:?}", full_path);
        // let path = resource_dir().unwrap();
        let (mut rx, mut child) = Command::new("node")
            .args([pp, "-o", "kugou", "kuwo"])
            .spawn()
            .expect("Failed to spawn cargo");

        let mut i = 0;
        while let Some(event) = rx.recv().await {
            if let CommandEvent::Stdout(line) = event {
                println!("got: {}", line);
                i += 1;
                if i == 4 {
                    child.write("message from Rust\n".as_bytes()).unwrap();
                    i = 0;
                }
            }
        }
    });
}

// 测试版本
#[tauri::command]
pub fn get_node_version() -> String {
    let output = Command::new("node").args(["-v"]).output().unwrap();
    // .spawn()
    // .expect("Failed to spawn cargo");
    println!("{}", output.stdout);
    let str = output.stdout;
    str
    // String::from_utf8_lossy(&output.stdout).to_string()
}
