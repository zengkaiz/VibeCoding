# 播客独立站设计方案

## 一、数据结构分析

### 1.1 数据路径
```
podcast.json
└── props.pageProps.podcast
    ├── title: "造物矩阵｜超级个体开放麦"
    ├── author: "Cell细胞"
    ├── description: 播客简介
    ├── image: { picUrl, thumbnailUrl, ... }
    ├── color: { original, light, dark }
    ├── episodeCount: 9
    ├── podcasters: [] (主播信息)
    ├── contacts: [] (联系方式)
    └── episodes: [] (节目列表)
        └── episode
            ├── eid: 唯一ID
            ├── title: 节目标题
            ├── description: 详细描述(含时间轴)
            ├── duration: 时长(秒)
            ├── pubDate: 发布日期
            ├── image: 节目封面
            ├── enclosure.url: 音频文件URL
            ├── playCount: 播放量
            └── ...
```

### 1.2 关键数据字段
- **音频URL**: `episode.enclosure.url` 或 `episode.media.source.url`
- **时长**: `episode.duration` (秒，需转换为 mm:ss)
- **时间轴**: 在 `episode.description` 中，格式如 `00:00｜开场`
- **标签**: 从 description 中的 `🏷️关键词标签` 部分提取

---

## 二、技术栈选择建议

### 方案对比

| 维度 | 原生 HTML/CSS/JS | React + Vite |
|------|------------------|--------------|
| 开发速度 | 慢（手动DOM操作） | 快（组件化） |
| 代码维护 | 困难（代码重复多） | 简单（组件复用） |
| 状态管理 | 手动（播放器状态） | Context/Hooks |
| 路由管理 | Hash路由（手动） | React Router |
| 构建工具 | 无需 | Vite (快速) |
| 学习曲线 | 低 | 中 |
| 扩展性 | 差 | 好 |

### **推荐方案：React + Vite** ✅

**理由**：
1. **数据复杂度高**：9期节目，每期数据丰富，React 数据驱动更高效
2. **播放器状态管理**：播放/暂停、进度、当前播放等状态，React Hooks 更方便
3. **组件复用**：节目卡片、播放器、标签等可复用组件
4. **路由需求**：`/` 列表页 → `/episode/:id` 详情页
5. **后期扩展**：搜索、筛选、收藏等功能容易添加
6. **开发体验**：Vite HMR 热更新，开发效率高

**技术栈**：
```
React 18 + Vite 5
React Router 6 (路由)
原生 CSS / Tailwind CSS (样式)
HTML5 Audio API (音频播放)
```

---

## 三、功能模块设计

### 3.1 页面结构

```
src/
├── pages/
│   ├── Home.jsx           # 播客列表页
│   └── EpisodeDetail.jsx  # 节目详情页
├── components/
│   ├── Header.jsx         # 顶部导航
│   ├── EpisodeCard.jsx    # 节目卡片
│   ├── AudioPlayer.jsx    # 音频播放器
│   ├── ChapterList.jsx    # 章节列表
│   └── TagList.jsx        # 标签列表
├── context/
│   └── PlayerContext.jsx  # 播放器全局状态
├── utils/
│   ├── formatTime.js      # 时间格式化
│   └── parseChapters.js   # 解析时间轴
├── data/
│   └── podcast.json       # 数据文件
└── App.jsx                # 根组件
```

---

### 3.2 播客列表页 (Home)

#### 布局
```
┌──────────────────────────────────────────┐
│ Header (Logo + 导航)                      │
├──────────────────────────────────────────┤
│ Hero 区域                                 │
│ ┌────────┐                               │
│ │ 播客   │  造物矩阵｜超级个体开放麦      │
│ │ 封面   │  简介...                       │
│ └────────┘  订阅者 90                     │
├──────────────────────────────────────────┤
│ 节目列表 (共9期)                          │
│ ┌─────────────────────────────────────┐  │
│ │ ┌──┐  EP9: 从大厂程序员到X增长教练   │  │
│ │ │封│  简介摘要...                    │  │
│ │ │面│  1h 52m | 77播放 | 2025-10-18  │  │
│ │ └──┘  [▶播放] #副业 #X增长          │  │
│ └─────────────────────────────────────┘  │
│ ┌─────────────────────────────────────┐  │
│ │ EP8: ...                             │  │
│ └─────────────────────────────────────┘  │
├──────────────────────────────────────────┤
│ Footer (联系方式 + 版权)                  │
└──────────────────────────────────────────┘
```

