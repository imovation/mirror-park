# 智慧校园可视化平台 — 技术设计文档

## 概述

本文档为智慧校园可视化平台的技术设计方案，基于需求规格书（`docs/智慧校园可视化平台项目需求规格书.md`）展开，定义前端架构、组件体系、状态管理、数据流、错误处理与测试策略。

**交付策略**：分层交付——先搭建平台框架（三维底座 + 导航 + 布局），再逐个专题填充数据面板和三维场景。

---

## 1. 技术选型

| 类别 | 选型 | 说明 |
|------|------|------|
| 框架 | React 18 + TypeScript | 生态丰富，社区成熟 |
| 构建 | Vite 5 | 开发体验快，HMR 即时 |
| 3D 引擎 | Three.js via @react-three/fiber (R3F) + @react-three/drei | React 声明式 3D 场景封装 |
| 数据可视化 | ECharts 5 (echarts-for-react) | 覆盖规格书所有图表类型（桑基图、矩阵树图、热力图等） |
| 状态管理 | Zustand | 轻量、TS 友好、按模块拆分 store |
| 数据查询 | TanStack Query (React Query) v5 | 缓存策略与四级更新机制天然匹配 |
| Mock | MSW (Mock Service Worker) + @faker-js/faker | 拦截网络请求，开发/生产一键切换 |
| CSS | TailwindCSS | 高效样式编写，适配深色主题 |
| 包管理 | pnpm | 磁盘空间优，安装快 |

---

## 2. 系统架构

采用五层架构（对应规格书第 1.4 节）：

```
┌─────────────────────────────────────────────┐
│  #1 展示层 (Presentation)                     │
│  大屏浏览器终端，3840×1080 典型分辨率          │
├─────────────────────────────────────────────┤
│  #2 应用层 (Application)                      │
│  综合态势 | 教学研究 | 行政办公 | 智慧图书      │
│  智慧教学 | 智慧安防                           │
├─────────────────────────────────────────────┤
│  #3 引擎层 (Engine)                           │
│  ┌───── R3F 3D 引擎 ─────┐  ↔  ┌── ECharts 数据可视化引擎 ──┐ │
│  │ Canvas · Camera · Anno │     │ Charts · FlipNum · List · Modal │
│  └────────────────────────┘     └────────────────────────────────┘ │
├─────────────────────────────────────────────┤
│  #4 数据对接层 (Data Integration)             │
│  TanStack Query Client Cache                 │
│  API Client (REST/WebService)                │
│  Mock Engine (MSW + faker)                   │
├─────────────────────────────────────────────┤
│  #5 数据源层 (Data Sources)                   │
│  人事 · OA · 诺图 · 大华ICC · 教务 · 考勤 · ...│
└─────────────────────────────────────────────┘
```

引擎层两大子系统通过场景-数据联动机制实现双向交互：
- **场景驱动数据**：3D 对象点击 → 更新 Zustand store → 数据面板自动响应
- **数据驱动场景**：面板数据项点击 → 更新镜头状态 → R3F 执行镜头动画

---

## 3. 大屏布局设计

### 3.1 CSS Grid 五区域布局

```
┌──────────────────────────────────────────────┐
│                  top-bar                       │
├────────┬──────────────────────┬───────────────┤
│ left   │                      │    right      │
│ panel  │    3D Scene Canvas   │    panel      │
│ (20%)  │        (60%)         │    (20%)      │
│        │                      │               │
├────────┴──────────────────────┴───────────────┤
│                bottom-bar                      │
└──────────────────────────────────────────────┘
```

- 所有 6 个专题复用同一 Grid 模板
- 左右面板使用 `flex-column` 内部堆叠 DashboardPanel，支持独立滚动
- 面板采用半透明深色底板，与 3D 场景视觉融合
- 面板数量因专题而异（非固定 3+3）

### 3.2 React 组件树

```
<App>
  <QueryClientProvider>
    <ScreenLayout>
      <TopBar>
        <PlatformTitle />
        <Clock />
        <ThemeNav tabs={6} active={current} />
      </TopBar>
      <MainContent>
        <LeftPanel>
          {themePanels.left.map(p => <DashboardPanel config={p} />)}
        </LeftPanel>
        <SceneCanvas>
          <R3F Canvas>
            <ThemeScene current={current} />
            <SceneAnnotations />
            <CameraController />
          </R3F Canvas>
        </SceneCanvas>
        <RightPanel>
          {themePanels.right.map(p => <DashboardPanel config={p} />)}
        </RightPanel>
      </MainContent>
      <BottomBar>
        <ScrollingTicker />
      </BottomBar>
    </ScreenLayout>
    <ModalOverlay>
      <AlertModal />
      <DetailModal />
      <VideoModal />
    </ModalOverlay>
  </QueryClientProvider>
</App>
```

