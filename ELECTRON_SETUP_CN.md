# Electron 桌面客户端打包指南

## 为什么使用 Electron？

✅ **不需要 HTTPS** - Electron 应用作为本地客户端运行，`getUserMedia()` 可以直接访问摄像头和麦克风
✅ **更好的用户体验** - 用户可以直接下载安装，不需要浏览器
✅ **自动权限管理** - 可以在代码中自动处理媒体设备权限
✅ **跨平台支持** - 一次开发，可以打包为 Windows、macOS 和 Linux 应用

## 已完成的配置

### 1. 创建了 `electron-main.js`
这是 Electron 的主进程文件，功能包括：
- 启动本地 Express 服务器
- 创建应用窗口
- 自动处理摄像头/麦克风权限请求

### 2. 更新了 `package.json`
添加了：
- Electron 相关依赖
- 打包脚本命令
- Electron Builder 配置

## 使用方法

### 安装依赖

```bash
# 安装 Electron 和打包工具
npm install
```

### 开发模式运行

```bash
# 先构建前端资源
npm run build

# 启动 Electron 应用
npm run electron
```

或者一步到位：
```bash
npm run electron
```

### 打包为桌面应用

#### macOS
```bash
npm run package-mac
```
生成的文件在 `dist/` 目录下

#### Windows
```bash
npm run package-win
```
生成 `.exe` 安装包和便携版

#### Linux
```bash
npm run package-linux
```
生成 `.AppImage` 和 `.deb` 包

#### 全平台打包
```bash
npm run package-all
```
同时生成 macOS、Windows 和 Linux 版本

## 视频功能的优势

在 Electron 客户端中：

1. **无需 HTTPS** - `navigator.mediaDevices.getUserMedia()` 可以直接工作
2. **权限自动批准** - 代码中已设置自动允许媒体设备访问
3. **更稳定** - 不受浏览器策略变化影响

## 项目结构

```
conclave/
├── electron-main.js          # Electron 主进程
├── app.js                    # Express 服务器
├── package.json              # 包含 Electron 配置
├── lib/                      # 源代码
│   ├── controller.js         # 包含视频功能
│   └── ...
├── public/                   # 静态资源
└── dist/                     # 打包输出目录（运行打包后生成）
```

## 调试技巧

### 打开开发者工具
在 `electron-main.js` 中取消这行注释：
```javascript
mainWindow.webContents.openDevTools();
```

### 查看日志
- **主进程日志**：在终端中显示
- **渲染进程日志**：在开发者工具的 Console 中显示

## 常见问题

### Q: 打包后的应用很大？
A: 这是正常的，Electron 会包含完整的 Chromium 和 Node.js 运行时。可以通过以下方式优化：
- 在 `package.json` 的 `build.files` 中只包含必要文件
- 使用 `electron-builder` 的压缩选项

### Q: 视频功能在打包后不工作？
A: 检查：
1. 确保 `npm run build` 已执行，前端代码已编译
2. 检查 PeerJS 服务器连接
3. 查看开发者工具中的错误信息

### Q: 如何修改应用图标？
A: 替换 `public/assets/img/` 目录中的图标文件，并更新 `package.json` 中的 `build.mac.icon`、`build.win.icon` 和 `build.linux.icon` 路径。

## 分发应用

打包后，你会在 `dist/` 目录找到：

- **macOS**: `.dmg` 安装包和 `.zip` 压缩包
- **Windows**: `.exe` 安装程序和便携版
- **Linux**: `.AppImage` 和 `.deb` 包

用户下载后直接安装即可使用，**无需任何额外配置，视频功能开箱即用**！

## 与 Web 版本的对比

| 特性 | Web 版本 | Electron 版本 |
|------|---------|---------------|
| 视频功能 | ❌ 需要 HTTPS | ✅ 直接可用 |
| 部署 | 需要服务器和 SSL 证书 | 直接分发应用 |
| 更新 | 自动 | 需要发布新版本 |
| 安装 | 无需安装 | 需要下载安装 |
| 跨平台 | 浏览器支持 | 需要分别打包 |

## 下一步

1. 测试开发模式：`npm run electron`
2. 确认视频功能正常工作
3. 根据需要调整窗口大小和样式
4. 打包为桌面应用分发给用户

## 技术支持

如果遇到问题：
1. 检查 Node.js 版本（建议 14.x 或更高）
2. 确保所有依赖已正确安装
3. 查看 Electron 和 PeerJS 的官方文档
