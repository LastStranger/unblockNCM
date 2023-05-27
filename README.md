### 一键解锁网易云灰色歌曲, 轻量级应用,支持音源切换,自动设置为系统代理等功能, 持续开发中~~
<img width="793" alt="截屏2023-05-27 16 54 04" src="https://github.com/LastStranger/unblockNCM/assets/29811304/4852726a-da8c-40e8-9441-ca82e3844920">

食用方法:
首先安装node,然后运行unblockNCM app, 点击开启代理,如果8080端口状态显示已开启则代表软件运行成功 
## 注意事项:
1. 开启系统代理会修改系统的代理配置, 如果你使用clash,可以增加该配置项 
<details><summary>配置项</summary>
  
```yaml
- {name: "网易云", type: http, server: 127.0.0.1, port: 8080}
.......
  - name: Netease Music
    type: select
    proxies:
      - DIRECT
      - Proxies
      - 网易云
.......
 - DOMAIN,apm.music.163.com,Netease Music
 - DOMAIN,apm3.music.163.com,Netease Music
 - DOMAIN,interface.music.163.com,Netease Music
 - DOMAIN,interface3.music.163.com,Netease Music
 - DOMAIN,music.163.com,Netease Music
 - IP-CIDR,101.71.154.241/32,Netease Music,no-resolve
 - IP-CIDR,103.126.92.132/32,Netease Music,no-resolve
 - IP-CIDR,103.126.92.133/32,Netease Music,no-resolve
 - IP-CIDR,112.13.119.17/32,Netease Music,no-resolve
 - IP-CIDR,112.13.122.1/32,Netease Music,no-resolve
 - IP-CIDR,115.236.118.33/32,Netease Music,no-resolve
 - IP-CIDR,115.236.121.1/32,Netease Music,no-resolve
 - IP-CIDR,118.24.63.156/32,Netease Music,no-resolve
 - IP-CIDR,193.112.159.225/32,Netease Music,no-resolve
 - IP-CIDR,223.252.199.66/32,Netease Music,no-resolve
 - IP-CIDR,223.252.199.67/32,Netease Music,no-resolve
 - IP-CIDR,39.105.63.80/32,Netease Music,no-resolve
 - IP-CIDR,45.254.48.1/32,Netease Music,no-resolve
 - IP-CIDR,47.100.127.239/32,Netease Music,no-resolve
 - IP-CIDR,59.111.160.195/32,Netease Music,no-resolve
 - IP-CIDR,59.111.160.197/32,Netease Music,no-resolve
 - IP-CIDR,59.111.181.35/32,Netease Music,no-resolve
 - IP-CIDR,59.111.181.38/32,Netease Music,no-resolve
 - IP-CIDR,59.111.181.60/32,Netease Music,no-resolve
 - DOMAIN-SUFFIX,netease.com,Domestic
``` 
  
然后修改网易云的代理方式
<img width="237" alt="截屏2023-05-27 17 09 31" src="https://github.com/LastStranger/unblockNCM/assets/29811304/c8bf08e4-64cf-43a9-aca8-a469f8d36c97">
</details>

3. 某些未知情况会导致端口关闭不了,请使用强制释放端口按钮接触8080端口的占用
4. B站来源目前有些问题,不建议开启