- `ScreenLayout` 定义 Grid 区域，不随专题切换变化
- `ThemeScene` 根据当前专题渲染对应 3D 场景分支
- `DashboardPanel` 是通用容器：`{ title, variant, children }`，各专题按配置填充具体图表

---

## 4. 状态管理 (Zustand)

### 4.1 Store 拆分

```
stores/
├── useThemeStore.ts       # currentTheme, transitionState, switchTheme()
├── useSceneStore.ts       # cameraPosition, selectedObject, sceneReady
├── useUIStore.ts          # modalStack, alertQueue, togglePanel()
└── themes/
    ├── useOverviewStore.ts
    ├── useTeachingResearchStore.ts
    ├── useAdminStore.ts
    ├── useLibraryStore.ts
    ├── useAcademicsStore.ts
    └── useSecurityStore.ts
```

- **全局 stores（3个）**：跨专题共享，随应用启动创建
- **专题 stores（6个）**：惰性初始化，专题切换时目标 store 激活，前一个保留（不销毁，保留数据缓存）
- 专题 store 包含该专题特有交互状态（如安防的告警确认、教学的楼层筛选）

### 4.2 Store 职责界定

| Store | 职责 | 示例字段 |
|-------|------|----------|
| useThemeStore | 专题导航、切换动画 | currentTheme, isTransitioning |
| useSceneStore | 3D 场景全局状态 | cameraTarget, selectedObjectId, isSceneLoaded |
| useUIStore | 弹窗、告警队列 | activeModals[], alertQueue[], panelCollapsed |
| useThemeXxxStore | 专题内业务交互状态 | 筛选条件、选中指标、时间范围 |

---

## 5. 数据流与 Mock 方案

### 5.1 数据获取架构

```
[校方系统]──REST API──→ [TanStack Query Cache]
                              │
                    ┌─────────┼─────────┐
                    │         │         │
              staleTime  refetchInterval  invalidate on click
               (基础)      (实时/准实时)     (场景联动)
                    │         │         │
                    ▼         ▼         ▼
              [Zustand Store]  ←──  3D 场景点击事件
                    │
          ┌─────────┼─────────┐
          ▼         ▼         ▼
     [DashboardPanel] [3D Annotations] [Modal]
```

### 5.2 四级更新机制

| 更新级别 | TanStack Query 配置 | 适用指标 |
|----------|---------------------|----------|
| 基础数据 | `staleTime: Infinity`，手动 invalidate | 建筑信息、班级信息、教职工基本信息 |
| 周期更新 | `staleTime: 3600_000` (1h) | 资源更新动态、借阅统计、通知公告 |
| 准实时 | `refetchInterval: 5 * 60_000` (5min) | 学生出勤、教职工考勤、入馆人数、教室使用 |
| 实时 | `refetchInterval: 5000` (5s) 或 WebSocket | 告警事件、门禁通行、监控设备状态 |

### 5.3 Mock 策略

- 使用 MSW (Mock Service Worker) 在 Service Worker 层拦截请求
- 每个 API endpoint 定义 handler，返回 faker 生成的符合预期的模拟数据
- 开发环境启用 MSW，生产构建自动排除
- Mock 数据格式与真实 API 完全一致，切换仅需修改 MSW 启用状态

---

## 6. 项目目录结构

