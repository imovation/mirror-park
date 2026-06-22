# AGENTS.md — 智慧校园可视化平台

## 项目概述

东莞滨海湾镇远中学数字孪生大屏展示系统。7 个专题 (综合态势/教学研究/行政办公/智慧图书/智慧教学/智慧安防/智慧后勤)，38 个数据面板（拆分后），Three.js (R3F) 三维场景。

## 当前状态

| 指标 | 数值 |
|------|------|
| 源文件 | 203 |
| 测试 | 250/250 单元测试 + 76/76 E2E 测试 |
| Git 提交 | 283 |
| 编译 | ✅ `pnpm build` 通过 |
| 启动 | ✅ `pnpm dev` → `http://localhost:3000` |
| 浏览器 Console | 0 error / 0 warning |

**已完成**：平台框架、7 专题全部 38 个数据面板（Mock 数据）、3D 校园场景（按真实镇远中学布局）、建筑点击联动 + 自动飞向、告警弹窗（`crypto.randomUUID` 兼容修复）、卡片轮播、镜头动画、响应式布局（含超宽屏 5760px+ 适配）、代码分割、SSE 实时推送。

**已完成（2026-06-21 全面 UI/UX 优化 — 六轮 60+ 项）**：
1. 审计报告 + 30+ 项核心问题修复（RingChart 裁剪/BarChart 自适应/NumberFlip 防抖）
2. CSS 变量体系 + ~25 处 hex 清理 + TopMetrics 紧凑
3. 7 专题独立配色 + TopMetrics 科技未来风 + 个性化图标 (30 SVG)
4. TopMetrics space-between 分布 + 图表丰富 12 色调色板 (CHART_PALETTE)
5. 纯黑色修复（LineChart areaStyle CSS 变量 + RingChart colors）
6. UI 打磨：Tooltip 卡片式 + 面板序次动画 + BottomBar 运行时长 + 微交互 hover

## 变更日志 (2026-06-22) — 第 8 轮 UI/UX 优化（15 项）

| 类别 | 改动 | 文件 |
|------|------|------|
| P0 | **AlertPopup 居中底部** (position: fixed → 水平居中) | `AlertPopup.tsx` |
| P1-1 | **行政办公值班安排 6→4** (去掉副值班角色) | `DutySchedule.tsx`, `admin.ts` mock |
| P1-2 | **行政办公会议管理拆分** (拆出"近期会议"独立 panel) | `RecentMeetings.tsx`(新), `MeetingManagement.tsx` |
| P1-3 | **智慧图书右侧新增"新书速递"** (填补右列空白) | `NewArrivals.tsx`(新), `library.ts` mock |
| P1-4 | **智慧教学出勤排名/空间使用拆分** (2 panel) | `ClassAttendanceRank.tsx`(新), `ClassroomSpaceUsage.tsx`(新) |
| P1-5 | **3D POI 标签默认隐藏** (hover 显示) | `CampusBase.tsx`, `SecurityScene.tsx` |
| P1-6 | **1920 视口自动折叠次要 panel** (扩展 collapsible) | `DashboardPanel.tsx`, `useWindowSize.ts`(新) |
| P2-1 | **综合态势面板样式优化** (资产概况紧凑/教职工组成字号) | `AssetOverview.tsx`, `FacultyPanorama.tsx` |
| P2-2 | **教学研究资源统计紧凑** (2×2 紧凑) | `ResourceStatistics.tsx` |
| P2-3 | **行政教职工考勤优化** (按值着色+markLine 基准线) | `StaffAttendance.tsx`, `LineChart.tsx` |
| P2-4 | **智慧图书借阅排行改 2×1 grid** + 3 色循环 | `BookRank.tsx` |
| P2-5 | **智慧教学实时冲突改 badge** + 楼宇 ID 替换 | `ClassroomSpaceUsage.tsx`(新) |
| P2-6 | **智慧安警告警事件优化** (双 pie→1 ring + 类型 chips) | `AlertEvents.tsx` |
| P2-7 | **智慧后勤食堂安全精简** (9→6 items + h-bar) | `LogisticsCanteen.tsx`, `logistics.ts` mock |
| 修复 | **LogisticsScene 误引用 SecurityScene** 导致设备图标泄漏 | `LogisticsScene.tsx` |
| 修复 | **3D Canvas 切换专题残留** (key=currentTheme 强制重建) | `App.tsx` |
| 测试 | **150 测试更新** (适配 panel 拆分/名称变更/样式变更) | 15 测试源文件 |
| — | 本次共 | 5 新建 + 30 修改 + 1 删除 = 5 源文件净增 |