#### 功能点
- ✅ 展示播客基本信息（封面、标题、简介）
- ✅ 节目列表按发布日期倒序
- ✅ 每个节目卡片显示：
  - 节目封面（正方形，150x150）
  - 标题 + 期数
  - 简介摘要（提取第一句或前100字）
  - 时长、播放量、发布日期
  - 快速播放按钮
  - 标签
- ✅ 点击卡片/标题进入详情页
- ✅ 点击播放按钮在当前页播放（底部播放器）

---

### 3.3 节目详情页 (EpisodeDetail)

#### 布局
```
┌──────────────────────────────────────────┐
│ Header                                    │
├──────────────────────────────────────────┤
│ ┌──────┐                                 │
│ │      │  第9期: 从大厂程序员到X增长教练  │
│ │ 封面 │  Cell细胞 | 2025-10-18          │
│ │      │  1h 52m | 77 播放               │
│ │ 400px│  [▶ 播放全部] [⭐收藏] [🔗分享]  │
│ └──────┘                                 │
├──────────────────────────────────────────┤
│ 📝 一句话简介                             │
│ 从大厂程序员到...                         │
├──────────────────────────────────────────┤
│ 📖 详细介绍                               │
│ (长文本，保留换行格式)                     │
├──────────────────────────────────────────┤
│ ⏩ 时间轴章节 (可点击跳转)                 │
│ 00:00 | 开场                              │
│ 00:26 | 主持人抛题                        │
│ 01:36 | 琳月自我介绍                      │
│ ...                                       │
├──────────────────────────────────────────┤
│ 🏷️ 标签                                  │
│ #X增长 #个人品牌 #去杠杆 ...              │
├──────────────────────────────────────────┤
│ 💬 更多节目                               │
│ [其他节目卡片 x 3]                        │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│ 固定底部播放器                            │
│ [◀◀] [▶] [▶▶] ━━━◉━━━━ 12:30/1:52:45   │
│ 当前播放：第9期 - ...     [🔊] [1.0x]    │
└──────────────────────────────────────────┘
```

#### 功能点
- ✅ 显示完整节目信息
- ✅ 解析并展示时间轴章节
- ✅ 点击章节跳转到对应时间
- ✅ 解析标签（从 description 中提取 # 开头的关键词）
- ✅ 推荐相关节目（同标签或最新）
- ✅ 分享功能（复制链接）

---

### 3.4 音频播放器 (全局)

#### 位置
- 固定在底部（`position: fixed; bottom: 0;`）
- 悬浮在所有内容之上（`z-index: 1000`）
- 支持页面切换时继续播放

#### 功能
```
┌────────────────────────────────────────────────────────┐
│ [封面] 正在播放：第X期 - 标题 (点击展开详情)             │
│ [◀◀15s] [▶/⏸] [▶▶15s] ━━━━━◉━━━━━━━━ 12:30 / 1:52:45 │
│ [🔊音量] [⚡倍速 1.0x] [📋章节] [下载]                   │
└────────────────────────────────────────────────────────┘
```

#### 核心功能
- ✅ 播放/暂停
- ✅ 进度条拖拽
- ✅ 快退/快进 15秒
- ✅ 倍速播放（0.5x, 0.75x, 1.0x, 1.25x, 1.5x, 2.0x）
- ✅ 音量控制
- ✅ 显示当前播放节目信息
- ✅ 章节列表弹窗（点击跳转）
- ✅ 记忆播放进度（localStorage）
- ✅ 键盘快捷键：
  - `Space`: 播放/暂停
  - `←/→`: 快退/快进
  - `↑/↓`: 音量增减

---

## 四、设计风格

### 4.1 色彩方案
```css
:root {
  /* 主色调（来自播客主题色） */
  --primary: #DCC54C;
  --primary-light: #E8D77B;
  --primary-dark: #C4B03A;

  /* 辅助色 */
  --secondary: #E0DCC7;

  /* 中性色 */
  --bg: #FFFFFF;
  --bg-gray: #F8F8F8;
  --border: #E5E5E5;
  --text-primary: #333333;
  --text-secondary: #666666;
  --text-muted: #999999;

  /* 功能色 */
  --success: #52C41A;
  --error: #FF4D4F;
}
```

