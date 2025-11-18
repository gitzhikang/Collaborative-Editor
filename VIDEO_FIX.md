# 视频通话问题修复说明

## 问题描述
在使用 Electron 构建项目时，发起视频通话后可以给别人打视频，但对方看不到你的画面。

## 问题根源

### 原始代码的问题
1. **本地流未保存**：在 `broadcast.js` 中，`videoCall()` 和 `answerCall()` 方法虽然通过 `peer.call(id, ms)` 和 `callObj.answer(ms)` 发送了本地媒体流，但没有保存这个流的引用。

2. **只显示远程流**：`controller.js` 中的 `streamVideo()` 方法只显示接收到的远程流（对方的画面），没有显示本地预览（自己的画面）。

3. **用户体验问题**：用户无法看到自己的画面，不知道对方是否能看到自己，也无法调整摄像头角度。

## 解决方案

### 修改 1: broadcast.js - 保存本地流
```javascript
// 在 videoCall 方法中
videoCall(id, ms) {
  if (!this.currentStream) {
    const callObj = this.peer.call(id, ms);
    callObj.localStream = ms; // 保存本地流
    this.onStream(callObj);
  }
}

// 在 answerCall 方法中
answerCall(callObj, ms) {
  if (!this.currentStream) {
    callObj.answer(ms);
    callObj.localStream = ms; // 保存本地流
    this.controller.answerCall(callObj.peer);
    this.onStream(callObj);
  }
}
```

### 修改 2: controller.js - 添加本地视频预览
```javascript
// 在 streamVideo 方法中添加本地预览
if (callObj.localStream) {
  this.showLocalVideo(callObj.localStream, doc);
}

// 新增 showLocalVideo 方法
showLocalVideo(localStream, doc=document) {
  // 创建本地视频预览元素（画中画效果）
  let localVid = doc.querySelector('.local-video-preview');
  
  if (!localVid) {
    localVid = doc.createElement('video');
    localVid.className = 'local-video-preview';
    localVid.muted = true; // 静音以避免回声
    // 设置样式：右下角小窗口
    localVid.style.position = 'absolute';
    localVid.style.bottom = '10px';
    localVid.style.right = '10px';
    localVid.style.width = '150px';
    // ... 其他样式
  }
  
  localVid.srcObject = localStream;
  localVid.play();
}
```

### 修改 3: controller.js - 清理资源
在 `closeVideo` 和 `bindVideoEvents` 方法中添加本地视频流的清理逻辑：
```javascript
// 停止本地视频流
if (localVid && localVid.srcObject) {
  localVid.srcObject.getTracks().forEach(track => track.stop());
  localVid.srcObject = null;
  localVid.remove();
}
```

## 技术细节

### 视频流的工作原理
1. **本地流** (`localStream`): 通过 `getUserMedia` 获取的本地摄像头/麦克风流
2. **远程流** (`remoteStream`): 通过 PeerJS 接收的对方的视频流

### 画中画布局
- **大窗口**: 显示对方的画面（远程流）
- **小窗口**: 显示自己的画面预览（本地流，右下角）
  - 位置: 右下角
  - 尺寸: 150px 宽度
  - 静音: 防止音频反馈

### 资源管理
- 关闭视频时必须停止所有媒体轨道 (`track.stop()`)
- 清空 `srcObject` 引用
- 移除动态创建的 DOM 元素

## 测试建议

1. **发起通话测试**:
   - 点击对方头像发起视频通话
   - 检查是否能看到自己的小窗口预览
   - 检查对方是否能看到你的画面

2. **接听通话测试**:
   - 等待对方呼叫
   - 点击接听
   - 检查双方是否都能看到彼此

3. **资源清理测试**:
   - 点击关闭按钮
   - 检查摄像头指示灯是否熄灭
   - 检查本地预览窗口是否被移除

## 注意事项

1. **HTTPS 要求**: WebRTC 需要 HTTPS（localhost 除外）
2. **权限请求**: 首次使用需要用户授权摄像头和麦克风
3. **浏览器兼容性**: 确保使用现代浏览器（Chrome/Firefox/Edge）
4. **Electron 环境**: 确保 Electron 的安全策略允许访问媒体设备

## 相关文件
- `/lib/broadcast.js` - WebRTC 连接管理
- `/lib/controller.js` - UI 控制和视频显示
- `/views/layout.pug` - HTML 模板（包含 video 元素）
