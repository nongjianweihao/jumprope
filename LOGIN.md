# 登录系统说明 / Login System Documentation

## 概述 / Overview

本系统已实现基础登录功能，用于保护教学管理平台的访问权限。

The system now includes basic login functionality to protect access to the teaching management platform.

## 功能特性 / Features

- ✅ 用户登录验证 / User login authentication
- ✅ 会话持久化（使用 localStorage）/ Session persistence (using localStorage)
- ✅ 受保护的路由 / Protected routes
- ✅ 自动重定向到登录页 / Auto-redirect to login page
- ✅ 退出登录功能 / Logout functionality
- ✅ 用户信息显示 / User info display

## 快速开始 / Quick Start

### 1. 启动服务 / Start the Service

```bash
# 方式 1: 使用启动脚本
./start-and-test.sh

# 方式 2: 直接使用 npm
npm install
npm run dev
```

### 2. 访问应用 / Access the Application

打开浏览器访问：http://localhost:5173/

Open your browser and visit: http://localhost:5173/

### 3. 登录 / Login

系统会自动跳转到登录页面。使用以下凭据：

The system will automatically redirect to the login page. Use the following credentials:

**演示账号 / Demo Credentials:**
- 用户名 / Username: 任意用户名（例如：coach, admin, teacher）
- 密码 / Password: `123456` 或 `admin`

**示例 / Examples:**
- Username: `coach` / Password: `123456` ✅
- Username: `admin` / Password: `admin` ✅
- Username: `teacher` / Password: `123456` ✅

## 技术实现 / Technical Implementation

### 文件结构 / File Structure

```
src/
├── store/
│   └── authStore.ts              # 认证状态管理 / Auth state management
├── pages/
│   └── login.tsx                 # 登录页面 / Login page
├── components/
│   ├── ProtectedRoute.tsx        # 路由保护组件 / Route protection component
│   └── NavigationMenu.tsx        # 导航菜单（含退出按钮） / Navigation with logout
└── App.tsx                       # 路由配置 / Route configuration
```

### 核心组件 / Core Components

#### 1. 认证状态管理 (authStore.ts)
- 使用 Zustand 进行状态管理
- 会话数据持久化到 localStorage
- 提供 login/logout 方法

#### 2. 登录页面 (login.tsx)
- 简洁美观的登录界面
- 表单验证
- 错误提示
- 成功后自动跳转

#### 3. 路由保护 (ProtectedRoute.tsx)
- 检查用户认证状态
- 未登录用户自动重定向到登录页
- 已登录用户可正常访问

#### 4. 导航菜单更新
- 显示当前登录用户名
- 提供退出登录按钮

## 用户流程 / User Flow

```
1. 访问任意页面
   ↓
2. 检查认证状态
   ↓
3a. 未登录 → 重定向到 /login
   ↓
4a. 输入凭据并登录
   ↓
5a. 验证成功 → 跳转到首页

3b. 已登录 → 显示页面内容
   ↓
4b. 点击「退出」按钮
   ↓
5b. 清除会话 → 返回登录页
```

## 安全说明 / Security Notes

⚠️ **当前为演示版本** / **Current Demo Version**

本实现为演示目的的简化版本，具有以下特点：

This is a simplified implementation for demonstration purposes with the following characteristics:

1. **硬编码凭据** / **Hardcoded Credentials**
   - 密码验证在前端进行
   - 任何用户名 + 正确密码即可登录

2. **本地会话存储** / **Local Session Storage**
   - 使用 localStorage 持久化
   - 无服务器端会话验证

3. **适用场景** / **Suitable For**
   - 本地开发和演示
   - 单机版教学管理系统
   - PWA 离线应用

### 生产环境建议 / Production Recommendations

如需部署到生产环境，建议实现：

For production deployment, it's recommended to implement:

1. ✅ 后端 API 认证
2. ✅ JWT Token 或 Session Cookie
3. ✅ 密码加密存储
4. ✅ HTTPS 传输
5. ✅ 刷新 Token 机制
6. ✅ 登录失败限制
7. ✅ 多因素认证（可选）

## 常见问题 / FAQ

### Q1: 忘记密码怎么办？
**A:** 演示版本密码为 `123456` 或 `admin`，无法修改。

### Q2: 如何添加新用户？
**A:** 当前版本接受任意用户名，只需使用正确的密码即可。生产版本需要实现用户注册功能。

### Q3: 退出后为什么还能看到页面？
**A:** 这是浏览器缓存导致的。刷新页面后会重新检查认证状态。

### Q4: 如何禁用登录功能？
**A:** 修改 `src/App.tsx`，移除 `<ProtectedRoute>` 包裹即可。

## 后续改进 / Future Improvements

- [ ] 集成后端 API
- [ ] 实现用户注册
- [ ] 添加角色权限管理
- [ ] 实现密码重置功能
- [ ] 添加记住我功能
- [ ] 支持第三方登录（OAuth）
- [ ] 添加登录日志

## 联系方式 / Contact

如有问题或建议，请提交 Issue。

For questions or suggestions, please submit an issue.