```
src/
├── main.tsx                       # 入口，MSW 启动
├── App.tsx                        # 顶层组件
├── assets/
│   └── models/                    # glTF/GLB 三维模型
├── components/
│   ├── layout/
│   │   ├── ScreenLayout.tsx       # CSS Grid 五区域容器
│   │   ├── TopBar.tsx
│   │   ├── LeftPanel.tsx
│   │   ├── RightPanel.tsx
│   │   ├── BottomBar.tsx
│   │   └── ThemeNav.tsx
│   ├── ui/
│   │   ├── DashboardPanel.tsx     # 通用面板容器
│   │   ├── NumberFlip.tsx         # 数字翻牌器
│   │   ├── ScrollList.tsx         # 滚动列表
│   │   ├── Modal.tsx
│   │   ├── AlertModal.tsx
│   │   └── VideoModal.tsx
│   ├── charts/
│   │   ├── BarChart.tsx
│   │   ├── LineChart.tsx
│   │   ├── PieChart.tsx
│   │   ├── RingChart.tsx
│   │   ├── GaugeChart.tsx
│   │   ├── HeatmapChart.tsx
│   │   ├── TreemapChart.tsx
│   │   └── FunnelChart.tsx
│   └── scene/
│       ├── SceneCanvas.tsx         # R3F Canvas 容器
│       ├── CampusBase.tsx          # 校园全局场景（建筑+道路+环境）
│       ├── BuildingModel.tsx       # 单个建筑模型
│       ├── IndoorScene.tsx         # 室内场景
│       ├── CameraController.tsx    # 镜头控制 + 预设路径
│       ├── annotations/
│       │   ├── BuildingLabel.tsx   # 建筑名称标注
│       │   ├── DeviceMarker.tsx    # 设备点位标注
│       │   └── AlertMarker.tsx     # 告警位置标注
│       └── effects/
│           ├── FogEffect.tsx       # 氛围雾
│           ├── PostProcessing.tsx  # 后处理
│           └── ParticleBg.tsx      # 背景粒子动效
├── hooks/
│   ├── useCameraPath.ts
│   ├── useDataRefresh.ts
│   ├── useSceneClick.ts
│   └── useAutoScroll.ts
├── stores/
│   ├── useThemeStore.ts
│   ├── useSceneStore.ts
│   ├── useUIStore.ts
│   └── themes/
│       ├── useOverviewStore.ts
│       ├── useTeachingResearchStore.ts
│       ├── useAdminStore.ts
│       ├── useLibraryStore.ts
│       ├── useAcademicsStore.ts
│       └── useSecurityStore.ts
├── api/
│   ├── client.ts                   # API 客户端（axios/fetch 封装）
│   ├── queries/
│   │   ├── overview.ts
│   │   ├── teachingResearch.ts
│   │   ├── admin.ts
│   │   ├── library.ts
│   │   ├── academics.ts
│   │   └── security.ts
│   └── mocks/
│       ├── server.ts               # MSW server setup
│       ├── handlers/
│       │   ├── overview.ts
│       │   ├── library.ts
│       │   ├── security.ts
│       │   └── ...
│       └── fixtures/
│           ├── overview.ts         # faker fixtures
│           ├── library.ts
│           └── ...
├── themes/
│   ├── overview/                   # 综合态势
│   │   ├── OverviewScene.tsx       # 3D 鸟瞰场景
│   │   ├── panels/
│   │   │   ├── SchoolInfo.tsx      # 学校概况 (1.1)
│   │   │   ├── PersonnelComposition.tsx  # 人员构成 (1.2)
│   │   │   ├── TeacherDistribution.tsx   # 师资分布 (1.3)
│   │   │   ├── StudentInfo.tsx     # 学生基础信息 (1.4)
│   │   │   └── ActivityHeatmap.tsx # 活跃度时段统计 (1.5)
│   │   └── index.ts               # 面板配置导出
│   ├── teaching-research/          # 教学研究
│   ├── admin/                      # 行政办公
│   ├── library/                    # 智慧图书
│   ├── academics/                  # 智慧教学
│   └── security/                   # 智慧安防
├── types/
│   ├── theme.ts                    # Theme 枚举与配置类型
│   ├── panel.ts                    # PanelConfig 类型
│   ├── api.ts                      # API 请求/响应类型
│   └── scene.ts                    # 3D 场景相关类型
└── utils/
    ├── format.ts                   # 数字格式化、时间格式化
    ├── camera-presets.ts           # 镜头预设路径定义
    └── constants.ts                # 布局常量、刷新间隔等
```

---

## 7. 错误处理

### 7.1 分层隔离

```
                       ┌─────────┐
                       │  <App>  │
                       └────┬────┘
              ┌─────────────┼─────────────┐
              │             │             │
     <LeftPanel E.B.>  <Scene E.B.>  <RightPanel E.B.>
              │             │             │
     [图表组件们]    [R3F Canvas]    [图表组件们]
```

- 三个 `ErrorBoundary` 分别包裹左面板、3D 场景、右面板
- 单一区域失败不影响其他：
  - 左面板故障 → 仅左侧数据消失，3D 场景继续运行
  - 3D 场景故障 → 降级为纯数据面板模式，显示场景加载失败提示
  - 右面板故障 → 仅右侧数据消失