### 关键设计决策
- **面板默认展开**: 移除 autoCollapseBelow 机制，collapsible panel 始终展开，用户手动折叠
- **3D 场景切换**: 切换专题时仅替换 Canvas 内部场景组件（`entry.scene()`），Canvas 保持挂载，R3F 自动清理旧元素
- **设备 Sprite 图标**: Canvas 绘制摄像头/门禁图标替代小球，始终面向镜头

## 变更日志 (2026-06-22 后续) — 第 9 轮全专题精细化调整

| 类别 | 改动 | 文件 |
|------|------|------|
| 系统 | **AlertPopup 移右下角** + 宽度 520→320 | `AlertPopup.tsx` |
| 系统 | **TopBar 新增全屏按钮** (Fullscreen API) | `TopBar.tsx` |
| 系统 | **TopMetrics 亮色背景修复** (硬编码→CSS 变量) | `ScreenLayout.tsx`, `index.css` |
| 系统 | **ScrollBar gutter 移除** (右侧多余间隙) | `index.css` |
| 系统 | **3D 场景切换不重载** (移除 key=currentTheme) | `App.tsx` |
| 系统 | **Panel 高度支持小数** (parseFlexGrow) | `types/panel.ts`, `App.tsx` |
| 系统 | **BarChart hideAxis prop** + **LineChart yAxisMin/Max** | `BarChart.tsx`, `LineChart.tsx` |
| 系统 | **NumberFlip fontSize prop** (移除逗号分隔符) | `NumberFlip.tsx` |
| 系统 | **StatCard compact + style prop** | `StatCard.tsx` |
| 系统 | **侧栏面板加 12px 对称边距** | `ScreenLayout.tsx` |
| 综合态势 | 右一面板 flex-2→1.8；功能室分布 色相轮转→CHART_PALETTE；资产概况 flex-1→2 + Ring 160 | `overview/` 多文件 |
| 教学研究 | 面板高度重调(1.25/0.7/1.25/2/1.2)；压缩卡片/字号；删除 8→4 部门 | `teaching-research/` 多文件 |
| 行政办公 | 通知 maxHeight 400→260；考勤 flex-3→2.5 + 8→4 部门；值班卡片 compact + 背景色；会议管理压缩 | `admin/` 多文件 |
| 智慧图书 | 阅读之星删除；借阅 flex-1→4；新书 flex-1→2；入馆 flex-2→1.2；BookRank 居中+ hideAxis | `library/` 多文件 |
| 智慧教学 | 布局重组(空间使用移左3/考试 flex-2→3)；全部横条 CHART_PALETTE 区分色；高度全部降至最低 | `academics/` 多文件 |
| 智慧安防 | flex 重组(监控 1.6→1.33/门禁 1.33→1.6)；RingChart CSS var→hex；NumberFlip 统一 lg | `security/` 多文件 |
| 智慧后勤 | 请假记录 maxHeight 144；宿舍 Bar 180→140；访客登记 flex 填充 | `logistics/` 多文件 |

## 变更日志 (2026-06-21)

### P0 — 布局严重问题修复
| # | 变更 | 文件 |
|---|------|------|
| 1 | **collapsible 限制解除** — `showCollapse` 去除 `flexGrow >= 2` 要求 | `DashboardPanel.tsx` |
| 2 | **切专题清空告警** — `clearAlerts()` + 监听 `currentTheme` | `useUIStore.ts`, `App.tsx` |
| 3 | **智慧教学右侧 4→3 panel** — "出勤排名与趋势"+"空间使用率"合并为"出勤排名与空间使用" | `academics/index.tsx`, `AttendanceAndSpace.tsx` |
| 4 | **智慧安防右侧补齐** — 新增"安防态势总览" | `security/index.tsx`, `SecurityOverview.tsx` |
| 5 | **智慧后勤左侧补齐** — 新增"宿舍管理" + mock | `logistics/index.tsx`, `DormManagement.tsx` |
| 6 | **RingChart 中心文字裁剪** — "351/372"→"051/372" 修复 (半径 50%→38%, 长文本自动缩) | `RingChart.tsx` |
| 7 | **LineChart areaStyle 纯黑色** — CSS 变量拼接 `'var(xx)30'` ECharts 无法解析 | `LineChart.tsx` |
| 8 | **RingChart/LineChart CSS 变量→hex** — 7 面板纯黑色修复 | `BorrowStats/TeachingDevices/MonitorStatus/AlertEvents/SecurityOverview/StaffAttendance` |

