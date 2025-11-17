// PeerJS 服务器配置
// 你可以在这里轻松切换不同的 PeerJS 服务器

// 选项 1: PeerJS 官方公共服务器（新版本）
const PEERJS_PUBLIC_SERVER = {
  host: '0.peerjs.com',
  port: 443,
  path: '/',
  secure: true,
  debug: 3,
  config: {
    'iceServers': [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' }
    ]
  }
};

// 选项 2: 自己搭建的 PeerServer（需要先运行 peerjs-server）
// 安装: npm install -g peer
// 运行: peerjs --port 9000
const CUSTOM_LOCAL_SERVER = {
  host: 'vcm-49756.vm.duke.edu',  // 使用当前访问的主机名
  port: 9000,
  path: '/',
  secure: false,
  debug: 3,
  config: {
    'iceServers': [
      { urls: 'stun:stun.l.google.com:19302' }
    ]
  }
};

// 选项 3: 云端自建 PeerServer（替换成你自己的服务器地址）
const CUSTOM_CLOUD_SERVER = {
  host: 'your-server.com',  // 替换成你的服务器地址
  port: 443,
  path: '/myapp',
  secure: true,
  debug: 3,
  config: {
    'iceServers': [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' }
    ]
  }
};

// 选项 4: 最小配置（让 PeerJS 自动选择）
const AUTO_CONFIG = {
  debug: 3
};

// 导出当前使用的配置
// 切换服务器只需修改这一行
export default CUSTOM_LOCAL_SERVER;

// 如果要切换到其他服务器，取消注释下面对应的行：
// export default CUSTOM_LOCAL_SERVER;
// export default CUSTOM_CLOUD_SERVER;
// export default AUTO_CONFIG;
