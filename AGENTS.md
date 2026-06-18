# AGENTS.md — 智慧校园可视化平台

## 项目概述

东莞滨海湾镇远中学数字孪生大屏展示系统。6 个专题 (综合态势/教学研究/行政办公/智慧图书/智慧教学/智慧安防)，38 个数据面板，142 项指标，Three.js (R3F) 三维场景。

## 当前状态

| 指标 | 数值 |
|------|------|
| 源文件 | 128 |
| 测试 | 35/35 单元测试 + 8/8 E2E 测试 |
| Git 提交 | 177 |
| 编译 | ✅ `pnpm build` 通过 |
| 启动 | ✅ `pnpm dev` → `http://localhost:3000` |

**已完成**：平台框架、6 专题全部 38 个数据面板（Mock 数据）、3D 校园场景（按真实镇远中学布局）、建筑点击联动 + 自动飞向、告警弹窗（`crypto.randomUUID` 兼容修复）、卡片轮播、镜头动画、响应式布局（含超宽屏 5760px+ 适配）、代码分割。

**已完成（叠加式布局）**：3D 场景全屏绝对定位 (Layer 0)，UI 覆盖层 (Layer 1) 半透明叠加 + backdrop-filter 毛玻璃；ScreenLayout 移除 scene prop，仅管理 topbar/left/right/bottombar Grid；LeftPanel/RightPanel 合并为 SidePanel。

**已完成（视觉一致性优化）**：新增 23 个 CSS 变量 (shadow/font/radius/transition/panel-padding)；全组件字号 rem 化 (`--font-size-xs~xl`)；Modal/VideoWindow/AlertPopup 颜色/阴影变量化；NumberFlip 重写为 CSS digit roll 动画；ScrollList 改为 rAF delta-time 平滑滚动；Modal/VideoWindow 增加入场/离场动效。

**已完成（Day/Night 模式统一）**：Classic 和 Tron 两套场景已合并为统一 `CampusBase`，通过 `useTimeModeStore` 切换白天/夜间模式，所有视觉参数集中在 `src/config/dayNightTheme.ts`。

**已完成（建筑模型重构）**：BuildingMesh 从单一 Box 重构为 4 层结构（主体+楼板带+外走廊+女儿墙）；校门改为崇智楼中央拱门式入口；钟楼独立矗立在拱门左前方（带金字塔顶 + 竖向校名 "镇远中学"）；教学三栋楼由连廊连接；周边城市背景错落有致。

**已完成（UI 主题与图表）**：深色/浅色 UI 主题切换（CSS 变量 + `useUIThemeStore`，TopBar 一键切换）；ECharts 亮色主题自动适配（`useChartTheme()` hook）；新增 4 种图表类型（Sankey/Sunburst/Funnel/Radar）并集成到业务面板。

**已完成（SSE 实时推送）**：SSE 客户端（`src/api/sse.ts`，指数退避重连）+ `useSSE()` hook 自动注入 QueryClient；Dev 模式 Mock SSE 客户端（`src/api/sse.mock.ts`，`setInterval` 推送 6 种事件类型）；BottomBar SSE 连接状态指示灯。

**已完成（测试）**：Playwright E2E 测试（8 用例，覆盖加载/主题切换/专题导航/建筑交互）；Vitest 单元/集成测试 35 用例。

**已完成（数据面板审查与优化）**：全面审查 6 专题 39 数据面板，修复 87 处硬编码颜色 → CSS 变量（浅色/深色主题兼容）、新增 ChartLabel 组件（复用 46 处）、统一 37 面板空数据状态为 StatusPanel empty、修复 4 处 Mock 数据不一致、优化 8 面板视觉填充率、4 共享图表组件颜色兼容；`pnpm build` + 35/35 测试通过。

