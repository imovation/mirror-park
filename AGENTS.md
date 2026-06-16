# AGENTS.md — 智慧校园可视化平台

## 项目概述

东莞滨海湾镇远中学数字孪生大屏展示系统。6 个专题 (综合态势/教学研究/行政办公/智慧图书/智慧教学/智慧安防)，38 个数据面板，142 项指标，Three.js (R3F) 三维场景。

## 当前状态

| 指标 | 数值 |
|------|------|
| 源文件 | 111 |
| 测试 | 31/31 通过 |
| 构建 | ✅ `pnpm build` 通过 |
| 启动 | ✅ `pnpm dev` → `http://localhost:3000` |

**已完成**：平台框架、6 专题全部 38 个数据面板（Mock 数据）、3D 校园场景 (按真实镇远中学布局)、建筑点击联动、告警弹窗、设备/告警 3D 标注、卡片轮播、镜头动画、响应式布局、代码分割。

**待完成（需外部资源）**：真实 CAD 三维模型、真实 API 对接（诺图/大华 ICC/OA/教务）、室内场景建模、监控视频流。

**待完成（纯前端可推进）**：桑基图/旭日图/雷达图等更多图表类型、Playwright E2E 测试、WebSocket 实时推送基础设施。

详细清单见 `docs/PROJECT_STATUS.md`，需求详见 `docs/智慧校园可视化平台项目需求规格书.md`。

## 技术栈

React 18 + TypeScript, Vite 5, pnpm, Three.js (@react-three/fiber + drei), ECharts 5, Zustand, TanStack Query v5, MSW + faker, TailwindCSS, Vitest

## 常用命令

```bash
pnpm dev          # 开发服务器 (含 HMR)
pnpm build        # 生产构建 → dist/
pnpm test         # 运行所有测试
pnpm test -- -t "test name"  # 运行特定测试
```

## 项目结构

```
src/
├── api/
│   ├── client.ts                  # fetchApi<T>() — BASE_URL = '/api'
│   ├── queries/                   # TanStack Query hooks (一个主题一个文件)
│   └── mocks/
│       ├── server.ts              # MSW setup (import 所有 handlers)
│       └── handlers/              # MSW handlers (一个主题一个文件)
├── components/
│   ├── charts/      # ECharts: Bar/Line/Pie/Ring/Gauge/Heatmap/Treemap
│   ├── layout/      # ScreenLayout(CSS Grid 5区), TopBar, LeftPanel, RightPanel, BottomBar, ErrorBoundary
│   ├── scene/       # R3F: SceneCanvas, CampusBase, CameraController, ParticleBg, SceneInfo
│   └── ui/          # DashboardPanel, NumberFlip, ScrollList, Modal, CardCarousel, AlertPopup, StatusPanel, VideoWindow
├── stores/
│   ├── useThemeStore.ts   # currentTheme, switchTheme(), finishTransition()
│   ├── useSceneStore.ts   # selectedObjectId, selectObject(), requestFlyTo(), flyToRequest
│   └── useUIStore.ts      # alertQueue, addAlert(), dismissAlert(), modalStack
├── themes/
│   ├── registry.tsx             # getThemeEntry(themeId) → { scene, panels, renderPanel }
│   ├── overview/                # 综合态势 (5 左面板 + 2 右面板)
│   ├── teaching-research/       # 教学研究 (3 左 + 3 右)
│   ├── admin/                   # 行政办公 (3 左 + 3 右)
│   ├── library/                 # 智慧图书 (3 左 + 3 右)
│   ├── academics/               # 智慧教学 (3 左 + 4 右 + 3D 热力图)
│   └── security/                # 智慧安防 (3 左 + 4 右 + 3D 设备/告警标注)
├── types/           # theme.ts (ThemeId enum, THEMES 常量), panel.ts, api.ts
└── utils/           # format.ts (formatNumber 等), constants.ts (SCENE 镜头预设等)
```

## 关键架构约定

### 1. 3D 场景渲染链 (最重要!)

```
App.tsx
  └── ScreenLayout (CSS Grid)
        └── scene slot:
              └── ErrorBoundary
                    └── SceneCanvas  ← 提供 Canvas + fog + ParticleBg + CameraController
                          └── children = entry.scene()  ← 主题专属 3D 内容
```

