#!/bin/bash
# Collaborative Editor Electron 快速启动脚本

echo "==================================="
echo "Collaborative Editor Electron 客户端启动脚本"
echo "==================================="
echo ""

# 检查 Node.js 是否安装
if ! command -v node &> /dev/null; then
    echo "❌ 错误：未找到 Node.js"
    echo "请先安装 Node.js: https://nodejs.org/"
    exit 1
fi

echo "✓ Node.js 版本: $(node --version)"
echo ""

# 检查依赖是否已安装
if [ ! -d "node_modules" ]; then
    echo "📦 正在安装依赖..."
    npm install
    echo ""
fi

# 检查 Electron 是否已安装
if [ ! -d "node_modules/electron" ]; then
    echo "📦 正在安装 Electron..."
    npm install electron electron-builder --save-dev
    echo ""
fi

# 构建前端资源
echo "🔨 正在构建前端资源..."
npm run build
echo ""

# 启动 Electron 应用
echo "🚀 启动 Electron 应用..."
echo ""
npm run electron-dev