**3D 场景特性**：
- **Day/Night 模式**：白天（红砖暖光 + 绿地 + 米白窗户）、夜间（暗黑赛博 + 青色窗户发光 + 道路光流）
- WebGL 自定义 Shader：建筑立面窗户发光（`buildingWindow.glsl`）、道路数据光流动画（`roadFlow.glsl`，仅夜间）
- 后处理特效：Bloom 辉光（@react-three/postprocessing v2.19.1，不可升级 v3；白天 0.3 / 夜间 0.6）
- 景观系统：绿篱、花坛、大小树（`Landscape`）、POI 标注点 + 建筑间数据连线（`GroundDecorations`）
- 环境：镜面反射水库（`MeshReflectorMaterial`，仅夜间）、HDRI 环境光（`Environment`）、接触阴影（`ContactShadows`）
- 已知问题：`autoRotate` 旋转在暗色表面产生微抖动（设 speed=0.08, damping=0.3 缓解）
- 已移除组件：Hillside、Grid（两模式均已移除）

**待完成（需外部资源）**：真实 CAD 三维模型、真实 API 对接（诺图/大华 ICC/OA/教务）、室内场景建模、监控视频流。

详细清单见 `docs/PROJECT_STATUS.md`，需求详见 `docs/智慧校园可视化平台项目需求规格书.md`。

## 技术栈

React 18 + TypeScript, Vite 5, pnpm, Three.js (@react-three/fiber + drei), ECharts 5, Zustand, TanStack Query v5, MSW + faker, TailwindCSS, Vitest, Playwright

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
│   ├── sse.ts                     # SSE 客户端 (指数退避重连，DEV 自动切换 Mock)
│   ├── sse.mock.ts                # Dev 模式 Mock SSE (setInterval 推送 6 种事件)
│   ├── useSSEQuery.ts             # useSSE() hook — SSE 事件 → queryClient.setQueryData
│   ├── queries/                   # TanStack Query hooks (一个主题一个文件)
│   └── mocks/
│       ├── server.ts              # MSW setup (import 所有 handlers)
│       └── handlers/              # MSW handlers (一个主题一个文件)
├── config/
│   ├── chartTheme.ts              # useChartTheme() — ECharts 深色/浅色主题 token
│   └── dayNightTheme.ts           # 3D 场景 Day/Night 视觉参数
├── components/
│   ├── charts/      # ECharts: Bar/Line/Pie/Ring/Gauge/Heatmap/Treemap/Sankey/Sunburst/Funnel/Radar
│   ├── layout/      # ScreenLayout(CSS Grid 覆盖层), TopBar, SidePanel, BottomBar, ErrorBoundary
│   ├── scene/       # R3F: SceneCanvas, CampusBase, CameraController, ParticleBg, SceneInfo
│   └── ui/          # DashboardPanel, NumberFlip, ScrollList, Modal, CardCarousel, AlertPopup, StatusPanel, VideoWindow, ChartLabel
├── hooks/           # useSceneClick (目前很少使用)
├── shaders/         # WebGL GLSL: buildingWindow (建筑窗户发光), roadFlow (道路光流动画)
├── stores/
│   ├── useThemeStore.ts      # currentTheme, switchTheme(), finishTransition()
│   ├── useSceneStore.ts      # selectedObjectId, selectObject(), requestFlyTo(), flyToRequest
│   ├── useUIStore.ts         # alertQueue, addAlert(), dismissAlert(), modalStack
│   ├── useUIThemeStore.ts    # uiTheme (dark/light), toggleUITheme()
│   ├── useTimeModeStore.ts   # timeMode (day/night), toggleMode()
│   └── themes/               # 6 个专题 store (当前是空骨架，未被使用)
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
e2e/                 # Playwright E2E 测试 (8 用例: 加载/主题切换/专题导航/建筑交互)
```

## 关键架构约定

### 1. 3D 场景渲染链 (最重要!)

```
App.tsx
  └── <div position:relative>                         ← 外层容器
      ├── Layer 0: <div position:absolute z-index:0>  ← 场景层 (全屏)
      │   └── ErrorBoundary
      │       └── SceneCanvas  ← Canvas + fog + ParticleBg + CameraController + EffectComposer(Bloom)
      │           └── children = entry.scene()  ← 主题专属 3D 内容
      └── Layer 1: <div position:relative z-index:1>  ← UI 覆盖层
          └── ScreenLayout (CSS Grid 4区, 无 scene)
              ├── TopBar
              ├── SidePanel (左) + . (空) + SidePanel (右)
              └── BottomBar
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

