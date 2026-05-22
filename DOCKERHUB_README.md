# Dufs

Dufs 是一个轻量级的网页文件管理器和 WebDAV 服务器。这个镜像包含重新设计的中文优先 UI，支持基于账号的访问控制、上传下载、文件编辑、目录打包下载、搜索、TLS 以及 WebDAV 操作。

## 支持架构

该镜像已经发布为多架构镜像：

- `linux/amd64`
- `linux/arm64`

## 镜像标签

- `tannic666/dufs:latest`
- `tannic666/dufs:v1.0.0`

## 快速开始

以只读模式共享当前目录：

```sh
docker run --rm -p 5000:5000 -v "$PWD:/data" tannic666/dufs:latest /data
```

打开浏览器访问：

```text
http://127.0.0.1:5000/
```

## 启用文件管理

允许上传、删除、搜索、目录打包下载和文件编辑：

```sh
docker run --rm -p 5000:5000 -v "$PWD:/data" tannic666/dufs:latest /data -A
```

## 使用登录账号

创建一个拥有完整权限的管理员账号，以及一个只读的访客账号：

```sh
docker run --rm -p 5000:5000 -v "$PWD:/data" tannic666/dufs:latest /data \
  -A \
  -a admin:admin@/:rw \
  -a guest:guest@/
```

打开 UI 后可使用以下账号登录：

```text
admin / admin
guest / guest
```

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
