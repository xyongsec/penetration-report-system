# 🔐 渗透测试报告编写系统

一个功能完整的渗透测试报告编写和管理系统，提供AI辅助的报告生成、漏洞管理、用户管理等功能。

## 📋 功能模块

### 1. **报告编写模块** (`/report-write`)
编写渗透测试报告，包含以下信息：
- **基础信息**
  - 单位名称
  - 系统名称
  - 目标类型（Web网站、C/S客户端、手机APP、微信小程序）
  - 网络类型（内网测试、互联网测试）
  - 测试地址
  - 目标地址
  - 测试时间

- **漏洞信息**
  - 漏洞名称
  - 漏洞地址
  - 危险程度
  - 漏洞简介
  - 漏洞正文（支持图片上传）
  - 漏洞危害
  - 修复建议

### 2. **报告查询模块** (`/report-query`)
查询和浏览报告：
- ID | 单位名称 | 系统名称 | 作者 | 漏洞分布 | 编写日期 | 操作
- 支持关键词搜索
- 支持查看、编辑、删除报告

### 3. **漏洞管理模块** (`/vulnerability-manage`)
管理漏洞库：
- ID | 漏洞名称 | 漏洞等级 | CVE ID | 漏洞类型 | 受影响次数 | 操作
- 添加、编辑、删除漏洞
- 查看漏洞详情

### 4. **用户管理模块** (`/user-manage`)
管理系统用户：
- ID | 用户名 | 真实姓名 | 邮箱 | 角色 | 状态 | 上次登录 | 操作
- 添加、编辑、删除用户
- 重置用户密码
- 用户状态管理（激活/停用）
- 支持多角色（管理员、测试员、审计员、查看员）

### 5. **报告管理模块** (`/report-manage`)
统计和管理所有报告：
- ID | 单位名称 | 系统名称 | 漏洞分布 | 编写时间 | 操作
- 查看报告详情
- 下载报告为PDF
- 导出数据
- 统计仪表板（总报告数、总漏洞数、各等级漏洞统计）

## 🚀 快速开始

### 环境要求
- Node.js >= 14.0
- npm 或 yarn

### 安装依赖
```bash
npm install
```

### 开发环境运行
```bash
npm run dev
```

访问 `http://localhost:5173`

### 生产环境构建
```bash
npm run build
```

## 📁 项目结构

```
penetration-report-system/
├── public/                    # 静态资源
├── src/
│   ├── components/           # 公共组件
│   │   ├── Sidebar.vue      # 左侧菜单
│   │   ├── Header.vue       # 头部
│   │   └── Footer.vue       # 页脚
│   ├── views/               # 页面组件
│   │   ├── ReportWrite.vue      # 报告编写
│   │   ├── ReportQuery.vue      # 报告查询
│   │   ├── VulnerabilityManage.vue  # 漏洞管理
│   │   ├── UserManage.vue       # 用户管理
│   │   └── ReportManage.vue     # 报告管理
│   ├── App.vue              # 根组件
│   ├── main.js              # 入口文件
│   └── router.js            # 路由配置
├── index.html               # HTML模板
├── vite.config.js           # Vite配置
└── package.json             # 项目配置
```

## 🛠️ 技术栈

- **前端框架**: Vue.js 3
- **UI组件库**: Element Plus
- **路由**: Vue Router 4
- **HTTP客户端**: Axios
- **构建工具**: Vite
- **图标库**: @element-plus/icons-vue

## 🎨 界面特点

- 响应式设计
- 现代化UI风格
- 完整的表格操作
- 弹出对话框编辑
- 搜索和分页功能
- 数据统计展示

## 💾 数据持久化

当前系统使用模拟数据，实际部署时需要连接后端API：

```javascript
// API端点示例
/api/reports          # 报告相关
/api/vulnerabilities  # 漏洞相关
/api/users           # 用户相关
```

## 🔐 权限管理

系统支持4种角色：
- **管理员** (admin): 完全访问权限
- **测试员** (tester): 编写报告、查看数据
- **审计员** (auditor): 查看和审核报告
- **查看员** (viewer): 只读权限

## 📝 使用示例

### 编写报告
1. 进入"报告编写"模块
2. 填写基础信息
3. 点击"添加漏洞"按钮添加漏洞
4. 填写漏洞详情并上传相关图片
5. 点击"保存报告"提交

### 查询报告
1. 进入"报告查询"模块
2. 使用搜索框查找报告
3. 点击"查看"查看报告详情
4. 点击"编辑"修改报告
5. 点击"删除"删除报告

### 管理漏洞
1. 进入"漏洞管理"模块
2. 点击"添加漏洞"创建新漏洞
3. 编辑或删除已存在的漏洞
4. 查看漏洞详情和CVE信息

### 管理用户
1. 进入"用户管理"模块
2. 点击"添加用户"创建新用户
3. 编辑用户信息或重置密码
4. 启用/禁用用户账户
5. 删除不需要的用户

### 报告统计
1. 进入"报告管理"模块
2. 查看总体统计数据
3. 搜索特定报告
4. 下载报告为PDF
5. 导出所有数据

## 🔄 后端集成

本项目需要配套的后端API服务。后端应提供以下端点：

### 报告相关API
- `GET /api/reports` - 获取报告列表
- `POST /api/reports` - 创建报告
- `PUT /api/reports/:id` - 更新报告
- `DELETE /api/reports/:id` - 删除报告

### 漏洞相关API
- `GET /api/vulnerabilities` - 获取漏洞列表
- `POST /api/vulnerabilities` - 创建漏洞
- `PUT /api/vulnerabilities/:id` - 更新漏洞
- `DELETE /api/vulnerabilities/:id` - 删除漏洞

### 用户相关API
- `GET /api/users` - 获取用户列表
- `POST /api/users` - 创建用户
- `PUT /api/users/:id` - 更新用户
- `DELETE /api/users/:id` - 删除用户
- `POST /api/users/:id/reset-password` - 重置密码

### 文件上传
- `POST /api/upload` - 上传文件

## 📄 许可证

MIT

## 👨‍💻 开发者

开发于 2026年5月

## 🤝 贡献

欢迎提交问题和拉取请求！

## 📞 支持

如有任何问题，请联系项目维护者。
