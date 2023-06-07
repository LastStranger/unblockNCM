import { useEffect, useRef, useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/tauri";
import "normalize.css";
import "./App.css";
import { Command } from "@tauri-apps/api/shell";
import { resolveResource } from "@tauri-apps/api/path";
import notify from "./utils/notification";
import { appWindow } from "@tauri-apps/api/window";

function App() {
    const [greetMsg, setGreetMsg] = useState("");
    const [name, setName] = useState("");
    const childRef = useRef<any>();
    const [childId, setChildId] = useState<any>("");
    const [sourceList, setSourceList] = useState<any[]>([
        { name: "酷我", key: "kuwo", active: true },
        { name: "酷狗", key: "kugou", active: true },
        { name: "B站", key: "bilibili", active: false },
    ]);
    const [list, setList] = useState<any[]>([]);
    const [portStatus, setPortStatus] = useState(false);

    useEffect(() => {
        invoke("if_port_available").then(res => {
            console.log("%cres", "color: #22E1FF; font-size: 16px", res);
            setPortStatus(!res);
        });
    }, []);

    const start = async () => {
        console.log("", 1 <= 2);
        const ifPortAvailable = await invoke("if_port_available");
        console.log("%cifPortAvailable", "color: #22E1FF; font-size: 16px", ifPortAvailable);
        if (ifPortAvailable) {
            const resourcePath = await resolveResource("unblockMusic/src/app.cjs");
            console.log("%cresourcePath", "color: #22E1FF; font-size: 16px", resourcePath);
            const command = new Command("start", [
                resourcePath,
                "-o",
                ...sourceList.reduce((acc, curr) => {
                    if (curr.active) {
                        acc.push(curr.key);
                        return acc;
                    }
                    return acc;
                }, []),
            ]);
            command.on("error", error => console.error(`command error: "${error}"`));
            command.stdout.on("data", line => {
                console.log(`command stdout: "${line}"`);
                let arr = [];
                let strLine = line.trim();
                console.log("%cstrLine", "color: #22E1FF; font-size: 16px", strLine);
                if (strLine.indexOf("HTTP Server running") !== -1) {
                    // childRef.current = child;
                    setChildId(child);
                    setPortStatus(true);
                }
                const index = strLine.indexOf(":");
                const key = strLine.slice(0, index).trim();
                const value = strLine.slice(index + 1).trim();
                let obj: any = {};
                if (key === "info") {
                    obj = JSON.parse(value);
                    setList(prevList => [...prevList, JSON.parse(obj)]);
                }
                console.log("%cobj", "color: #22E1FF; font-size: 16px", obj);
                // console.log('%carrLine', "color: #22E1FF; font-size: 16px", [key, value]);
                // arr.push([key, value]);
                // let obj = Object.fromEntries(arr);
                // console.log(obj);
                // console.log(line);
            });
            command.stderr.on("data", line => console.log(`command stderr: "${line}"`));
            const child = await command.spawn();
            // localStorage.setItem("child", JSON.stringify(child));
            // window.child = child;
            console.log("%cchild", "color: #22E1FF; font-size: 16px", child);
        } else {
            // if (!childRef.current) {
            if (!childId) {
                notify({ title: "端口被占用" });
            } else {
                notify({ title: "服务已开启" });
            }
            // setPortStatus(true);
        }
    };

    // useEffect(() => {
    //     // start();
    // }, []);

    async function greet() {
        // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
        setGreetMsg(await invoke("greet", { name }));
    }

    const handleClose = async () => {
        // let child = JSON.parse(localStorage.getItem("child") ?? "");
        // console.log("%cchildRefCurrent222", "color: #22E1FF; font-size: 16px", childRef.current);
        // if (childRef.current) {
        if (childId) {
            // console.log("%cchildRefCurrent", "color: #22E1FF; font-size: 16px", childRef.current);
            // childRef.current.kill();
            childId.kill();
            notify({ title: "服务已关闭" });
        }
        setPortStatus(false);
        // node src/server.js & echo $!
        // const command = new Command('kill', ["-9" , "37368"]);
        // command.on('error', error => console.error(`command error: "${error}"`));
        // command.stdout.on('data', line => {
        //     console.log(line);
        // });
        // command.stderr.on('data', line => console.log(`command stderr: "${line}"`));
        // const child = await command.spawn();
    };

    // const handleServer = async () => {
    //     const a: string = await invoke("get_node_version");
    //     console.log("%ca", "color: #22E1FF; font-size: 16px", a.trim());
    // };
    // const handleServer2 = async () => {
    //     const a: string = await invoke("start_server");
    //     console.log("%ca", "color: #22E1FF; font-size: 16px", a.trim());
    // };

    const handleReleasePort = async () => {
        const result = await invoke("release_port");
        console.log("%cresult", "color: #22E1FF; font-size: 16px", result);
        setPortStatus(false);
    };

    const getSource = (url: string) => {
        if (url.indexOf("kugou") !== -1) {
            return "酷狗";
        }
        if (url.indexOf("kuwo") !== -1) {
            return "酷我";
        }
        if (url.indexOf("bilivideo")) {
            return "B站";
        }
        return "未知";
    };

    const handleSelect = (e: any) => {
        // e.target.checked = true;
        setSourceList(prev =>
            prev.map(each => ({ ...each, active: each.name === e.target.name ? !each.active : each.active }))
        );
    };

    // 开启系统代理
    const handleStartSysProxy = () => {
        // networksetup -setwebproxy Wi-Fi 127.0.0.1 ${port}
        const command = new Command("setProxy", ["-setwebproxy", "Wi-Fi", "127.0.0.1", "8080"]).execute();
    };

    const handleCloseSysProxy = () => {
        const command = new Command("setProxy", ["-setwebproxystate", "Wi-Fi", "off"]).execute();
    };

    return (
        <div className="container" data-tauri-drag-region>
            <div className="left-content">
                <div>
                    <div className="source-list">
                        <div className="source-title">选择代理来源: </div>
                        {sourceList.map(each => (
                            <div key={each.key} className="source-item">
                                <input name={each.name} type="checkbox" checked={each.active} onChange={handleSelect} />
                                <span>{each.name}</span>
                            </div>
                        ))}
                        {/*<input type="checkbox" />*/}
                        {/*酷狗*/}
                        {/*<input type="checkbox" />*/}
                        {/*酷我*/}
                    </div>
                    <div className="button-wrp">
                        {childId ? (
                            <div className="button" onClick={handleClose}>
                                关闭代理
                            </div>
                        ) : (
                            <div className="button" onClick={start}>
                                开启代理
                            </div>
                        )}
                        <div className="button" onClick={handleReleasePort}>
                            强制释放端口
                        </div>
                        <div className="button" onClick={handleStartSysProxy}>
                            开启系统代理
                        </div>
                        <div className="button" onClick={handleCloseSysProxy}>
                            关闭系统代理
                        </div>
                    </div>
                </div>
                <h3 className="port-status">8080端口状态: {portStatus ? "已开启" : "空闲"}</h3>
            </div>
            <div className="right-content">
                <div className="log-title">日志</div>
                <div>
                    <div className="log-desc">
                        <span>歌曲名称</span>
                        <span>歌曲来源</span>
                    </div>
                    <div className="long-item-wrp">
                        {list.map((each, index) => (
                            <div className="log-item" key={index}>
                                <span>{each.name}</span>
                                <span className="source">{getSource(each.url)}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="author-wrp">
                    <sub>made by</sub>
                    <h1 className="author">
                        <span>R</span>
                        <span>u</span>
                        <span>s</span>
                        <span>k</span>
                        <span>e</span>
                        <span>r</span>
                    </h1>
                </div>
            </div>
        </div>
    );
}

export default App;