### 7.2 数据查询错误

- TanStack Query `error` 状态向下传递
- 每个 DashboardPanel 在自身区域内显示错误状态（重试按钮 + 错误信息），不经由全局 ErrorBoundary
- 单个数据指标查询失败不影响其他指标
- 重试策略：实时数据 `retry: 3, retryDelay: 2000`；基础数据 `retry: 1`

### 7.3 3D 场景降级

- 模型加载失败 → 显示 fallback 几何体（简化长方体 + 标签）+ 控制台 warning
- 相机动画异常 → 跳过动画直接设置目标位置
- WebGL 上下文丢失 → 显示静态背景 + "3D 场景不可用"提示

---

## 8. 测试策略

### 8.1 分层测试

| 层级 | 工具 | 内容 | 优先级 |
|------|------|------|--------|
| 单元测试 | vitest | 工具函数、数据转换、store slice logic | 高 |
| 组件测试 | vitest + @testing-library/react | DashboardPanel 渲染、NumberFlip 动画、ScrollList 滚动 | 中 |
| 集成测试 | playwright-ct | 场景点击→数据面板更新→弹窗的完整链路 | 高 |
| E2E | playwright | 专题切换流程、告警弹窗、30分钟稳定性 | 中 |

### 8.2 关键测试场景

- **专题切换**：从任意专题切换到目标专题，验证镜头动画完整执行、左右面板内容正确替换、前一个专题状态保留
- **场景联动**：点击 3D 对象 → 数据面板更新指标 → 数据面板点击 → 镜头动画定位
- **数据刷新**：Mock 数据按时更新，DashboardPanel 内容自动刷新
- **告警弹窗**：实时告警推送 → 弹窗展示 → 确认/定位交互
- **长时间运行**：playwright 循环运行 30 分钟，无内存泄漏、无崩溃

---

## 9. 平台框架（第一层）交付清单

| 模块 | 交付内容 | 完成标准 |
|------|----------|----------|
| 项目工程 | Vite + React + TS 脚手架，ESLint + Prettier + pnpm | `pnpm dev` 正常启动 |
| 布局框架 | CSS Grid 五区域布局，半透明面板，深色主题基调 | 布局自适应 1920×1080 ~ 3840×1080 |
| 专题导航 | TopBar 6 个 Tab，切换无页面刷新 | 点击 Tab 切换 currentTheme 状态 |
| 3D 底座 | R3F Canvas + 校园全局基础场景（含简化建筑几何体） | Canvas 渲染正常，鼠标交互（旋转/缩放/平移） |
| 镜头系统 | 默认缓慢环绕 + 预设路径动画（CameraController） | 镜头平滑运动，无抖动 |
| UI 组件库 | NumberFlip, ScrollList, DashboardPanel, Modal | 组件独立渲染，接受 children/配置 |
| 图表封装 | ECharts 基础封装（bar/line/pie/ring/gauge/heatmap） | 组件渲染正确图表类型 |
| 数据层骨架 | TanStack Query Provider + MSW 启用/禁用开关 | Mock 数据可正常渲染 |
| 状态层骨架 | 3 个全局 store + 6 个专题 store（空实现） | store 可正常读写 |
| 错误处理 | ErrorBoundary 分层隔离 | 单区域故障不影响其他区域 |

---

## 10. 专题实现（后续层）

每个专题按统一模式实现：

1. **数据接口**：`api/queries/<theme>.ts` 定义 TanStack Query hooks
2. **Mock 数据**：`api/mocks/handlers/<theme>.ts` + `fixtures/<theme>.ts`
3. **面板组件**：`themes/<theme>/panels/` 下按模块拆分，每个模块一个组件
4. **3D 场景**：`themes/<theme>/XxxScene.tsx` 定义该专题的 R3F 场景分支
5. **面板配置**：`themes/<theme>/index.ts` 导出 `{ left: PanelConfig[], right: PanelConfig[] }`

---

## 11. 未决事项（需后续确认）

| 事项 | 决策 | 
|------|------|
| CSS 方案 | TailwindCSS（待确认是否需额外设计规范） |
| 模型来源 | CAD 图纸 + 现场照片手工建模，交付 glTF/GLB 格式 |
| API 具体字段 | 实施阶段与校方技术人员协商，开发阶段用 Mock |
| WebSocket 协议 | 仅实时类指标可能用到，与校方系统协商 |
| 背景音乐 | 选曲与版权在后期制作阶段确定 |
