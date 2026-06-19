# Dashboard 布局与样式全面重构 — 设计文档

**日期**: 2026-06-19  
**范围**: 全局 Dashboard 布局、面板内部样式、图表系统、深浅主题联动  
**方案**: C (全面重构) — Hybrid 混合方案

---

## 1. 问题诊断

审计 38 个数据面板 + 11 个图表组件，发现 5 大类问题：

| 问题 | 严重程度 | 涉及范围 |
|------|---------|---------|
| 面板内容密度严重不均 | 🔴 | 9 个面板（同高 flex:1 但内容量差 4x） |
| 硬编码字号绕过 CSS 变量 | 🟡 | 28 个面板文件，~45 处硬编码 px |
| 面板溢出无滚动保护 | 🔴 | 8 个面板可能内容裁剪 |
| 图表配色碎片化 | 🟡 | 11 个图表各有硬编码色数组，`chartTheme.colors` 从未被用 |
| PanelConfig.height 空定义 | 🟢 | 类型存在但 0 引用 |

---

## 2. 架构改动

### 2.1 组件层级（不变骨架，内部增强）

```
ScreenLayout (4行×3列 Grid，不变)
  └── SidePanel (增强: overflow-y:auto + scroll-behavior:smooth)
        └── DashboardPanel (增强: flexGrow + collapsible + overflow管理)
              ├── 标题栏 (新增折叠按钮 ▼/▶，仅 collapsible 面板)
              └── 内容区 (overflow 规则化)
```

### 2.2 PanelConfig 类型扩展

```typescript
// src/types/panel.ts
export interface PanelConfig {
  id: string
  title: string
  height?: 'auto' | 'flex-1' | 'flex-2' | 'flex-3'   // fx: 已消费
  collapsible?: boolean                              // 新增
  collapsedSummary?: string                           // 新增
}
```

### 2.3 DashboardPanel 新增 Props

```typescript
interface DashboardPanelProps {
  title?: string
  flexGrow?: number          // 1 | 2 | 3，默认 1
  collapsible?: boolean      // 默认 false
  collapsedSummary?: string
  className?: string
  children: React.ReactNode
}
```

**折叠状态管理**：DashboardPanel 内部 `useState<boolean>`，每个面板独立维护，不持久化（切换专题时重置）。

**折叠行为**：仅 `flexGrow >= 3 && collapsible` 的面板显示折叠按钮。
- 展开：`flex: {flexGrow}; min-height: 280px;`
- 收起：`flex: 0 0 auto; height: 48px; overflow: hidden;`（仅标题栏可见，`collapsedSummary` 作为副标题显示，未提供时显示面板 title）
- 过渡：`transition: flex 0.3s ease, min-height 0.3s ease`

### 2.4 滚动分层

| 位置 | overflow | 触发条件 |
|------|----------|---------|
| SidePanel | `overflow-y: auto` | 总面板自然高度 > 视口高度 |
| DashboardPanel (flex-1) | `overflow: hidden` | 轻量面板，内容不溢出 |
| DashboardPanel (flex-2/3) | `overflow-y: auto` | 内容超出面板可视区 |

内容区统一 `scrollbar-gutter: stable` 避免滚动条出现/消失导致的布局抖动。

---

## 3. 字号系统重构

### 3.1 CSS 变量扩展

```css
/* 新增 3 个层级 */
--font-size-3xs: 0.55rem;   /* ~8px, 极小标签 (几乎不用) */
--font-size-2xs: 0.62rem;   /* ~9px, 微标签: badge/date/tag */
--font-size-3xl: 1.9rem;    /* ~28px, 极端大数值 */

/* 微调现有 */
--font-size-sm:  0.78rem;   /* ~11px (原 0.75rem) */
--font-size-xxl: 1.5rem;    /* ~22px (原固定 28px → rem) */
```

### 3.2 硬编码 → CSS 变量映射表

| 硬编码 px | 目标变量 | 出现次数 |
|-----------|---------|---------|
| `fontSize: 9` | `var(--font-size-2xs)` | 7 |
| `fontSize: 10` | `var(--font-size-xs)` | 18 |
| `fontSize: 11` | `var(--font-size-sm)` | 5 |
| `fontSize: 12` | `var(--font-size-sm)` | 6 |
| `fontSize: 14` | `var(--font-size-md)` | 2 |
| `fontSize: 18` | `var(--font-size-lg)` | 1 |
| `fontSize: 20` | `var(--font-size-xl)` | 3 |
| `fontSize: 22` | `var(--font-size-xxl)` | 3 |
| `fontSize: 28` | `var(--font-size-3xl)` | 1 |

