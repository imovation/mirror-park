# 叠加式全屏布局设计

## 背景

智慧校园可视化平台的页面布局从 CSS Grid 三列式（场景居中、左右面板并列）改为**3D 场景全屏铺满、UI 面板半透明叠加其上的 overlay 式布局**。

## 改动范围

### 受影响的文件

| 文件 | 改动类型 |
|------|----------|
| `src/components/layout/ScreenLayout.tsx` | 修改：移除 scene prop，Grid 中间列改为空白占位 |
| `src/App.tsx` | 修改：场景外提至独立 Layer，ScreenLayout 不再接收 scene |
| `src/components/ui/DashboardPanel.tsx` | 修改：新增 backdrop-filter blur |
| `src/components/layout/LeftPanel.tsx` | 修改：新增 backdrop-filter blur |
| `src/components/layout/RightPanel.tsx` | 修改：新增 backdrop-filter blur |
| `src/index.css` | 修改：浅色主题 `--panel-bg` 透明度调整 |

### 不受影响

- 各主题 scene/panel 组件
- SceneCanvas / CameraController 等 3D 组件
- TopBar / BottomBar 样式
- 6 个专题 store
- 测试用例（渲染结构未变）

## 架构

```
App.tsx
└── <div position:relative width:100vw height:100vh overflow:hidden>
    ├── Layer 0: <div position:absolute inset:0 z-index:0>
    │   └── ErrorBoundary → SceneCanvas → entry.scene()
    └── Layer 1: <div position:relative z-index:1 width:100% height:100%>
        └── ScreenLayout(topbar, left, right, bottombar)
            └── CSS Grid: 3 columns × 3 rows (中间列空白占位)
```

### ScreenLayout Grid

```css
grid-template-areas:
  "topbar  topbar  topbar"
  "left    .       right"
  "bottombar bottombar bottombar"

grid-template-rows:    minmax(48px, 4vh) 1fr minmax(28px, 2.5vh)
grid-template-columns: minmax(240px, 18vw) 1fr minmax(240px, 18vw)
```

`.` 表示空网格单元，不渲染任何内容，仅用于保持左右面板之间的间距。

### ScreenLayoutProps 接口

移除 `scene` 字段，仅保留 `topBar` / `leftPanel` / `rightPanel` / `bottomBar`。

## 面板样式

### backdrop-filter

所有面板容器（LeftPanel, RightPanel, DashboardPanel）新增：

```css
backdrop-filter: blur(6px)
-webkit-backdrop-filter: blur(6px)
```

### --panel-bg 调整

| 变量 | 深色主题 | 浅色主题 |
|------|---------|---------|
| `--panel-bg` | `rgba(0,0,0,0.35)`（不变） | `rgba(255,255,255,0.85)` → `rgba(255,255,255,0.7)` |

深色保持现状，浅色降低不透明度以使 3D 场景更明显。

## 注意事项

### 浏览器兼容

`backdrop-filter` 在 Chrome/Edge/Firefox/Safari 中均得到良好支持（参见 [Can I Use](https://caniuse.com/?search=backdrop-filter)）。无需 polyfill。

### 性能

`backdrop-filter: blur()` 每次面板内容变化或场景滚动时都会触发重绘。由于左右面板已设 `overflow: auto` 独立滚动，且场景没有背景滚动，仅在面板初始渲染时有一次 blur 计算开销，影响可忽略。

### 浅色主题面板不透明度

浅色 `--panel-bg: rgba(255,255,255,0.7)` + `backdrop-filter: blur(6px)` 组合下，白色背景的毛玻璃效果可能偏白。如感觉过白可在实现后微调至 0.65 或 0.75。

## 实现步骤

1. `ScreenLayout.tsx`：删除 scene prop 和对应 div，Grid 中间列改为 `.`
2. `App.tsx`：将场景渲染外提到 ScreenLayout 外部 Layer 0
3. `index.css`：调整浅色主题 `--panel-bg`
4. `DashboardPanel.tsx` / `LeftPanel.tsx` / `RightPanel.tsx`：新增 backdrop-filter
5. `pnpm build` 验证无编译错误
6. `pnpm dev` 验证 3D 场景全屏 + 面板叠加效果
