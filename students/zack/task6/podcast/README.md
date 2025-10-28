# 造物矩阵｜超级个体开放麦 - 播客独立站

一个基于 React + Vite 构建的现代化播客网站，支持音频播放、章节跳转、播放进度记忆等功能。

## 特性

- ✅ **播客列表页**：展示所有节目，支持快速播放
- ✅ **节目详情页**：完整的节目信息、时间轴章节、标签展示
- ✅ **全功能播放器**：
  - 播放/暂停、快进/快退 15秒
  - 倍速播放（0.5x ~ 2.0x）
  - 音量控制
  - 章节跳转
  - 播放进度记忆（localStorage）
  - 键盘快捷键支持
- ✅ **响应式设计**：完美适配桌面、平板、手机
- ✅ **数据驱动**：基于 JSON 数据文件，易于更新

## 项目结构

```
xiaoyuzhou/
├── frontend/                # 前端代码目录
│   ├── src/
│   │   ├── components/      # 组件
│   │   │   ├── Header.jsx   # 顶部导航
│   │   │   ├── Footer.jsx   # 底部信息
│   │   │   ├── EpisodeCard.jsx  # 节目卡片
│   │   │   └── AudioPlayer.jsx  # 音频播放器
│   │   ├── pages/           # 页面
│   │   │   ├── Home.jsx     # 列表页
│   │   │   └── EpisodeDetail.jsx  # 详情页
│   │   ├── context/         # 全局状态
│   │   │   └── PlayerContext.jsx  # 播放器状态管理
│   │   ├── utils/           # 工具函数
│   │   │   ├── formatTime.js      # 时间格式化
│   │   │   ├── parseChapters.js   # 解析章节
│   │   │   ├── extractTags.js     # 提取标签
│   │   │   └── storage.js         # 本地存储
│   │   ├── App.jsx          # 根组件
│   │   ├── App.css          # 全局样式
│   │   └── main.jsx         # 入口文件
│   ├── podcast.json         # 播客数据
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── docs/                    # 文档
│   └── design.md            # 设计文档
└── podcast.json             # 原始数据（备份）
```

## 快速开始

### 1. 安装依赖

```bash
cd frontend
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

### 3. 构建生产版本

```bash
npm run build
```

构建产物在 `frontend/dist` 目录。

### 4. 预览生产版本

```bash
npm run preview
```

## 技术栈

- **框架**: React 18
- **构建工具**: Vite 5
- **路由**: React Router 6
- **样式**: 原生 CSS（CSS Variables + Flexbox + Grid）
- **音频**: HTML5 Audio API
- **数据**: 静态 JSON

## 主要功能说明

### 播放器全局状态管理

使用 React Context API 管理播放器状态，实现跨页面持续播放。

```jsx
// PlayerContext 提供的 API
const {
  currentEpisode,    // 当前播放的节目
  isPlaying,         // 是否正在播放
  currentTime,       // 当前播放时间
  duration,          // 总时长
  playEpisode,       // 播放节目
  togglePlay,        // 播放/暂停切换
  seekTo,            // 跳转到指定时间
  skip,              // 快进/快退
  changeVolume,      // 调整音量
  changePlaybackRate // 调整播放速度
} = usePlayer();
```

### 播放进度记忆

使用 localStorage 自动保存每个节目的播放进度：

```javascript
// 保存进度（每10秒自动保存）
saveProgress(episodeId, currentTime, duration);

// 恢复进度（播放时自动恢复）
const progress = getProgress(episodeId);
```

### 时间轴章节解析

从节目描述中自动解析时间轴章节：

```
支持格式:
00:00｜开场
01:30 | 嘉宾介绍
01:01:05｜深度讨论
```

### 标签提取

自动从描述中提取 `#标签`：

```
🏷️关键词标签
#副业 #AI #创业 #超级个体
```

### 键盘快捷键

- `Space`: 播放/暂停
- `←/→`: 快退/快进 15秒
- `↑/↓`: 音量增减

## 数据格式

播客数据存储在 `podcast.json`，格式如下：

```json
{
  "props": {
    "pageProps": {
      "podcast": {
        "title": "播客标题",
        "author": "作者",
        "description": "简介",
        "episodes": [
          {
            "eid": "节目ID",
            "title": "节目标题",
            "description": "详细描述（含时间轴和标签）",
            "duration": 6740,
            "enclosure": {
              "url": "音频文件URL"
            },
            "image": {
              "picUrl": "封面图URL"
            }
          }
        ]
      }
    }
  }
}
```

## 样式设计

### 色彩方案

```css
--primary: #DCC54C;         /* 主色调 - 金黄色 */
--primary-light: #E8D77B;   /* 浅色 */
--primary-dark: #C4B03A;    /* 深色 */
--secondary: #E0DCC7;       /* 辅助色 - 米色 */
```

### 响应式断点

- 移动端: < 640px
- 平板: 640px ~ 1024px
- 桌面: > 1024px

## 浏览器支持

- Chrome (推荐)
- Firefox
- Safari
- Edge

需支持 ES6+ 和 HTML5 Audio API。

## 部署

### Vercel (推荐)

1. 将代码推送到 GitHub
2. 在 Vercel 导入项目
3. 设置根目录为 `frontend`
4. 自动部署

### Netlify

1. 连接 GitHub 仓库
2. 设置 Build command: `cd frontend && npm run build`
3. 设置 Publish directory: `frontend/dist`
4. 部署

### 服务器部署

```bash
cd frontend
npm run build
# 将 dist 目录上传到服务器
# 配置 Nginx/Apache 指向 dist 目录
```

## 更新数据

替换 `frontend/podcast.json` 文件，重新构建即可。

## 开发建议

1. **添加新节目**：更新 `podcast.json` 中的 `episodes` 数组
2. **修改主题色**：调整 `App.css` 中的 CSS Variables
3. **自定义组件**：所有组件都在 `src/components/` 目录
4. **扩展功能**：可参考 `docs/design.md` 中的设计文档

## 常见问题

### Q: 如何更改播客信息？
A: 修改 `podcast.json` 中的 `podcast` 对象。

### Q: 如何添加更多节目？
A: 在 `podcast.json` 的 `episodes` 数组中添加新的节目对象。

### Q: 播放器不显示章节？
A: 确保节目描述中包含时间轴格式：`00:00｜章节标题`

### Q: 如何自定义样式？
A: 修改各组件的 `.css` 文件，或调整 `App.css` 中的全局变量。

### Q: 音频文件如何托管？
A: 建议使用 CDN 托管音频文件，在 `podcast.json` 中填写完整的音频 URL。

## License

MIT

## 贡献

欢迎提交 Issue 和 Pull Request！

## 联系方式

- 播客主页: [小宇宙](https://www.xiaoyuzhoufm.com/podcast/685bb06b04741dab58813384)
- 微信公众号: Cellinlab
- X (Twitter): @cellinlab

---

Made with ❤️ by React + Vite
