#!/bin/bash

# 启动服务并测试登录功能
# Start service and test login functionality

echo "=========================================="
echo "智慧跳绳教学管理平台 - 服务启动与登录测试"
echo "Jump Rope Teaching Management Platform"
echo "Service Startup and Login Test"
echo "=========================================="
echo ""

# 检查依赖是否已安装
if [ ! -d "node_modules" ]; then
    echo "📦 安装依赖... / Installing dependencies..."
    npm install
    echo ""
fi

echo "🚀 启动开发服务器... / Starting development server..."
echo ""
echo "服务将在以下地址运行 / Service will run at:"
echo "  ➜  Local:   http://localhost:5173/"
echo ""
echo "📝 测试说明 / Test Instructions:"
echo "  1. 打开浏览器访问 http://localhost:5173/"
echo "     Open browser and visit http://localhost:5173/"
echo ""
echo "  2. 系统会自动跳转到登录页面"
echo "     System will automatically redirect to login page"
echo ""
echo "  3. 使用以下凭据登录："
echo "     Use the following credentials to login:"
echo "     - 用户名/Username: 任意 (例如: coach, admin, teacher)"
echo "     - 密码/Password: 123456 或 admin"
echo ""
echo "  4. 登录成功后可以访问所有功能"
echo "     After successful login, all features are accessible"
echo ""
echo "  5. 点击右上角的「退出」按钮可以退出登录"
echo "     Click the '退出' button in the top right to logout"
echo ""
echo "=========================================="
echo ""

# 启动开发服务器
npm run dev