### P1 — 各专题内容优化
| # | 变更 |
|---|------|
| 1 | **智慧图书** — 左栏 2→3 panel："图书借阅排行"+"阅读之星"拆分 |
| 2 | **行政办公** — 考勤默认展开、通知公告 flex-1/值班安排 flex-2 权重调整 |
| 3 | **综合态势** — 功能室分布 flex-1→flex-2 |
| 4 | **教学研究** — ResourceUpdates 新增 4 个统计卡片 |
| 5 | **教职工考勤 Mock 扩展** — 4→8 部门 / **门禁 Mock 一致性** — total 用 reduce 合计 |
| 6 | **考试管理** — FunnelChart→BarChart / **名师工作室** — 去除成员行降密度 |

### P2 — 样式系统化
| # | 变更 |
|---|------|
| 1 | **7 专题独立主色** — 青/紫/靛/金/青绿/橙/绿 (themeColors.ts) |
| 2 | **TopMetrics 科技未来风** — 左竖条 + 顶部渐变 + 数字发光 + 个性化图标 (MetricIcon 30 SVG) |
| 3 | **图表调色板 12 色** — CHART_PALETTE.dark/light + semantic 语义色 (male/female/success/danger...) |
| 4 | **Panel 主题色联动** — 4 角装饰/标题色条/渐变背景全部跟随当前专题 |
| 5 | **TopBar 激活态** — 底部主题色下划线 + 发光 |
| 6 | **硬编码 hex→CSS 变量** — ~30 处替换 |
| 7 | **Panel 不透明度提升** — 暗 0.35→0.45，亮 0.7→0.82 |
| 8 | **3D Fog** — FOG_NEAR 50→30 |
| 9 | **浅色模式对比度** — text-muted 0.42→0.50, --overlay-bg 0.3→0.4 |

### R1-R10 — 精细化迭代
| # | 变更 |
|---|------|
| 1 | LogisticsLeave LineChart 80→120px |
| 2 | TeachingDevices PieChart 图例 `bottom`→`none` |
| 3 | AssetOverview 各卡片加占比(%) + RingChart 150→180px |
| 4 | AccessControl/MonitorStatus BarChart 140→180px |
| 5 | StudentAttendance BarChart 按值着色(≥97绿/≥90蓝/≥85橙/<85红) |
| 6 | AlertPopup 按时间降序排列 + bottom 20→48px 避免重叠 BottomBar |
| 7 | GaugeChart detail color `#fff`→`t.label` |
| 8 | RingChart `centerLabelColor` 默认 `#4a9eff`→`ringColors[0]` |
| 9 | 删除死文件 `BookBorrowRank.tsx`；清理未使用 import |

### UI 微交互 (新增)
| # | 变更 |
|---|------|
| 1 | **面板序次动画** — fadeInUp + `--stagger-delay` 80ms 间隔 |
| 2 | **Tooltip 卡片式** — 深色底 + 颜色圆点 + monospace 数值 (4 组件) |
| 3 | **BottomBar 增强** — 运行时长计数 + 渐变背景 |
| 4 | **TopMetricsCard hover** — scale(1.02) + glow 放大 |
| 5 | **主题过渡** — background/border-color 0.3s ease |

### 测试覆盖扩展
| # | 变更 |
|---|------|
| 1 | 新增 14 个集成测试用例（SecurityOverview/DormManagement/AttendanceAndSpace/BookRank/ReadingStars） |
| 2 | 更新 library-panels 测试（BookBorrowRank→BookRank+ReadingStars） |
| 3 | 新增 Logistics E2E 测试（3 用例 × 2 viewport = 6 测试） |
| 4 | chart-theme.test 扩展 3 用例（主题切换 / 派生调色板 / 12 色调板） |
| 5 | 修复 top-metrics.test 适应布局变更 |
| 6 | 更新 80 张截图基线 (7 专题 × 2 模式 × 2 viewport × ~2) |

