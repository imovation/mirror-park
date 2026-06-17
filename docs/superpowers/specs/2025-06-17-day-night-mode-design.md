# Day/Night Mode 统一设计方案

## 背景

项目当前有两个独立的 3D 场景版本：
- **Classic**（经典红砖风格）— `CampusBaseClassic.tsx`（415 行）
- **Tron**（暗黑赛博风格）— `CampusBaseTron.tsx`（552 行）

两版本几何结构高度重叠（建筑位置、道路布局、校园拓扑一致），但代码相互独立，通过 `useStyleStore.visualStyle` 在 6 个主题的 Scene 中条件切换。

**目标**：合并为一个统一的 `CampusBase`，通过 `timeMode: 'day' | 'night'` 切换白天/夜间视觉效果。

## 设计原则

1. **一套几何，两套皮肤** — 所有 3D 元素的 position/size/拓扑完全统一
2. **配置驱动** — 颜色、材质、光照等视觉参数集中在一个 `dayNightTheme.ts` 配置文件中
3. **删除冗余** — 移除 `CampusBaseClassic` 和 `CampusBaseTron`，不再有两套代码
4. **保持不变** — 建筑数据（BUILDINGS）、点击交互、飞向逻辑完全不变

## 视觉参数对比

| 元素 | 白天 | 夜间 |
|------|------|------|
| **建筑基色** | `#a0522d` (红砖) | `#06101e` (暗色) |
| **建筑窗户色** | `#f5f0e8` (米白) | `#00e5ff` (青色) |
| **窗户发光** | 0 | 0.6 |
| **窗户 Shader** | 有（两模式共用） | 有（两模式共用） |
| **道路** | 静态灰色 `#3a3a3a` | 光流动画 Shader（橙/青） |
| **地面** | `#1a5c2a` (草地绿) | `#050a14` (暗色) |
| **环境光强度** | 0.8 | 0.4 |
| **方向光强度** | 1.2 | 0.8 |
| **雾色** | `#dce8f5` | `#0a1628` |
| **Canvas 背景** | `#e8f0fe → #ffffff` | `#0a1628 → #16213e` |
| **校门** | 红砖+白墙 | 暗色+青色边线 |
| **庭院** | 自然绿 `#2a4a2a` | 暗绿 `#0e2a1a` + 发光 |
| **水库** | 蓝色标准水面 | 镜面反射 (MeshReflectorMaterial) |
| **城市背景** | 浅灰 `#3a404a` | 深色 `#080c14` |
| **景观树** | 自然绿 | 自发光绿 |
| **花坛** | 有 | 有（颜色略饱和） |
| **POI 标注** | 有（暖色） | 有（青光） |
| **数据连线** | 有（灰色） | 有（青光） |
| **Bloom 强度** | 0.3 | 0.6 |
| **粒子颜色** | `#888888` | `#4a9eff` |
| **粒子透明度** | 0.2 | 0.4 |
| **跑道基色** | `#c44` (红) | `#1a2535` (暗) |
| **跑道线色** | `#c44` | `#00e5ff` |
| **Environment** | `"sunset"` | `"city"` |
| **Hillside** | ❌ 删除 | ❌ 删除 |
| **Grid** | ❌ 删除 | ❌ 删除 |

## 文件变更清单

| 操作 | 文件路径 | 说明 |
|------|----------|------|
| 修改 | `src/stores/useStyleStore.ts` | `visualStyle` → `timeMode`，枚举值改为 `'day' \| 'night'`，默认 `'day'` |
| 新建 | `src/config/dayNightTheme.ts` | 集中导出 `DayNightTheme` 类型 + `DAY_NIGHT` 常量对象 |
| 重写 | `src/components/scene/CampusBase.tsx` | 合并 Classic + Tron，按 mode 应用参数 |
| 删除 | `src/components/scene/CampusBaseClassic.tsx` | 不再需要 |
| 删除 | `src/components/scene/CampusBaseTron.tsx` | 不再需要 |
| 修改 | `src/themes/overview/OverviewScene.tsx` | 去掉条件切换，直接用 `<CampusBase />` |
| 修改 | `src/themes/teaching-research/TeachingResearchScene.tsx` | 同上 |
| 修改 | `src/themes/admin/AdminScene.tsx` | 同上 |
| 修改 | `src/themes/library/LibraryScene.tsx` | 同上 |
| 修改 | `src/themes/academics/AcademicsScene.tsx` | 同上 |
| 修改 | `src/themes/security/SecurityScene.tsx` | 同上 |
| 修改 | `src/components/layout/TopBar.tsx` | 按钮改为白天/夜间切换（☀️/🌙） |
| 修改 | `src/components/scene/SceneCanvas.tsx` | fog 颜色和 Canvas 背景跟随 timeMode |
| 修改 | `src/components/scene/ParticleBg.tsx` | 粒子颜色/透明度跟随 timeMode |
| 修改 | `src/components/scene/CameraController.tsx` | （无实质变化，仅 import 改名） |
| 修改 | `src/utils/constants.ts` | 添加 `SCENE.FOG_COLOR_DAY` 常量 |

## CampusBase 统一结构

