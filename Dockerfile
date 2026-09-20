FROM --platform=linux/amd64 messense/rust-musl-cross:x86_64-musl AS amd64
COPY . .
RUN cargo install --path . --root /

FROM --platform=linux/amd64 messense/rust-musl-cross:aarch64-musl AS arm64
COPY . .
RUN cargo install --path . --root /

FROM ${TARGETARCH} AS builder

FROM scratch
COPY --from=builder /bin/dufs /bin/dufs
STOPSIGNAL SIGINT

# 让 Docker 面板（飞牛 / Portainer / 群晖 / 1Panel）能自动识别端口与存储映射
EXPOSE 5000
VOLUME /data
WORKDIR /data

ENTRYPOINT ["/bin/dufs"]
# 默认服务 /data 并开启上传 / 删除 / 搜索 / 打包下载；
# 只想做只读分享时，把容器命令改为 /data 即可覆盖
CMD ["/data", "-A"]