**严禁**将 R3F 元素 (Box/Sphere/Plane/Html 等) 放在 `<Canvas>` 之外。SceneCanvas 是唯一的 Canvas 包装器，主题 scene 函数返回 Canvas 内部的内容。

**历史 BUG**：曾经因为重构把 `entry.scene()` 直接放在 ErrorBoundary 里（丢失 SceneCanvas 包裹），导致所有 R3F 元素在 Canvas 外渲染，3D 场景挂掉。如果你看到"3D 场景不可用"，首先检查渲染链是否完整。

### 2. 主题注册模式

每个主题目录包含：
```
themes/xxx/
├── XxxScene.tsx      # 3D 场景内容 (返回 Canvas 内部的 R3F 元素)
├── panels/
│   ├── PanelA.tsx    # 数据面板 (使用 useQuery，loading/error 用 StatusPanel 组件)
│   └── ...
└── index.tsx         # 导出 scene 函数 + panels 配置 + renderPanel 函数
```

`registry.tsx` 用 `React.lazy` 做 6 个 scene 的代码分割。SceneCanvas 的 `<Suspense>` 自动处理加载状态。

**添加新面板的步骤**：
1. 在 `panels/` 下创建面板组件
2. 在主题的 `index.tsx` 中：import 面板 → 添加 panelId 到 panels.left/right → 在 renderPanel switch 中添加 case

### 3. 数据面板组件模式

所有数据面板遵循统一模式：
```typescript
import StatusPanel from '@/components/ui/StatusPanel'
import { useSomeQuery } from '@/api/queries/xxx'

export default function SomePanel() {
  const { data, isLoading, error } = useSomeQuery()
  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return <StatusPanel type="empty" />
  return <div>{/* 渲染数据 */}</div>
}
```

### 4. TanStack Query + MSW Mock 模式

- 数据查询定义在 `api/queries/<theme>.ts`（每个 hook 有明确的 refetchInterval 对应四级更新机制）
- Mock 处理程序在 `api/mocks/handlers/<theme>.ts`（固定数据不用 faker.random，用真实数字）
- MSW 开发模式自动拦截，生产构建自动排除
- 新增 API：先在 `api/queries/` 加 hook + 类型，再在 `api/mocks/handlers/` 加 handler，最后在 `api/mocks/server.ts` 注册 handler

### 5. 场景-数据双向联动

- **场景→数据**：CampusBase 中 BuildingMesh 的 onClick → `useSceneStore.selectObject(id)` → BuildingDetail 面板通过 `useSceneStore.selectedObjectId` 响应
- **数据→场景**：BuildingDetail 的"飞向"按钮 → `useSceneStore.requestFlyTo(pos, lookAt)` → CameraController 监听 `flyToRequest` 执行 lerp 动画

## Zustand Store 速查

| Store | 关键字段 | 谁在用 |
|-------|---------|--------|
| useThemeStore | currentTheme, switchTheme, finishTransition | TopBar, CameraController, CampusBase |
| useSceneStore | selectedObjectId, selectObject, requestFlyTo, flyToRequest | CampusBase, CameraController, BuildingDetail, AlertPopup |
| useUIStore | alertQueue, addAlert, dismissAlert | AlertPopup, AlertEvents(安防面板), SecurityScene |

## 常见问题

### React Hooks 规则
`AlertMarkers` 组件曾因 `useMemo` 在条件 return 之后调用导致崩溃。**所有 hooks 必须在任何条件 return 之前调用**。

### R3F useFrame 空指针
`BlinkingSphere` 的 `useFrame` 在首帧时 `ref.current.material` 可能为 undefined。**始终用 `if (!ref.current?.material) return` 保护**。

### JSX 属性与 useFrame 冲突
`BlinkingSphere` 的 JSX `opacity={0.8}` 与 `useFrame` 中直接修改 `material.opacity` 冲突。**不要在 JSX 上设动画属性，全部用 useFrame 控制**。

### 样式约定
所有组件优先用内联 `style` 对象，避免 CSS 文件冲突。全局样式（动画 keyframes、滚动条）放在 `index.css`。

## 注意事项

- 使用 `@/` 路径别名 (指向 `src/`)
- 构建有 chunk size 警告是正常的 (ECharts + Three.js 体积大)，已通过 React.lazy 做了 6 个专题场景的代码分割
- Mock 数据基于镇远中学真实资料：73亩/8.8万m²/60班/2800学生/初一至初三