```
src/components/scene/CampusBase.tsx

┌─ CampusBase ─────────────────────────────────────┐
│  const mode = useTimeModeStore(s => s.timeMode)  │
│  const cfg = DAY_NIGHT[mode]                      │
│                                                    │
│  <group>                                           │
│    <Plane ground />          ← cfg.ground           │
│    <CityContext />           ← cfg.cityContext      │
│    <Roads />                 ← cfg.road             │
│    <Archways />              ← cfg.archway          │
│    <Courtyards />            ← cfg.courtyard        │
│    <RunningTrack />          ← cfg.track            │
│    <Landscape />             ← cfg.landscape        │
│    <Reservoir />             ← cfg.reservoir        │
│    <GroundDecorations />     ← cfg.poi              │
│    <BuildingMesh /> × 8      ← cfg.building         │
│    <Environment />           ← cfg.environment      │
│    <ContactShadows />                               │
│    <ambientLight />          ← cfg.ambientLight     │
│    <directionalLight />      ← cfg.directionalLight │
│  </group>                                          │
└────────────────────────────────────────────────────┘
```

## DayNightTheme 类型接口

```typescript
export type TimeMode = 'day' | 'night'

export interface DayNightTheme {
  building: {
    baseColor: string
    windowColor: string
    windowDensity: Record<string, number>    // 可统一
    litChance: number
  }
  road: {
    staticColor: string
    flowEnabled: boolean
    flowPrimaryColor: string
    flowSecondaryColor: string
  }
  ground: { color: string }
  ambientLight: { intensity: number }
  directionalLight: { intensity: number; position: [number, number, number] }
  fog: { color: string }
  canvas: { background: string }
  archway: { bodyColor: string; topColor: string; showEdges: boolean; edgeColor: string }
  courtyard: { color: string; emissive: string; emissiveIntensity: number }
  reservoir: { useMirror: boolean; standardColor: string; mirrorColor: string }
  cityContext: { color: string }
  landscape: {
    hedgeColor: string
    treeTrunkColor: string
    treeLeafColor: string
    treeLeafEmissive: string
    treeLeafEmissiveIntensity: number
  }
  poi: { ringColor: string; dotColor: string; pillarColor: string; lineColor: string }
  bloom: { intensity: number }
  particle: { color: string; opacity: number }
  track: { baseColor: string; laneColor: string }
  environment: { preset: string }
}
```

## Store 变更

```typescript
// src/stores/useStyleStore.ts → 重命名为 useTimeModeStore

export type TimeMode = 'day' | 'night'

interface TimeModeState {
  timeMode: TimeMode
  toggleMode: () => void
  setMode: (mode: TimeMode) => void
}

export const useTimeModeStore = create<TimeModeState>((set) => ({
  timeMode: 'day',   // 默认白天模式
  toggleMode: () =>
    set((s) => ({ timeMode: s.timeMode === 'day' ? 'night' : 'day' })),
  setMode: (mode) => set({ timeMode: mode }),
}))
```

## 不变的部分

- **BUILDINGS** 数组（建筑 position/size/label/info）完全不变，从当前 Tron 版本复用
- **GroundDecorations**（POI 标注点 + 数据连线）的位置数据不变，只改颜色
- **Landscape**（绿篱、花坛、大小树）位置不变，只改材质颜色
- **RunningTrack / CityContext / Roads / Archways / Courtyards** 几何数据不变
- **CameraController / OrbitControls** 不变
- **ContactShadows** 不变
- **BuildingMesh 的点击交互**（飞向、选中、Html 标签）逻辑不变

## 切换按钮 UI 变更

TopBar 当前：「🧱 经典 / 💠 Tron」按钮  
TopBar 改为：「☀️ 白天 / 🌙 夜间」按钮

按钮样式跟随当前 mode 变色：
- 白天：暖色（橙色系边框/背景）
- 夜间：冷色（青色系边框/背景）

## 风险点

1. **ShaderMaterial vs MeshStandardMaterial**：建筑在两模式下都用 ShaderMaterial（窗户 Shader），只是 shader 参数不同。注意 `transparent` 属性白天设为 false 可能有助于性能。
2. **道路 Shader 条件启用**：白天用标准材质、夜间用 flow Shader。确保 useFrame 中不会对不存在的 ref 调用。
3. **Environment preset 动态切换**：`@react-three/drei` 的 Environment 组件切换 preset 在运行时是否平滑，需验证。
4. **SceneCanvas fog/background 联动**：当前 SceneCanvas 的 fog 和 Canvas background 是硬编码的，需要随 mode 变化。

## 实施顺序

1. 新建 `src/config/dayNightTheme.ts`
2. 修改 `src/stores/useStyleStore.ts` → `useTimeModeStore`
3. 重写 `src/components/scene/CampusBase.tsx`（合并版）
4. 修改 `SceneCanvas.tsx`（fog/background 联动）
5. 修改 `ParticleBg.tsx`（粒子色联动）
6. 修改 `TopBar.tsx`（按钮 UI）
7. 简化 6 个 theme Scene 文件
8. 更新 `CameraController.tsx` 中的 import 引用
9. 删除 `CampusBaseClassic.tsx` 和 `CampusBaseTron.tsx`
10. 更新 `constants.ts`（添加白天雾色常量）
11. 运行 `pnpm build` + `pnpm test` 验证