### 3.3 深浅主题字号差异

浅色模式所有 `--font-size-*` 增加 5%，补偿白底黑字可读性差异。

---

## 4. 图表系统统一

### 4.1 chartTheme.colors 扩展

从 5 色扩展到 8 色 + 2 个专用渐变数组：

```typescript
interface ChartTheme {
  colors: string[]           // 8 色通用系列色
  gaugeColors: string[]      // 5 色仪表盘分段
  heatmapGradient: string[]  // 5 色热力图渐变
  // ... 其余 token 不变
}
```

### 4.2 各图表默认颜色来源

| 图表 | 旧默认来源 | 新默认来源 |
|------|-----------|-----------|
| BarChart | `'#4a9eff'` 硬编码 | `t.colors[i % 8]` |
| LineChart | `'#4a9eff'` 硬编码 | `t.colors[i % 8]` |
| PieChart | `DEFAULT_COLORS` 6 色硬编码 | `t.colors` |
| RingChart | `DEFAULT_COLORS` 5 色硬编码 | `t.colors` |
| GaugeChart | `['#52c41a','#1890ff','#faad14']` | `t.gaugeColors` |
| HeatmapChart | 5 色硬编码 | `t.heatmapGradient` |
| FunnelChart | 同色系 5 色硬编码 | `t.colors` |
| RadarChart | `SERIES_COLORS` 硬编码 | `t.colors` |
| TreemapChart | 6 色硬编码 | `t.colors` |
| SunburstChart | 6 色硬编码 | `t.colors` |
| SankeyChart | gradient (无节点色) | `t.colors` for nodes |

所有 `colors`/`color` prop 保留作为显式覆盖，仅改默认值来源。

### 4.3 图表尺寸

| 参数 | 旧值 | 新值 |
|------|------|------|
| 最小高度保护 | 无 | **120px** (组件内 `Math.max(given, 120)`) |
| BarChart 默认高度 | 200 | 160 |
| LineChart 默认高度 | 200 | 160 |
| PieChart 默认高度 | 200 | 160 |
| RingChart 默认高度 | 200 | 160 |
| GaugeChart 默认高度 | 180 | 150 |
| HeatmapChart 默认高度 | 200 | 180 |
| TreemapChart 默认高度 | 220 | 200 |
| SankeyChart 默认高度 | 240 | 200 |
| SunburstChart 默认高度 | 260 | 220 |
| FunnelChart 默认高度 | 260 | 220 |
| RadarChart 默认高度 | 260 | 220 |

面板内的显式 `height={}` 参数同步调整（如 `height={70}` → `height={120}`）。

### 4.4 图表内部字号

硬编码 `fontSize: 10` / `fontSize: 11` → 替换为读取 CSS 变量计算值。

**实现方式**（ECharts 不原生支持 `var()`）：
```typescript
// 在图表组件内读取计算后的 px 值
const rootStyle = getComputedStyle(document.documentElement)
const axisFontSize = parseInt(rootStyle.getPropertyValue('--font-size-xs'))  // 约 10px
const legendFontSize = parseInt(rootStyle.getPropertyValue('--font-size-sm')) // 约 11px
```
深浅主题切换后尺寸自动响应。

---

## 5. 面板权重分配（6 主题）

### 5.1 Overview（综合态势）— 左 2 + 右 3

| 面板 | 权重 | 折叠 |
|------|------|------|
| FacultyPanorama | flex-3 | ✅ |
| StudentInfo | flex-1 | — |
| ActivityTimeStats | flex-1 | — |
| AssetOverview | flex-1 | — |
| RoomDistribution | flex-1 | — |

### 5.2 Teaching-Research（教学研究）— 左 3 + 右 3

| 面板 | 权重 | 折叠 | 备注 |
|------|------|------|------|
| TeachingResourcesPanel | flex-1 | — | |
| ResourceStatistics | flex-1 | — | |
| ResourceUpdates | flex-1 | — | |
| TeacherTopics | flex-1 | — | |
| ResearchProjectsList | flex-1 | — | |
| TeacherStudiosPanel | flex-2 | — | 加 overflow:auto |

