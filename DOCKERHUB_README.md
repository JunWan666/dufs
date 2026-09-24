# Dufs 中文增强版

**轻量级网页文件管理器与 WebDAV 服务器 · 中文优先界面**

基于 [sigoden/dufs](https://github.com/sigoden/dufs) 二次开发，重做了整套中文界面，新增拖拽上传范围提示等交互优化。程序编译为单个静态二进制，镜像基于 `scratch`，零运行时依赖。

![Rust](https://img.shields.io/badge/Rust-0.46.0-DEA584?style=for-the-badge&logo=rust&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-amd64%20%7C%20arm64-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![License](https://img.shields.io/badge/License-MIT%20%7C%20Apache--2.0-111827?style=for-the-badge)

![WebDAV](https://img.shields.io/badge/WebDAV-支持-0F9F6E?style=flat-square)
![中文界面](https://img.shields.io/badge/中文界面-原生-2563EB?style=flat-square)
![拖拽上传](https://img.shields.io/badge/拖拽上传-范围提示-5B9BFF?style=flat-square)
![移动端](https://img.shields.io/badge/移动端-响应式-12A781?style=flat-square)
![镜像体积](https://img.shields.io/badge/镜像体积-9.7MB-687388?style=flat-square)

## 界面预览

文件列表：卡片式布局、顶部工具栏、路径导航与权限状态徽章。

![文件列表](https://raw.githubusercontent.com/JunWan666/dufs/main/docs/images/index-desktop.png)

拖拽上传：把文件拖进浏览器窗口时，页面会显示浅色范围提示层，并标明文件将保存到哪个目录。

![拖拽上传提示](https://raw.githubusercontent.com/JunWan666/dufs/main/docs/images/drag-overlay.png)

移动端与登录：窄屏自动重排，登录弹窗支持管理员与访客账号。

![移动端](https://raw.githubusercontent.com/JunWan666/dufs/main/docs/images/mobile-index.png)

更多界面截图与完整文档见 GitHub 仓库：<https://github.com/JunWan666/dufs>

## 支持架构

该镜像已经发布为多架构镜像：

- `linux/amd64`
- `linux/arm64`

## 镜像标签

- `tannic666/dufs:latest`
- `tannic666/dufs:v1.1.0`
- `tannic666/dufs:v1.0.0`

## 快速开始

镜像已内置默认端口、数据目录与权限开关，**不需要记任何参数**：

```sh
docker run --rm -p 5000:5000 -v "$PWD:/data" tannic666/dufs:latest
```

打开浏览器访问 `http://127.0.0.1:5000/`，即可浏览、上传、下载、搜索和打包下载文件。

在 NAS / Docker 面板（飞牛 fnOS、群晖、Portainer 等）里创建容器时：

- **端口 `5000` 与存储映射 `/data` 会被面板自动识别**，无需手填
- **命令栏留空即可**，启动后就能上传与拖拽文件
- 页面顶部会出现「设置密码」提示，点一下即可创建管理员账号（保存立即生效，无需重启容器）

启用后即可使用顶部工具栏上传文件，或直接把文件拖入浏览器窗口上传（拖拽时页面会显示目标目录提示）。

> 公网环境建议**先设置密码，再对外映射端口**。

## 可选：自定义启动参数

镜像内置 `CMD ["/data", "-A"]`，默认已开启上传、删除、搜索与打包下载，**以下两种场景才需要自己填命令**：

只读分享（禁止任何修改），命令栏填 `/data` 覆盖默认值：

```sh
docker run --rm -p 5000:5000 -v "$PWD:/data" tannic666/dufs:latest /data
```

不想用网页初始化、要直接固定账号密码：

```sh
docker run --rm -p 5000:5000 -v "$PWD:/data" tannic666/dufs:latest \
  -a admin:你的密码@/:rw \
  -a guest:你的密码@/
```

用 `-a` 配好账号后，页面不会再出现「设置密码」提示，直接用该账号登录即可（`admin` 可读写，`guest` 只读）。

## 访问控制

`-a, --auth` 选项用于控制不同账号可以访问的路径和权限：

```sh
-a admin:admin@/:rw
-a guest:guest@/
-a user:pass@/docs:rw,/public
-a @/
```

规则说明：

- `user:pass@/path:rw` 表示该账号对指定路径拥有读写权限。
- `user:pass@/path` 表示该账号对指定路径只有只读权限。
- `@/path` 表示允许匿名只读访问指定路径。
- 全局功能开关仍然生效。例如账号拥有 `:rw` 权限时，仍然需要通过 `-A` 或 `--allow-upload` 启用上传功能后才可以上传文件。

## 常用选项

```text
-A, --allow-all            允许上传、删除、搜索、目录打包下载和哈希计算
--allow-upload             允许上传文件和文件夹
--allow-delete             允许删除文件和文件夹
--allow-search             允许搜索文件和文件夹
--allow-archive            允许将文件夹打包下载
--hidden <patterns>        在文件列表中隐藏匹配的名称
--path-prefix <path>       在指定 URL 前缀下提供服务
--render-spa               启用单页应用 fallback
--enable-cors              启用 CORS
```

## WebDAV

Dufs 支持 `PROPFIND`、`MKCOL`、`COPY`、`MOVE`、`LOCK`、`UNLOCK` 等 WebDAV 方法，可以配合常见 WebDAV 客户端使用。

## 健康检查

```sh
curl http://127.0.0.1:5000/__dufs__/health
```

预期响应：

```json
{"status":"OK"}
```

## 注意事项

- 容器入口命令是 `/bin/dufs`。
- 镜像基于 `scratch`，仅包含静态链接后的可执行文件。
- 使用 `-v` 将需要共享的目录挂载到容器内。
- 二次开发部分与上游一致，遵循 MIT / Apache-2.0 授权。
