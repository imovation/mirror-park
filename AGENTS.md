# AGENTS.md — 智慧校园可视化平台

## 项目概述

东莞滨海湾镇远中学数字孪生大屏展示系统。6 个专题 (综合态势/教学研究/行政办公/智慧图书/智慧教学/智慧安防)，38 个数据面板，142 项指标，Three.js (R3F) 三维场景。

## 技术栈

React 18 + TypeScript, Vite 5, pnpm, Three.js (@react-three/fiber + drei), ECharts 5, Zustand, TanStack Query v5, MSW + faker, TailwindCSS, Vitest

## 项目结构

```
src/
├── api/             # queries/*.ts (TanStack hooks) + mocks/handlers/*.ts (MSW)
├── components/
│   ├── charts/      # ECharts wrappers
│   ├── layout/      # ScreenLayout, TopBar, panels, ErrorBoundary
│   ├── scene/       # R3F: CampusBase, CameraController, ParticleBg, SceneCanvas
│   └── ui/          # NumberFlip, ScrollList, Modal, CardCarousel, AlertPopup, StatusPanel
├── stores/          # Zustand: useThemeStore, useSceneStore, useUIStore + themes/
├── themes/          # 6 theme dirs (overview/teaching-research/admin/library/academics/security)
│   └── registry.ts  # Theme registry mapping ThemeId → scene + panels + renderPanel
├── types/           # theme.ts, panel.ts, api.ts
└── utils/           # format.ts, constants.ts
```

## 关键架构约定

### 3D 场景渲染链

```
App.tsx
  └── ScreenLayout (CSS Grid)
        └── scene slot:
              └── ErrorBoundary
                    └── SceneCanvas  ← 提供 Canvas + fog + ParticleBg + CameraController
                          └── children = entry.scene()  ← 主题专属 3D 内容
```

**严禁**将 R3F 元素 (Box/Sphere/Plane/Html 等) 放在 `<Canvas>` 之外。SceneCanvas 是唯一的 Canvas 包装器，主题 scene 函数返回 Canvas 内部的内容。

### 主题注册模式

每个主题目录包含：
```
themes/xxx/
├── XxxScene.tsx      # 3D 场景内容 (放在 Canvas 内部)
├── panels/
│   ├── PanelA.tsx    # 数据面板组件 (使用 TanStack Query)
│   └── ...
└── index.ts          # 导出 scene + panels 配置 + renderPanel 函数
```

`registry.ts` 统一注册，`App.tsx` 通过 `getThemeEntry(themeId)` 获取当前主题的 scene/panels/renderPanel。

### TanStack Query + MSW Mock 模式

- 每个主题的数据查询定义在 `api/queries/<theme>.ts`
- Mock 处理程序在 `api/mocks/handlers/<theme>.ts`
- MSW 开发模式自动拦截，生产构建自动排除
- 真实 API 对接时：只需修改 `api/client.ts` 的 BASE_URL + 关闭 MSW

### 使用真实数据

当前所有数据均为 Mock。要对接真实 API：
1. 修改 `src/api/client.ts` 的 `BASE_URL` 指向真实服务
2. 在 `src/main.tsx` 中移除 MSW 的 `async function bootstrap()` 调用
3. 确保 API 返回的 JSON 结构与 `api/queries/*.ts` 中定义的接口匹配

## 常用命令

```bash
pnpm dev          # 开发服务器 (含 HMR)
pnpm build        # 生产构建 → dist/
pnpm test         # 运行所有测试
pnpm test -- -t "test name"  # 运行特定测试
```

## 注意事项

- 使用 `@/` 路径别名 (指向 `src/`)
- 所有样式优先用内联 style 对象，避免 CSS 冲突
- R3F 组件内使用 `useFrame/useThree` 等 hooks 必须在 Canvas 内部
- 专题 store 文件存在但未被使用 (骨架，供后续扩展)
- 构建有 chunk size 警告 (ECharts + Three.js 体积大)，已通过 React.lazy 做了 6 个专题场景的代码分割
