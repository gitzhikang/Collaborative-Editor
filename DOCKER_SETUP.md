# Docker 配置说明

## 镜像架构

项目现在使用两个独立的 Docker 镜像：

### 1. `conclave-server` - Web 服务器
- **Dockerfile**: `Dockerfile.server`
- **端口**: 3000
- **用途**: 运行 Express.js Web 应用，提供协作编辑器界面
- **启动命令**: `npm start`

### 2. `conclave-peer` - PeerJS 信令服务器
- **Dockerfile**: `Dockerfile.peer`
- **端口**: 9000
- **用途**: 运行 PeerJS 服务器，处理 WebRTC 连接
- **启动命令**: `peerjs --port 9000 --key peerjs`

## 使用方法

### 快速开始
```bash
# 构建并启动所有服务
make run-local
```

### 单独操作

```bash
# 只构建镜像
make build-all          # 构建所有镜像
make build-server       # 只构建 Web 服务器镜像
make build-peer         # 只构建 PeerJS 镜像

# 启动服务
make peer-server        # 启动 PeerJS 服务器（后台）
make server             # 启动 Web 服务器（前台）

# 停止服务
make stop               # 停止所有容器

# 清理
make clean              # 停止容器并删除镜像

# 查看状态和日志
make status             # 查看运行状态
make logs-server        # 查看 Web 服务器日志
make logs-peer          # 查看 PeerJS 服务器日志
```

### 手动 Docker 命令

如果你想手动控制：

```bash
# 构建
docker build -f Dockerfile.server -t conclave-server .
docker build -f Dockerfile.peer -t conclave-peer .

# 运行
docker run -d --rm -p 9000:9000 --name conclave-peer conclave-peer
docker run --rm -p 3000:3000 --name conclave-server -e DEBUG=express:* conclave-server

# 停止
docker stop conclave-server conclave-peer
```

## 优势

### 与之前单一镜像相比的改进：

1. **镜像更小**: 
   - PeerJS 镜像只有约 150MB（只包含 Node.js + peer 包）
   - Web 服务器镜像约 500MB（包含所有应用代码和依赖）

2. **端口更清晰**: 每个容器只暴露自己需要的端口

3. **独立扩展**: 可以单独重启或扩展某个服务而不影响另一个

4. **更好的隔离**: 两个服务在不同的容器中运行，互不干扰

5. **便于调试**: 可以单独查看每个服务的日志

## 访问应用

启动服务后：
- Web 界面: http://localhost:3000
- PeerJS 服务器: http://localhost:9000 (后台运行)

## 注意事项

1. **启动顺序**: Makefile 已配置为先启动 PeerJS 服务器，等待 2 秒后再启动 Web 服务器
2. **网络连接**: 两个容器通过主机网络通信（都绑定到 localhost）
3. **自动清理**: 使用 `--rm` 参数，容器停止后自动删除
