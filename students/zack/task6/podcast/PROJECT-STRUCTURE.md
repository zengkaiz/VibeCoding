# 项目目录结构

```
xiaoyuzhou/                          # 项目根目录
│
├── frontend/                        # 前端代码目录
│   ├── src/                        # 源代码
│   │   ├── components/             # UI 组件
│   │   │   ├── Header.jsx          # 顶部导航
│   │   │   ├── Header.css
│   │   │   ├── Footer.jsx          # 底部信息
│   │   │   ├── Footer.css
│   │   │   ├── EpisodeCard.jsx     # 节目卡片
│   │   │   ├── EpisodeCard.css
│   │   │   ├── AudioPlayer.jsx     # ⭐ 音频播放器
│   │   │   └── AudioPlayer.css
│   │   │
│   │   ├── pages/                  # 页面组件
│   │   │   ├── Home.jsx            # 列表页
│   │   │   ├── Home.css
│   │   │   ├── EpisodeDetail.jsx   # 详情页
│   │   │   └── EpisodeDetail.css
│   │   │
│   │   ├── context/                # 全局状态
│   │   │   └── PlayerContext.jsx   # ⭐ 播放器状态管理
│   │   │
│   │   ├── utils/                  # 工具函数
│   │   │   ├── formatTime.js       # 时间格式化
│   │   │   ├── parseChapters.js    # 章节解析
│   │   │   ├── extractTags.js      # 标签提取
│   │   │   └── storage.js          # 本地存储
│   │   │
│   │   ├── App.jsx                 # 根组件
│   │   ├── App.css                 # 全局样式
│   │   └── main.jsx                # 入口文件
│   │
│   ├── podcast.json                # ⭐ 播客数据（9期节目）
│   ├── index.html                  # HTML 模板
│   ├── package.json                # 依赖配置
│   ├── vite.config.js              # Vite 配置
│   └── .gitignore
│
├── docs/                           # 文档目录
│   ├── design.md                   # 设计文档
│   ├── development-guide.md        # 开发指南
│   └── podacast.md                 # 其他文档
│
├── README.md                       # ⭐ 项目主文档
├── QUICKSTART.md                   # ⭐ 快速启动指南
├── TODO.md                         # ⭐ 任务清单
├── DELIVERY.md                     # ⭐ 交付总结
└── podcast.json                    # 原始数据备份
```

## 📁 目录说明

### `/frontend` - 前端代码
完整的 React + Vite 项目，包含所有源代码和配置文件。

### `/frontend/src/components` - UI 组件
可复用的 UI 组件，包括头部、底部、卡片和播放器。

### `/frontend/src/pages` - 页面组件
路由页面组件，包括列表页和详情页。

### `/frontend/src/context` - 全局状态
使用 React Context API 管理播放器全局状态。

### `/frontend/src/utils` - 工具函数
纯函数工具库，用于数据处理。

### `/docs` - 文档
设计文档和开发指南。

## 🔑 核心文件

### 必读文档
1. **README.md** - 从这里开始了解项目
2. **QUICKSTART.md** - 快速启动和测试指南
3. **TODO.md** - 详细任务清单和进度
4. **DELIVERY.md** - 项目交付总结

### 核心代码
1. **AudioPlayer.jsx** - 音频播放器核心
2. **PlayerContext.jsx** - 播放器状态管理
3. **podcast.json** - 播客数据

## 📊 文件统计

- **React 组件**: 9个（.jsx + .css）
- **工具函数**: 4个模块
- **文档文件**: 8个
- **配置文件**: 4个
- **总文件数**: 30+

## 🚀 快速启动

```bash
# 1. 进入前端目录
cd frontend

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev

# 4. 访问
http://localhost:3000
```

详见 **QUICKSTART.md**
