# 构建所有镜像
build-all: build-server build-peer

# 构建 Web 服务器镜像
build-server:
	docker build -f Dockerfile.server -t conclave-server .

# 构建 PeerJS 服务器镜像
build-peer:
	docker build -f Dockerfile.peer -t conclave-peer .

# 本地运行（先构建，然后启动两个服务）
run-local: build-all
	@make peer-server
	@sleep 2
	@make server

# 启动 Web 服务器（前台运行，方便查看日志）
server:
	docker run --rm -p 3000:3000 --name conclave-server -e DEBUG=express:* conclave-server

# 启动 PeerJS 服务器（后台运行）
peer-server:
	docker run -d --rm -p 9000:9000 --name conclave-peer conclave-peer

# 停止所有容器
stop:
	@docker stop conclave-server 2>/dev/null || true
	@docker stop conclave-peer 2>/dev/null || true

# 清理镜像
clean: stop
	@docker rmi conclave-server 2>/dev/null || true
	@docker rmi conclave-peer 2>/dev/null || true

# 查看运行状态
status:
	@echo "=== Running Containers ==="
	@docker ps --filter "name=conclave" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# 查看日志
logs-server:
	docker logs -f conclave-server

logs-peer:
	docker logs -f conclave-peer