### 4.2 字体
```css
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI',
               'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei',
               sans-serif;
  font-size: 16px;
  line-height: 1.6;
  color: var(--text-primary);
}
```

### 4.3 设计原则
1. **简洁优先**：去除不必要的装饰，突出内容
2. **对比清晰**：标题/正文/辅助信息层次分明
3. **间距舒适**：卡片间距 24px，内容内边距 20px
4. **响应式**：移动端优先，自适应桌面
5. **可访问性**：键盘导航、屏幕阅读器支持

---

## 五、数据处理工具函数

### 5.1 时间格式化
```javascript
// formatTime.js
export function formatDuration(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  if (h > 0) {
    return `${h}h ${m}m`;
  }
  return `${m}m ${s}s`;
}

export function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
}
```

### 5.2 章节解析
```javascript
// parseChapters.js
export function parseChapters(description) {
  const lines = description.split('\n');
  const chapters = [];

  for (const line of lines) {
    // 匹配格式：00:00｜章节标题 或 00:00:00｜章节标题
    const match = line.match(/(\d{1,2}:\d{2}(?::\d{2})?)\s*[｜|]\s*(.+)/);
    if (match) {
      chapters.push({
        time: match[1],
        title: match[2].trim(),
        seconds: timeToSeconds(match[1])
      });
    }
  }

  return chapters;
}

function timeToSeconds(timeStr) {
  const parts = timeStr.split(':').map(Number);
  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }
  return parts[0] * 3600 + parts[1] * 60 + parts[2];
}
```

### 5.3 标签提取
```javascript
// extractTags.js
export function extractTags(description) {
  // 查找 🏷️关键词标签 部分
  const tagSection = description.match(/🏷️.*\n(.*?)(?:\n\n|$)/s);
  if (!tagSection) return [];

  const tags = tagSection[1].match(/#[\w\u4e00-\u9fa5]+/g) || [];
  return tags.map(tag => tag.substring(1)); // 去除 #
}
```

---

## 六、响应式设计

### 断点
```css
/* 移动端 */
@media (max-width: 640px) {
  .episode-card {
    flex-direction: column;
  }
}

/* 平板 */
@media (min-width: 641px) and (max-width: 1024px) {
  .episodes-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* 桌面 */
@media (min-width: 1025px) {
  .episodes-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

---

## 七、路由设计

```javascript
// App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/episode/:eid" element={<EpisodeDetail />} />
      </Routes>
    </BrowserRouter>
  );
}
```

---

## 八、开发计划

### Phase 1: 基础框架 (1-2天)
- [x] 创建 Vite + React 项目
- [x] 配置路由
- [x] 导入 podcast.json 数据
- [x] 创建基础组件结构

### Phase 2: 列表页 (1天)
- [x] Header 组件
- [x] Hero 区域（播客信息）
- [x] EpisodeCard 组件
- [x] 节目列表渲染

### Phase 3: 详情页 (1-2天)
- [x] 节目详情布局
- [x] 章节解析与显示
- [x] 标签提取与显示
- [x] 相关推荐

### Phase 4: 播放器 (2-3天)
- [x] AudioPlayer 组件（固定底部）
- [x] 播放/暂停/进度控制
- [x] 倍速、音量控制
- [x] 章节跳转
- [x] 播放状态全局管理（Context）
- [x] 播放进度记忆（localStorage）

### Phase 5: 优化与部署 (1天)
- [x] 样式优化
- [x] 响应式适配
- [x] SEO 优化（meta tags）
- [x] 构建与部署

---

## 九、总结

### 为什么选 React？
1. **数据复杂**：9期节目，每期字段多，React 数据驱动更高效
2. **状态管理**：播放器全局状态（播放/暂停、进度、当前播放）
3. **组件复用**：节目卡片、标签、时间轴等多处复用
4. **路由需求**：列表页 ↔ 详情页切换，React Router 简单
5. **后期扩展**：搜索、筛选、收藏等功能容易添加
6. **开发效率**：Vite HMR + React DevTools，开发体验好

### 如果坚持用原生？
可以，但需要：
- 手动实现路由（Hash 路由）
- 手动管理播放器状态（全局变量）
- 大量 DOM 操作和字符串拼接
- 代码量约 2-3 倍于 React 方案

**建议：React + Vite，开发快、好维护、易扩展。**
