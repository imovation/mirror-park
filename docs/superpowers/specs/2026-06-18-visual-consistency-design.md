# 视觉一致性与动效优化设计

## 背景

Layout audit 发现了三类问题：CSS 变量体系缺失、多组件字号/间距/颜色不一致、动效缺失或误导性命名。本设计分三层推进修复。

## 改动范围

### Layer 1: CSS 变量体系

**文件:** `src/index.css`

新增变量（`:root` 和 `[data-ui-theme="light"]`）：

```css
:root {
  /* shadows — 新增 */
  --shadow-modal: 0 8px 32px rgba(0, 0, 0, 0.5);
  --shadow-toast: 0 4px 16px rgba(0, 0, 0, 0.3);
  --shadow-panel: 0 2px 8px rgba(0, 0, 0, 0.15);

  /* typography — 新增 */
  --font-family: 'Microsoft YaHei', 'PingFang SC', sans-serif;
  --font-size-xs: 0.7rem;
  --font-size-sm: 0.75rem;
  --font-size-md: 0.85rem;
  --font-size-lg: 1rem;
  --font-size-xl: 1.15rem;

  /* radii — 新增 */
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;

  /* transitions — 新增 */
  --transition-fast: 0.15s ease;
  --transition-normal: 0.3s ease;
  --transition-slow: 0.5s ease;

  /* spacing — 新增 */
  --panel-padding-x: 14px;
  --panel-padding-y: 8px;
}

[data-ui-theme="light"] {
  --shadow-modal: 0 8px 32px rgba(0, 0, 0, 0.12);
  --shadow-toast: 0 4px 16px rgba(0, 0, 0, 0.08);
  --shadow-panel: 0 2px 8px rgba(0, 0, 0, 0.06);
  --color-warning: #e6a000;  /* light 主题下黄色需加深对比度 */
}
```

全局 font-family 从硬编码改为 `var(--font-family)`：
```css
html, body, #root {
  font-family: var(--font-family);
}
```

### Layer 2: 视觉一致性统一

**文件变更:**

| 文件 | 改动 |
|------|------|
| `src/index.css` | `scene-loading` 边框颜色改用 `var(--accent-rgb)` |
| `src/config/chartTheme.ts` | `borderColor` 改用 `var(--page-bg)` |
| `src/components/layout/TopBar.tsx` | 字号 rem 化、按钮统一 padding、加 transition |
| `src/components/layout/BottomBar.tsx` | 字号从 `0.7em` 改为 `var(--font-size-xs)` |
| `src/components/ui/DashboardPanel.tsx` | 移除自身 margin/backdrop-filter、统一 padding |
| `src/components/ui/ScrollList.tsx` | 字号改为 `var(--font-size-sm)` |
| `src/components/ui/StatusPanel.tsx` | 消息字号改为 `var(--font-size-sm)` |
| `src/components/ui/NumberFlip.tsx` | Layer 3 重写（暂不改） |
| `src/components/ui/Modal.tsx` | boxShadow 改为 `var(--shadow-modal)` |
| `src/components/ui/VideoWindow.tsx` | boxShadow 改为 `var(--shadow-modal)` |
| `src/components/ui/AlertPopup.tsx` | 告警颜色改为 CSS 变量 |
| `src/components/layout/LeftPanel.tsx` | 合并到新文件 |
| `src/components/layout/RightPanel.tsx` | 由新文件替换 |
| `src/components/layout/SidePanel.tsx` | **新建** — LeftPanel+RightPanel 合并，两者完全相同 |

**字号映射表:**

| 组件 | 当前 | 改为 |
|------|------|------|
| TopBar 标题 | `20px` | `var(--font-size-xl)` |
| TopBar 导航/日期 | `13px` | `var(--font-size-md)` |
| TopBar 按钮 | `12px` | `var(--font-size-sm)` |
| DashboardPanel 标题 | `13px` | `var(--font-size-md)` |
| BottomBar 文字 | `0.7em` | `var(--font-size-xs)` |
| StatusPanel 消息 | `0.75rem` | `var(--font-size-sm)` |
| ScrollList 条目 | `12px` | `var(--font-size-sm)` |

**间距统一:**

| 组件 | 当前 | 改为 |
|------|------|------|
| DashboardPanel 标题 | `padding: 8px 14px` | `padding: var(--panel-padding-y) var(--panel-padding-x)` |
| DashboardPanel 内容 | `padding: 10px` | `padding: var(--panel-padding-y) var(--panel-padding-x)` |
| DashboardPanel 自身 | `margin: 6px 8px` → 移到 SidePanel |
| TopBar 按钮 | `4px 10px` / `4px 12px` / `4px 8px` | 统一 `4px 10px` |

**双倍模糊叠加修复:**
- LeftPanel (→SidePanel): 保留 `backdrop-filter: blur(6px)`
- DashboardPanel: 移除 `backdrop-filter` / `webkitBackdropFilter`（由 SidePanel 提供）

**AlertPopup 颜色:**
- `rgba(255,23,68,0.9)` → `rgba(var(--color-danger-rgb), 0.9)` — 需要新增 `--color-danger-rgb`
- `rgba(255,109,0,0.9)` → `rgba(var(--color-warning-rgb), 0.9)` — 需要新增 `--color-warning-rgb`
- `rgba(74,158,255,0.9)` → `rgba(var(--accent-rgb), 0.9)` — 已存在

`:root` 补齐：
```css
--color-danger-rgb: 255, 23, 68;
--color-warning-rgb: 255, 109, 0;
```

