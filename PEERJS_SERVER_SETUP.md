# 如何切换 PeerJS 服务器

## 问题
如果你发现无法复制分享链接，很可能是 PeerJS 服务器宕机或连接失败。

## 解决方案

### 方法 1: 使用配置文件切换（推荐）

1. 打开 `lib/peerConfig.js` 文件
2. 修改最后的 `export default` 行来切换服务器：

```javascript
// 使用 PeerJS 公共服务器（默认）
export default PEERJS_PUBLIC_SERVER;

// 或者使用本地 PeerServer
export default CUSTOM_LOCAL_SERVER;

// 或者使用云端自建服务器
export default CUSTOM_CLOUD_SERVER;

// 或者让 PeerJS 自动选择
export default AUTO_CONFIG;
```

3. 运行 `npm run build` 重新构建
4. 刷新浏览器

### 方法 2: 搭建自己的 PeerServer（最可靠）

如果官方服务器不稳定，建议搭建自己的 PeerServer：

#### 本地测试：

```bash
# 安装 PeerServer
npm install -g peer

# 运行 PeerServer
peerjs --port 9000 --key peerjs

# 然后在 peerConfig.js 中切换到 CUSTOM_LOCAL_SERVER
```

#### 生产环境（云端部署）：

1. 在你的服务器上安装 peer package：
```bash
npm install peer
```

2. 创建 `peerserver.js`：
```javascript
const { PeerServer } = require('peer');

const server = PeerServer({
  port: 9000,
  path: '/myapp',
  key: 'peerjs'
});

console.log('PeerServer running on port 9000');
```

3. 运行：
```bash
node peerserver.js
```

4. 在 `lib/peerConfig.js` 中修改 `CUSTOM_CLOUD_SERVER` 配置：
```javascript
const CUSTOM_CLOUD_SERVER = {
  host: 'your-server.com',  // 你的服务器地址
  port: 9000,
  path: '/myapp',
  secure: true,  // 如果使用 HTTPS
  debug: 3
};
```

### 方法 3: 使用其他公共 PeerServer

你也可以尝试其他公共 PeerServer：

```javascript
// 示例：使用另一个公共服务器
const ALTERNATIVE_SERVER = {
  host: '0.peerjs.com',
  port: 443,
  path: '/',
  secure: true,
  debug: 3
};
```

## 调试步骤

1. 打开浏览器控制台（F12）
2. 查看是否有 PeerJS 相关错误
3. 检查是否看到 "PeerJS connection established with ID: xxx"
4. 如果没有，说明 PeerJS 连接失败

## 常见错误

### 错误 1: "Could not connect to PeerServer"
**原因**: PeerJS 服务器宕机或网络问题
**解决**: 切换到其他服务器或自建服务器

### 错误 2: "Share link not ready yet"
**原因**: PeerJS 还在连接中
**解决**: 等待几秒后再点击复制

### 错误 3: "Network error"
**原因**: 防火墙或网络限制
**解决**: 检查防火墙设置，确保允许 WebRTC 连接

## 推荐配置

生产环境推荐使用自建 PeerServer，这样：
- ✅ 更可靠
- ✅ 更快速
- ✅ 更可控
- ✅ 更安全

开发环境可以使用公共服务器进行快速测试。

## 验证是否成功

成功连接后，你应该在控制台看到：
```
PeerJS connection established with ID: xxxxx
Share link updated: https://your-domain.com?xxxxx
```

然后点击复制按钮，应该能看到：
```
Copying to clipboard: https://your-domain.com?xxxxx
Successfully copied to clipboard
```
