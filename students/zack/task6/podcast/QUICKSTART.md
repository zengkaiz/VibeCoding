# 🚀 快速启动指南

## ✅ 项目已完成

所有代码已创建完成，现在可以启动测试了！

---

## 📦 步骤 1: 修复 npm 权限（如果遇到权限错误）

如果安装依赖时遇到 `EACCES` 错误，运行：

```bash
sudo chown -R $(whoami) ~/.npm
```

或者：

```bash
sudo chown -R 503:20 "/Users/zhang/.npm"
```

---

## 🔧 步骤 2: 安装依赖

```bash
cd /Users/zhang/Documents/my/code/xiaoyuzhou/frontend
npm install
```

预期安装的依赖：
- react@18.3.1
- react-dom@18.3.1
- react-router-dom@6.26.2
- vite@5.4.1
- @vitejs/plugin-react@4.3.1

---

## 🎬 步骤 3: 启动开发服务器

```bash
npm run dev
```

服务器将在 **http://localhost:3000** 启动。

---

## ✨ 步骤 4: 功能测试

### 首页测试
1. 打开 http://localhost:3000
2. 应该能看到：
   - 播客封面和标题："造物矩阵｜超级个体开放麦"
   - 主播信息（Cell细胞、琳月_Lynn）
   - 9期节目列表

### 播放器测试
1. 点击任一节目的播放按钮
2. 底部应出现播放器
3. 测试功能：
   - 播放/暂停
   - 快退/快进 15秒
   - 拖动进度条
   - 调整音量
   - 切换倍速（点击 1.0x 按钮）
   - 查看章节列表（点击 📋 按钮）

### 详情页测试
1. 点击任一节目卡片（非播放按钮）
2. 应该跳转到详情页
3. 查看：
   - 完整的节目信息
   - 时间轴章节（可点击跳转）
   - 标签列表
   - 相关推荐

### 键盘快捷键测试
- `Space`: 播放/暂停
- `←`: 快退 15秒
- `→`: 快进 15秒
- `↑`: 音量增加
- `↓`: 音量减少

---

## 📱 响应式测试

### 桌面端
浏览器窗口宽度 > 1024px

### 平板端
1. 打开浏览器开发者工具（F12）
2. 切换到设备模拟模式
3. 选择 iPad 或调整窗口宽度到 768px

### 移动端
选择 iPhone 或调整窗口宽度到 375px

---

## 🐛 常见问题排查

### 1. 依赖安装失败

**方法 1**: 清除缓存重试
```bash
npm cache clean --force
npm install
```

**方法 2**: 使用 yarn
```bash
npm install -g yarn
yarn install
yarn dev
```

**方法 3**: 删除 node_modules 重试
```bash
rm -rf node_modules package-lock.json
npm install
```

### 2. 端口 3000 被占用

修改 `vite.config.js` 中的端口：
```javascript
server: {
  port: 3001,  // 改成其他端口
  open: true
}
```

### 3. 播放器无法播放音频

**原因**: 音频文件可能无法访问

**检查**:
1. 打开浏览器控制台（F12 -> Console）
2. 查看是否有网络错误
3. 尝试直接访问音频 URL

**临时解决**: podcast.json 中的音频 URL 是外部 CDN，确保网络连接正常

### 4. 样式显示异常

1. 确认所有 CSS 文件都已正确导入
2. 清除浏览器缓存（Ctrl/Cmd + Shift + R）
3. 检查浏览器控制台是否有 CSS 加载错误

---

## 📊 项目结构一览

```
frontend/
├── src/
│   ├── components/          # UI组件
│   │   ├── Header.jsx       # 顶部导航
│   │   ├── Footer.jsx       # 底部信息
│   │   ├── EpisodeCard.jsx  # 节目卡片
│   │   └── AudioPlayer.jsx  # 音频播放器 ⭐
│   ├── pages/              # 页面
│   │   ├── Home.jsx        # 列表页
│   │   └── EpisodeDetail.jsx  # 详情页
│   ├── context/            # 全局状态
│   │   └── PlayerContext.jsx  # 播放器状态
│   ├── utils/              # 工具函数
│   │   ├── formatTime.js   # 时间格式化
│   │   ├── parseChapters.js  # 章节解析
│   │   ├── extractTags.js  # 标签提取
│   │   └── storage.js      # 本地存储
│   ├── App.jsx             # 根组件
│   ├── App.css             # 全局样式
│   └── main.jsx            # 入口文件
├── podcast.json            # 播客数据 ⭐
├── index.html
├── package.json
└── vite.config.js
```

---

## 🎯 核心功能清单

### ✅ 已实现
- [x] 播客列表页
- [x] 节目详情页
- [x] 全功能音频播放器
  - [x] 播放/暂停/快进/快退
  - [x] 进度条拖拽
  - [x] 音量控制
  - [x] 倍速播放（0.5x ~ 2.0x）
  - [x] 章节跳转
  - [x] 播放进度记忆
  - [x] 键盘快捷键
- [x] 时间轴章节解析
- [x] 标签提取和显示
- [x] 响应式设计
- [x] 路由导航

### 📝 可选增强
- [ ] 搜索功能
- [ ] 节目筛选（按标签）
- [ ] 收藏功能
- [ ] 分享卡片生成
- [ ] 深色模式
- [ ] 播放列表

---

## 🛠️ 开发命令

```bash
# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

---

## 🚀 构建和部署

### 构建生产版本

```bash
npm run build
```

构建产物在 `dist/` 目录。

### 部署到 Vercel

1. 安装 Vercel CLI:
```bash
npm install -g vercel
```

2. 登录并部署:
```bash
vercel
```

3. 或者直接在 Vercel 网站导入 GitHub 仓库

### 部署到 Netlify

1. 连接 GitHub 仓库
2. 设置构建命令: `cd frontend && npm run build`
3. 设置发布目录: `frontend/dist`
4. 点击部署

---

## 📞 获取帮助

- **项目文档**: 查看 `README.md`
- **开发指南**: 查看 `docs/development-guide.md`
- **任务清单**: 查看 `TODO.md`
- **设计文档**: 查看 `docs/design.md`

---

## 🎉 完成了！

如果一切正常，你现在应该能看到一个完整可用的播客网站了！

**下一步**:
1. ✅ 测试所有功能
2. 📝 根据需求调整样式
3. 🚀 部署到生产环境

祝使用愉快！🎵
