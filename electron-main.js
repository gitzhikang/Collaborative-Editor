const { app, BrowserWindow } = require('electron');
const path = require('path');
const express = require('express');
const peer = require('peer');

let mainWindow;
let expressApp;
let server;

function createServer() {
  // 创建 Express 应用
  expressApp = express();
  
  expressApp.use(express.static('public'));
  expressApp.set('views', path.join(__dirname, 'views'));
  expressApp.set('view engine', 'pug');

  expressApp.get('/', function (req, res) {
    res.render('index', {title: 'Conclave'});
  });

  expressApp.get('/about', function (req, res) {
    res.render('about', {title: 'About'});
  });

  expressApp.get('/bots', function(req, res) {
    res.render('bots', {title: 'Talk to Bots'});
  });

  expressApp.get('/idLength', function (req, res) {
    res.render('idGraph');
  });

  expressApp.get('/opTime', function (req, res) {
    res.render('timeGraph');
  });

  expressApp.get('/arraysGraph', function (req, res) {
    res.render('arraysGraph');
  });
  
  // 启动本地服务器
  server = expressApp.listen(0, 'localhost', () => {
    const port = server.address().port;
    console.log(`Local server running on http://localhost:${port}`);
    
    // 设置 PeerJS 服务器
    expressApp.use('/peerjs', peer.ExpressPeerServer(server, {
      debug: true
    }));
    
    // 服务器启动后创建窗口
    createWindow(port);
  });
}

function createWindow(port) {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      // 允许访问摄像头和麦克风
      webSecurity: true,
    },
    icon: path.join(__dirname, 'public/assets/img/favicon.ico')
  });

  // 加载本地服务器
  mainWindow.loadURL(`http://localhost:${port}`);

  // 开发模式下打开开发者工具
  // mainWindow.webContents.openDevTools();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // 处理摄像头/麦克风权限请求
  mainWindow.webContents.session.setPermissionRequestHandler((webContents, permission, callback) => {
    if (permission === 'media' || permission === 'mediaKeySystem') {
      // 自动允许媒体设备访问
      callback(true);
    } else {
      callback(false);
    }
  });
}

app.on('ready', createServer);

app.on('window-all-closed', () => {
  if (server) {
    server.close();
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createServer();
  }
});

// 在应用退出前关闭服务器
app.on('before-quit', () => {
  if (server) {
    server.close();
  }
});