图表副标题使用 `ChartLabel` 组件代替内联 div（自动适配深色/浅色主题）：
```tsx
import ChartLabel from '@/components/ui/ChartLabel'
// 左对齐（默认）：
<ChartLabel>各学科教师数量</ChartLabel>
// 居中：
<ChartLabel align="center">今日出勤率</ChartLabel>
```

### 4. TanStack Query + MSW Mock 模式

- 数据查询定义在 `api/queries/<theme>.ts`（每个 hook 有明确的 refetchInterval 对应四级更新机制）
- Mock 处理程序在 `api/mocks/handlers/<theme>.ts`（固定数据不用 faker.random，用真实数字）
- MSW 开发模式自动拦截，生产构建自动排除
- 新增 API：先在 `api/queries/` 加 hook + 类型，再在 `api/mocks/handlers/` 加 handler，最后在 `api/mocks/server.ts` 注册 handler

### 5. 场景-数据双向联动

- **场景→数据**：CampusBase 中 BuildingMesh 的 onClick → `useSceneStore.selectObject(id)` + `requestFlyTo()` → 镜头飞向建筑 + 数据面板联动
- **数据→场景**：BuildingDetail 的"飞向"按钮 → `useSceneStore.requestFlyTo(pos, lookAt)` → CameraController 监听 `flyToRequest` 执行 lerp 动画

### 6. 自定义 Shader 系统

- **建筑窗户Shader**：`src/shaders/buildingWindow.vert/frag` — 通过 `WINDOW_MATS` 为不同建筑类型提供不同窗格密度
- **道路光流Shader**：`src/shaders/roadFlow.vert/frag` — 橙色主路/青色支路的光流动画，通过 `Roads` 组件中的 `ShaderMaterial` 驱动
- Shader 源文件通过 Vite `?raw` 导入，用 `THREE.ShaderMaterial` 搭载到 R3F `<mesh>` 上
- 建筑Shader 通过 `vNormal` 屏蔽屋顶/底面窗户（`if (abs(vNormal.y) > 0.5)`）以避免顶部发光

## Zustand Store 速查

| Store | 关键字段 | 谁在用 |
|-------|---------|--------|
| useThemeStore | currentTheme, switchTheme, finishTransition | TopBar, CameraController, CampusBase |
| useSceneStore | selectedObjectId, selectObject, requestFlyTo, flyToRequest | CampusBase, CameraController, BuildingDetail, AlertPopup |
| useUIStore | alertQueue, addAlert, dismissAlert | AlertPopup, AlertEvents(安防面板), SecurityScene |
| useUIThemeStore | uiTheme (dark/light), toggleUITheme | TopBar, App.tsx, 各图表组件(通过 useChartTheme) |
| useTimeModeStore | timeMode (day/night), toggleMode | TopBar, CampusBase, dayNightTheme |

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
- 专题 store 文件 (stores/themes/) 存在但未被使用，是骨架
- Mock 数据基于镇远中学真实资料：73亩/8.8万m²/60班/2800学生/初一至初三
- **依赖约束**：`@react-three/postprocessing` 不可升级到 v3（要求 `fiber@^9.0`，项目使用 v8），当前锁定 v2.19.1
- **兼容性**：`useUIStore.addAlert` 已用 `Date.now()+Math.random` 替代 `crypto.randomUUID`（旧浏览器不兼容）
- **Shader 修改后**：需重启 `pnpm dev`（Vite HMR 不会热更新 `.vert`/`.frag` 文件）
- **HDR 环境贴图本地托管**：`@react-three/drei` 的 `Environment` 组件通过 `preset` 属性会从 `raw.githack.com`（GitHub CDN）加载 HDR 文件，在国内网络可能无法访问导致 3D 场景崩溃。已将所需文件下载到 `public/hdri/`，改用 `files` + `path` 属性本地加载。如需新增 HDR 环境，文件放在 `public/hdri/` 并在 `dayNightTheme.ts` 中配置。
