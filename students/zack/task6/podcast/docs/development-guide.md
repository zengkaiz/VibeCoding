# 开发指南

## 环境要求

- Node.js >= 16.0.0
- npm >= 7.0.0

## 开发流程

### 1. 初次开发

```bash
# 1. 克隆项目
git clone <your-repo-url>
cd xiaoyuzhou

# 2. 进入前端目录
cd frontend

# 3. 安装依赖
npm install

# 4. 启动开发服务器
npm run dev
```

### 2. 项目运行

开发服务器将在 `http://localhost:3000` 启动。

### 3. 功能测试清单

#### 播客列表页测试
- [ ] 播客基本信息显示正确（封面、标题、简介）
- [ ] 主播信息显示正确
- [ ] 节目列表按时间倒序排列
- [ ] 节目卡片显示完整（封面、标题、时长、播放量、日期、标签）
- [ ] 悬停卡片显示播放按钮
- [ ] 点击卡片进入详情页
- [ ] 点击播放按钮开始播放

#### 节目详情页测试
- [ ] 返回按钮功能正常
- [ ] 节目信息完整显示
- [ ] 一句话简介显示正确
- [ ] 详细介绍显示正确（保留换行）
- [ ] 时间轴章节正确解析
- [ ] 点击章节可跳转播放
- [ ] 标签正确提取和显示
- [ ] 相关推荐显示其他节目
- [ ] 分享按钮功能正常（复制链接）

#### 播放器测试
- [ ] 播放器在底部固定显示
- [ ] 播放/暂停按钮正常
- [ ] 进度条拖拽功能正常
- [ ] 进度条点击跳转正常
- [ ] 快退15秒按钮正常
- [ ] 快进15秒按钮正常
- [ ] 时间显示正确（当前时间/总时长）
- [ ] 音量控制正常
- [ ] 倍速播放正常（0.5x ~ 2.0x）
- [ ] 章节列表弹窗显示正常
- [ ] 点击章节跳转播放
- [ ] 页面切换时播放器状态保持
- [ ] 播放进度自动保存
- [ ] 重新播放时恢复进度
- [ ] 点击封面展开播放器
- [ ] 展开状态显示完整章节列表

#### 键盘快捷键测试
- [ ] Space: 播放/暂停
- [ ] ← : 快退15秒
- [ ] → : 快进15秒
- [ ] ↑ : 音量增加
- [ ] ↓ : 音量减少

#### 响应式测试
- [ ] 桌面端（> 1024px）显示正常
- [ ] 平板端（640px ~ 1024px）显示正常
- [ ] 移动端（< 640px）显示正常
- [ ] 播放器在移动端正常使用
- [ ] 章节列表在移动端可滚动

#### 浏览器兼容性测试
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

## 常见开发问题

### Q: 修改代码后页面没有更新？
A: Vite 支持 HMR（热模块替换），正常情况下会自动刷新。如果没有，尝试：
1. 手动刷新浏览器（Ctrl/Cmd + R）
2. 重启开发服务器

### Q: 如何调试播放器？
A:
1. 打开浏览器开发者工具（F12）
2. 在 Console 面板查看日志
3. 在 Sources 面板设置断点
4. 使用 React DevTools 查看组件状态

### Q: 如何修改数据？
A:
1. 修改 `frontend/podcast.json`
2. 页面会自动热更新
3. 注意 JSON 格式必须正确

### Q: 如何添加新功能？
A:
1. 在 `src/components/` 创建新组件
2. 在需要的页面引入组件
3. 使用 `usePlayer()` Hook 访问播放器状态
4. 添加对应的 CSS 文件

## 代码规范

### 组件规范

```jsx
// 1. 导入顺序：React -> 第三方库 -> 本地组件 -> 工具函数 -> 样式
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePlayer } from '../context/PlayerContext';
import { formatTime } from '../utils/formatTime';
import './Component.css';

// 2. 组件使用默认导出
export default function Component() {
  // 3. Hooks 在顶部
  const [state, setState] = useState();

  // 4. 事件处理函数
  const handleClick = () => {
    // ...
  };

  // 5. 返回 JSX
  return (
    <div className="component">
      {/* ... */}
    </div>
  );
}
```

### CSS 规范

```css
/* 1. 使用 CSS Variables */
.component {
  color: var(--text-primary);
  background: var(--bg);
}

/* 2. 使用 BEM 命名（可选）*/
.component__element {
  /* ... */}

.component--modifier {
  /* ... */
}

/* 3. 响应式媒体查询写在最后 */
@media (max-width: 640px) {
  .component {
    /* ... */
  }
}
```

### 工具函数规范

```javascript
/**
 * 函数说明
 * @param {type} paramName - 参数说明
 * @returns {type} 返回值说明
 */
export function utilFunction(param) {
  // 实现
}
```

## Git 工作流

```bash
# 1. 创建功能分支
git checkout -b feature/new-feature

# 2. 开发功能
# ... 编写代码 ...

# 3. 提交更改
git add .
git commit -m "feat: 添加新功能"

# 4. 推送到远程
git push origin feature/new-feature

# 5. 创建 Pull Request
```

### Commit 规范

- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建/工具相关

## 构建部署

### 本地构建

```bash
cd frontend
npm run build
```

构建产物在 `frontend/dist` 目录。

### 预览构建产物

```bash
npm run preview
```

### 部署到 Vercel

1. 在项目根目录创建 `vercel.json`:

```json
{
  "buildCommand": "cd frontend && npm install && npm run build",
  "outputDirectory": "frontend/dist",
  "framework": "vite"
}
```

2. 推送到 GitHub
3. 在 Vercel 导入项目
4. 自动部署

## 性能优化建议

1. **图片优化**
   - 使用 WebP 格式
   - 添加懒加载
   - 使用 CDN

2. **代码分割**
   - React Router 已支持路由级别的代码分割
   - 大型组件可使用 `React.lazy()`

3. **音频优化**
   - 使用 CDN 托管音频文件
   - 考虑使用渐进式音频格式

4. **缓存策略**
   - 设置正确的 HTTP 缓存头
   - 使用 Service Worker（可选）

## 问题排查

### 播放器无法播放

1. 检查音频 URL 是否可访问
2. 检查浏览器控制台是否有错误
3. 确认音频格式兼容（推荐 MP3/M4A）
4. 检查是否有 CORS 问题

### 样式错乱

1. 检查 CSS 文件是否正确导入
2. 使用浏览器开发者工具检查样式
3. 确认 CSS Variables 定义正确

### 路由跳转失败

1. 检查 `BrowserRouter` 配置
2. 确认路由路径正确
3. 检查是否有拼写错误

## 联系支持

如有问题，请：
1. 查看 [README.md](../README.md)
2. 查看 [设计文档](../docs/design.md)
3. 提交 Issue
