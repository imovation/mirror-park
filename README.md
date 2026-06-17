# 智慧校园可视化平台

东莞滨海湾镇远中学数字孪生大屏展示系统。采用 Three.js (R3F) + React + ECharts 构建，将校园物理空间与业务数据融合，在大屏端集中呈现校园运行状态。

支持 **白天/夜间** 两种 3D 视觉模式 + **深色/浅色** UI 主题，TopBar 一键切换。

建筑模型采用学校风格重构：红砖主体 + 白色楼板带/外走廊/女儿墙，教学三栋楼由连廊连接，崇智楼中央拱门式校门，独立钟楼展示校名。

## 技术栈

| 类别 | 选型 |
|------|------|
| 框架 | React 18 + TypeScript |
| 构建 | Vite 5 + pnpm |
| 3D 引擎 | Three.js via @react-three/fiber (R3F) + @react-three/drei |
| 后处理 | @react-three/postprocessing (Bloom 辉光) |
| 数据可视化 | ECharts 5 (Bar/Line/Pie/Ring/Gauge/Heatmap/Treemap/Sankey/Sunburst/Funnel/Radar) |
| 状态管理 | Zustand |
| 数据请求 | TanStack Query v5 |
| 实时推送 | SSE (Server-Sent Events)，Dev 模式自动 Mock |
| Mock | MSW + @faker-js/faker |
| 样式 | TailwindCSS + CSS 变量 (深色/浅色主题) |
| 测试 | Vitest + @testing-library/react + Playwright |

## 启动

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm build      # 生产构建到 dist/
pnpm test       # 运行所有测试 (35 单元 + 8 E2E)
```

## 专题模块

| 专题 | 面板数 | 3D 场景 |
|------|--------|---------:|
| 综合态势 | 7 | 校园全景鸟瞰 (白天/夜间模式) |
| 教学研究 | 6 | 教学楼近景 |
| 行政办公 | 6 | 行政区域 |
| 智慧图书 | 6 | 崇文楼图书馆 |
| 智慧教学 | 7 | 教学楼 + 3D 教室热力图 |
| 智慧安防 | 7 | 校园全景 + 设备/告警标注 |

## 项目结构

```
src/
├── api/            # TanStack Query hooks + MSW mock handlers + SSE 客户端
├── config/         # chartTheme (ECharts 深色/浅色), dayNightTheme (3D 日/夜)
├── components/
│   ├── charts/     # ECharts 封装 (11 种图表类型)
│   ├── layout/     # ScreenLayout, TopBar, Panels, BottomBar, ErrorBoundary
│   ├── scene/      # R3F 3D 场景 (CampusBase, Camera, Particles, Landscape, GroundDecorations)
│   └── ui/         # NumberFlip, ScrollList, Modal, CardCarousel, AlertPopup, StatusPanel
├── hooks/          # useSceneClick
├── shaders/        # WebGL GLSL (buildingWindow 窗户发光, roadFlow 道路光流)
├── stores/         # Zustand (Theme, Scene, UI, UITheme, TimeMode)
├── themes/         # 6 个专题 (panels + scene + registry)
├── types/          # TypeScript 类型定义
└── utils/          # format, constants
e2e/                # Playwright E2E 测试 (8 用例)
```

## 功能亮点

- **3D 数字孪生**：9 栋建筑按真实镇远中学布局，WebGL Shader 窗户发光 + 道路光流动画，Bloom 后处理辉光
- **双向联动**：点击 3D 建筑 → 数据面板联动；面板"飞向"按钮 → 镜头飞向建筑
- **丰富图表**：11 种 ECharts 图表类型，含 Sankey/Sunburst/Funnel/Radar 等高级图表
- **主题切换**：UI 深色/浅色主题 (CSS 变量) + 3D 白天/夜间模式独立切换
- **实时推送**：SSE 基础设施 (指数退避重连) + BottomBar 连接状态指示灯
- **响应式**：1920px ~ 7680px 超宽屏自适应
- **完整测试**：35 Vitest 单元测试 + 8 Playwright E2E 测试

## 设计文档

- 需求规格：[docs/智慧校园可视化平台项目需求规格书.md](docs/智慧校园可视化平台项目需求规格书.md)
- 原技术设计：[docs/superpowers/specs/2026-06-16-smart-campus-visualization-design.md](docs/superpowers/specs/2026-06-16-smart-campus-visualization-design.md)
- 原实现计划：[docs/superpowers/plans/2026-06-16-platform-framework.md](docs/superpowers/plans/2026-06-16-platform-framework.md)
- Tron 风格技术设计：[docs/superpowers/specs/2026-06-16-tron-style-redesign.md](docs/superpowers/specs/2026-06-16-tron-style-redesign.md)
- Tron 风格实现计划：[docs/superpowers/plans/2026-06-16-tron-style-redesign.md](docs/superpowers/plans/2026-06-16-tron-style-redesign.md)
- Day/Night 模式设计：[docs/superpowers/specs/2025-06-17-day-night-mode-design.md](docs/superpowers/specs/2025-06-17-day-night-mode-design.md)
- 建筑模型优化设计：[docs/superpowers/specs/2025-06-17-building-refactor-design.md](docs/superpowers/specs/2025-06-17-building-refactor-design.md)
- 项目状态：[docs/PROJECT_STATUS.md](docs/PROJECT_STATUS.md)