## 新增文件

| 文件 | 用途 |
|------|------|
| `panels/AttendanceAndSpace.tsx` | ~~智慧教学 — 合并出勤排名与空间使用~~（已删除，被拆分替代） |
| `panels/SecurityOverview.tsx` | 智慧安防 — 安防态势总览 |
| `panels/DormManagement.tsx` | 智慧后勤 — 宿舍管理 |
| `panels/BookRank.tsx` | 智慧图书 — 图书借阅排行 |
| `panels/ReadingStars.tsx` | 智慧图书 — 阅读之星 |
| `panels/RecentMeetings.tsx` | 行政办公 — 近期会议 |
| `panels/NewArrivals.tsx` | 智慧图书 — 新书速递 |
| `panels/ClassAttendanceRank.tsx` | 智慧教学 — 班级出勤排名 |
| `panels/ClassroomSpaceUsage.tsx` | 智慧教学 — 教室空间使用 |
| `hooks/useWindowSize.ts` | useWindowSize + useIsCompactViewport hook |
| `config/themeColors.ts` | 7 专题调色板定义 |
| `config/metricColors.ts` | TopMetrics 10 色数值色板 |
| `components/ui/MetricIcon.tsx` | 30 个 SVG 线条图标库 |
| `docs/API.md` | 44 REST 端点完整文档 |
| `docs/UI_UX_AUDIT.md` | UI/UX 审计报告 |
| `docs/superpowers/plans/2026-06-21-ui-ux-fixes.md` | 实施计划 |
| `__tests__/integration/logistics-panels.test.tsx` | 后勤面板集成测试 |
| `e2e/tests/topic-logistics.spec.ts` | 后勤 E2E 测试 |

## Panel 布局现状

| 专题 | 左 panel | 右 panel | 总计 |
|------|---------|---------|------|
| 综合态势 | 3 (flex-1+flex-2×2) | 3 (flex-2×2+flex-1) | **6** |
| 教学研究 | 3 (flex-1×3) | 3 (flex-1×2+flex-2) | **6** |
| 行政办公 | 3 (flex-1+flex-2×2) | 3 (flex-2+flex-1+flex-3) | **6** |
| 智慧图书 | 3 (flex-1+flex-2×2) | 3 (flex-1×2+flex-2) | **6** |
| 智慧教学 | 2 (flex-2×2) | 4 (flex-2×3+flex-1) | **6** |
| 智慧安防 | 2 (flex-2+flex-1) | 2 (flex-2+flex-1) | **4** |
| 智慧后勤 | 2 (flex-2+flex-1) | 2 (flex-1×2) | **4** |
| **总计** | **18** | **20** | **38** |

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
│   └── ui/          # DashboardPanel, NumberFlip, ScrollList, Modal, CardCarousel, AlertPopup, StatusPanel, VideoWindow, ChartLabel, StatCard, TopMetricsCard
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
│   ├── overview/                # 综合态势 (3 左 + 3 右 = 6 panel)
│   ├── teaching-research/       # 教学研究 (3 左 + 3 右 = 6 panel)
│   ├── admin/                   # 行政办公 (3 左 + 3 右 = 6 panel)
│   ├── library/                 # 智慧图书 (3 左 + 3 右 = 6 panel, 新增新书速递)
│   ├── academics/               # 智慧教学 (2 左 + 4 右 = 6 panel, 出勤排名+空间使用已拆分)
│   ├── security/                # 智慧安防 (2 左 + 2 右 = 4 panel, 新增安防态势总览)
│   └── logistics/               # 智慧后勤 (2 左 + 2 右 = 4 panel, 新增宿舍管理)
├── types/           # theme.ts (ThemeId enum, THEMES 常量), panel.ts, api.ts
└── utils/           # format.ts (formatNumber 等), constants.ts (SCENE 镜头预设等)
e2e/                 # Playwright E2E 测试 (80 用例: 加载/主题切换/专题导航/建筑交互/告警弹窗/响应式/错误状态/折叠/7 专题截图基线)
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