### 5.3 Admin（行政办公）— 左 3 + 右 2

| 面板 | 权重 | 折叠 |
|------|------|------|
| NoticeBoard | flex-1 | — |
| DutySchedule | flex-1 | — |
| MeetingManagement | flex-2 | — |
| SchoolCalendar | flex-2 | — |
| StaffAttendance | flex-3 | ✅ |

### 5.4 Library（智慧图书）— 左 2 + 右 2

| 面板 | 权重 | 折叠 |
|------|------|------|
| BorrowStats | flex-2 | — |
| BookBorrowRank | flex-3 | ✅ |
| ReadingActivities | flex-1 | — |
| VisitorStats | flex-2 | — |

### 5.5 Academics（智慧教学）— 左 2 + 右 2

| 面板 | 权重 | 折叠 |
|------|------|------|
| ScheduleSpace | flex-3 | ✅ |
| TeachingDevices | flex-2 | — |
| StudentAttendance | flex-3 | ✅ |
| ExamManagement | flex-3 | ✅ |

### 5.6 Security（智慧安防）— 左 3 + 右 3

| 面板 | 权重 | 折叠 |
|------|------|------|
| MonitorStatus | flex-2 | — |
| AccessControl | flex-2 | — |
| StudentLeave | flex-3 | ✅ |
| VisitorManagement | flex-2 | — |
| AlertEvents | flex-2 | — |
| CanteenSafety | flex-2 | — |

---

## 6. 深浅主题联动

### 6.1 CSS 变量差异化

浅色模式下：
- 所有 `--font-size-*` 增加 5%
- `--panel-bg` 改为 `rgba(255,255,255,0.7)`
- `--accent` 改为 `#2563eb`
- 滚动条 `--scrollbar-thumb` 调暗

### 6.2 chartTheme 双主题

深色采用 cyan/indigo/yellow 霓虹系；浅色采用 sky/indigo/amber 稳重系。两套 `colors`、`gaugeColors`、`heatmapGradient` 独立定义。

---

## 7. 滚动条样式

```css
.panel-scroll::-webkit-scrollbar       { width: 4px; }
.panel-scroll::-webkit-scrollbar-thumb { background: var(--scrollbar-thumb); border-radius: 2px; }
.panel-scroll::-webkit-scrollbar-track { background: transparent; }

/* Firefox */
.panel-scroll { scrollbar-width: thin; scrollbar-color: var(--scrollbar-thumb) transparent; }
```

---

## 8. 实施文件清单

| 文件 | 改动类型 |
|------|---------|
| `src/types/panel.ts` | 类型扩展 |
| `src/index.css` | CSS变量新增/调整 + 滚动条 + 深浅差异 |
| `src/config/chartTheme.ts` | colors 扩展 + gaugeColors + heatmapGradient |
| `src/components/layout/SidePanel.tsx` | overflow-y:auto |
| `src/components/ui/DashboardPanel.tsx` | flexGrow + collapsible + scrollMode |
| `src/components/charts/*.tsx` (11个) | 颜色→t.colors + 字号→CSS变量 + 最小高度120px |
| `src/themes/overview/index.tsx` | panels 数组 + height + collapsible |
| `src/themes/teaching-research/index.tsx` | panels 数组 + height |
| `src/themes/admin/index.tsx` | panels 数组 + height + collapsible |
| `src/themes/library/index.tsx` | panels 数组 + height + collapsible |
| `src/themes/academics/index.tsx` | panels 数组 + height + collapsible |
| `src/themes/security/index.tsx` | panels 数组 + height + collapsible |
| `src/themes/*/panels/*.tsx` (~28个) | 字号→CSS变量 + 图表高度调整 + overflow |
| `src/App.tsx` | flexGrow 传递 |

---

## 9. 不变部分

- ScreenLayout 的 Grid 4行×3列结构
- 3D 场景 Layer 0 + UI Layer 1 双层架构
- pointer-events 分层策略
- 所有 API queries 和 MSW mock handlers
- 主题注册表 registry.tsx 的 lazy load 机制
- TopBar、BottomBar、TopMetrics 卡片
- ErrorBoundary 层级
- 测试基础设施（测试用例需适配新增 props，逻辑不变）