AlertPopup `color: '#fff'` 改为 `color: var(--text-primary)`。

**SidePanel 合并:**
```tsx
// src/components/layout/SidePanel.tsx
interface SidePanelProps { children: ReactNode }
export default function SidePanel({ children }: SidePanelProps) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100%',
      paddingTop: 4, backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
    }}>
      {children}
    </div>
  )
}
```
- `App.tsx`: import 改为 `SidePanel` 替代 `LeftPanel` / `RightPanel`
- `LeftPanel.tsx` / `RightPanel.tsx`: 删除

### Layer 3: 动效与交互增强

**文件变更:**

| 文件 | 改动 |
|------|------|
| `src/components/ui/NumberFlip.tsx` | 重写为真正的翻牌器 |
| `src/components/ui/ScrollList.tsx` | 修复 speed 参数，rAF 平滑滚动 |
| `src/components/ui/Modal.tsx` | 入场 fadeInUp + 离场过渡 |
| `src/components/ui/VideoWindow.tsx` | 入场 slideInRight + 离场过渡 |
| `src/components/ui/StatusPanel.tsx` | error/empty 加 fadeInUp |
| `src/components/ui/CardCarousel.tsx` | 箭头垂直居中修正 |
| `src/components/layout/TopBar.tsx` | 按钮 hover transition |

**NumberFlip 翻牌器设计:**

每数位一个滚动列（0-9 垂直排列），通过 `translateY` 滚动到目标值。使用 CSS `transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)`。

```tsx
// 核心结构
interface NumberFlipProps {
  value: number
  digits?: number
  color?: string
  fontSize?: string
}

// 每个数位列
function DigitRoll({ digit, color, fontSize }: { digit: number }) {
  return (
    <div style={{ height: '1em', overflow: 'hidden', display: 'inline-block' }}>
      <div style={{ transform: `translateY(-${digit * 100}%)`, transition: 'transform 0.6s cubic-bezier(0.4,0,0.2,1)' }}>
        {[0,1,2,3,4,5,6,7,8,9].map(n => (
          <div key={n} style={{ height: '1em', lineHeight: '1em' }}>{n}</div>
        ))}
      </div>
    </div>
  )
}
```

**ScrollList speed 修复:**

```tsx
// 关键改动
useEffect(() => {
  let lastTime = performance.now()
  let scrollPos = 0
  let rafId: number

  const animate = (now: number) => {
    const dt = (now - lastTime) / 1000
    lastTime = now
    if (!isPaused) {
      scrollPos += speed * dt          // ← 使用 speed prop (px/s)
      if (scrollPos >= maxScroll) scrollPos = 0
      if (listRef.current) listRef.current.scrollTop = scrollPos
    }
    rafId = requestAnimationFrame(animate)
  }

  rafId = requestAnimationFrame(animate)
  return () => cancelAnimationFrame(rafId)
}, [isPaused, speed, maxScroll])
```

**Modal 动画:**

入场 `className="panel-enter"`（复用 `fadeInUp`）。离场：关闭时先设 `opacity: 0`，250ms 后 commit `onClose()`。

**VideoWindow 动画:**

入场复用 `slideInRight` keyframe。离场同 Modal 逻辑。

**CardCarousel 箭头居中:**

当前 `top: 50%` 在 dots 容器上，改为在卡片区域计算：
```tsx
// 改为绝对定位父容器为卡片区域
top: 'calc(50% - 12px)'  // 减去 dots 高度一半
```

**StatusPanel error/empty:**
```tsx
// error/empty 状态 div 加 animation
animation: 'fadeInUp 0.35s ease-out'
```

## 不受影响

- `SceneCanvas` / `CameraController` / `CampusBase` — 3D 渲染链
- `dayNightTheme.ts` — 3D 场景视觉参数
- 所有 6 个专题的 scene/panel 内容组件
- `ScreenLayout.tsx` — 布局结构
- 数据查询 / SSE / Zustand stores
- 测试用例

## 注意事项

### rem 的基准

`html` 的 `font-size` 为 `calc(12px + 0.25vw)`。在 1920px 下约 `16.8px`，因此 `1rem ≈ 16.8px`。`var(--font-size-md)` = `0.85rem ≈ 14.3px`，原值 `13px` 接近但略大。所有字号会随视口等比缩放。

### AlertPopup color-rgb 变量

`--accent-rgb` 已存在。需新增 `--color-danger-rgb: 255, 23, 68` 和 `--color-warning-rgb: 255, 109, 0`。light 主题下 `--color-warning-rgb` 保持不变——黄色本身偏亮无需调暗，且 AlertPopup 始终以半透明背景 + 深色文字显示。

### SidePanel 合并

LeftPanel 和 RightPanel 完全相同，合并为 `SidePanel.tsx` 后 `App.tsx` 中 import 改为 `SidePanel`。两个用法位置使用同一组件。

### 数字翻牌器的性能

每数位一个 `0-9` 滚动列（10 个 `<div>`），使用 `will-change: transform` + `transition`。6 位数翻牌器约 60 个小 div——性能可忽略。

## 实现顺序

1. Layer 1: `index.css` 新增 CSS 变量
2. Layer 2: 字号 rem 化 + 间距统一 + 颜色变量化 + SidePanel 合并
3. Layer 3: NumberFlip 重写 → ScrollList 修复 → Modal/VideoWindow 动画 → 其他微调
4. 验证: `pnpm build` + `pnpm test` + `pnpm dev` 视觉效果确认
