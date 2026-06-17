# 智慧校园可视化平台

东莞滨海湾镇远中学数字孪生大屏展示系统。采用 Three.js (R3F) + React + ECharts 构建，将校园物理空间与业务数据融合，在大屏端集中呈现校园运行状态。支持 **白天** 和 **夜间** 两种视觉模式，右上角一键切换。

建筑模型采用学校风格重构：红砖主体 + 白色楼板带/外走廊/女儿墙，教学三栋楼由连廊连接，崇智楼中央拱门式校门，独立钟楼展示校名。

## 技术栈

| 类别 | 选型 |
|------|------|
| 框架 | React 18 + TypeScript |
| 构建 | Vite 5 + pnpm |
| 3D 引擎 | Three.js via @react-three/fiber (R3F) + @react-three/drei |
| 后处理 | @react-three/postprocessing (Bloom 辉光) |
| 数据可视化 | ECharts 5 |
| 状态管理 | Zustand |
| 数据请求 | TanStack Query v5 |
| Mock | MSW + @faker-js/faker |
| 样式 | TailwindCSS |
| 测试 | Vitest + @testing-library/react |

## 启动

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm build      # 生产构建到 dist/
pnpm test       # 运行测试
```

## 专题模块

| 专题 | 面板数 | 3D 场景 |
|------|--------|---------|
| 综合态势 | 6 | 校园全景鸟瞰 (白天/夜间模式) |
| 教学研究 | 6 | 教学楼近景 |
| 行政办公 | 6 | 行政区域 |
| 智慧图书 | 6 | 崇文楼图书馆 |
| 智慧教学 | 7 | 教学楼 + 3D 教室热力图 |
| 智慧安防 | 7 | 校园全景 + 设备/告警标注 |

## 项目结构

```
src/
├── api/            # TanStack Query hooks + MSW mock handlers
├── components/
│   ├── charts/     # ECharts 封装 (Bar/Line/Pie/Ring/Gauge/Heatmap/Treemap)
│   ├── layout/     # ScreenLayout, TopBar, Panels, ErrorBoundary
│   ├── scene/      # R3F 3D 场景 (CampusBase, Camera, Particles, Landscape, GroundDecorations)
│   └── ui/         # NumberFlip, ScrollList, Modal, CardCarousel, AlertPopup
├── hooks/          # useSceneClick, useAutoScroll
├── shaders/        # WebGL GLSL (buildingWindow窗户发光, roadFlow道路光流)
├── stores/         # Zustand (useThemeStore, useSceneStore, useUIStore + theme stubs)
├── themes/         # 6 个专题 (panels + scene + registry)
├── types/          # TypeScript 类型定义
└── utils/          # format, constants
```

## 设计文档

- 需求规格：[docs/智慧校园可视化平台项目需求规格书.md](docs/智慧校园可视化平台项目需求规格书.md)
- 原技术设计：[docs/superpowers/specs/2026-06-16-smart-campus-visualization-design.md](docs/superpowers/specs/2026-06-16-smart-campus-visualization-design.md)
- 原实现计划：[docs/superpowers/plans/2026-06-16-platform-framework.md](docs/superpowers/plans/2026-06-16-platform-framework.md)
- Tron 风格技术设计：[docs/superpowers/specs/2026-06-16-tron-style-redesign.md](docs/superpowers/specs/2026-06-16-tron-style-redesign.md)
- Tron 风格实现计划：[docs/superpowers/plans/2026-06-16-tron-style-redesign.md](docs/superpowers/plans/2026-06-16-tron-style-redesign.md)
- Day/Night 模式设计：[docs/superpowers/specs/2025-06-17-day-night-mode-design.md](docs/superpowers/specs/2025-06-17-day-night-mode-design.md)
- 建筑模型优化设计：[docs/superpowers/specs/2025-06-17-building-refactor-design.md](docs/superpowers/specs/2025-06-17-building-refactor-design.md)
- 项目状态：[docs/PROJECT_STATUS.md](docs/PROJECT_STATUS.md)
