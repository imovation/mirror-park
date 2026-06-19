# Dashboard 布局与样式全面重构 — 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 全面重构 Dashboard 面板布局、字体系统、图表配色与尺寸，实现加权弹性布局 + 面板折叠 + 深浅主题联动

**Architecture:** 保持现有 4行×3列 CSS Grid 和 3D UI 双层架构不变。核心改动在 PanelConfig 类型扩展、DashboardPanel 支持 flexGrow/collapsible、SidePanel 增加滚动、11 个图表统一颜色/尺寸、30 个面板内部字号/溢出修复

**Tech Stack:** React 18 + TypeScript, ECharts 5, Zustand, TailwindCSS (不改动)

---

## File Structure

```
修改:
  src/types/panel.ts                          — PanelConfig 扩展
  src/index.css                               — CSS 变量 + 滚动条 + 深浅差异
  src/config/chartTheme.ts                    — colors 扩展 + gaugeColors + heatmapGradient
  src/components/layout/SidePanel.tsx         — overflow-y:auto
  src/components/ui/DashboardPanel.tsx        — flexGrow + collapsible + scrollMode
  src/components/charts/BarChart.tsx          — 颜色/字号/高度
  src/components/charts/LineChart.tsx
  src/components/charts/PieChart.tsx
  src/components/charts/RingChart.tsx
  src/components/charts/GaugeChart.tsx
  src/components/charts/HeatmapChart.tsx
  src/components/charts/TreemapChart.tsx
  src/components/charts/SankeyChart.tsx
  src/components/charts/SunburstChart.tsx
  src/components/charts/FunnelChart.tsx
  src/components/charts/RadarChart.tsx
  src/themes/overview/index.tsx              — height + collapsible
  src/themes/teaching-research/index.tsx
  src/themes/admin/index.tsx
  src/themes/library/index.tsx
  src/themes/academics/index.tsx
  src/themes/security/index.tsx
  src/App.tsx                                 — flexGrow/collapsible 传递
  src/themes/overview/panels/FacultyPanorama.tsx    — 字号/高度
  src/themes/overview/panels/StudentInfo.tsx
  src/themes/overview/panels/ActivityTimeStats.tsx
  src/themes/overview/panels/AssetOverview.tsx
  src/themes/overview/panels/RoomDistribution.tsx
  src/themes/teaching-research/panels/TeachingResourcesPanel.tsx
  src/themes/teaching-research/panels/ResourceStatistics.tsx
  src/themes/teaching-research/panels/ResourceUpdates.tsx
  src/themes/teaching-research/panels/TeacherTopics.tsx
  src/themes/teaching-research/panels/ResearchProjectsList.tsx
  src/themes/teaching-research/panels/TeacherStudiosPanel.tsx
  src/themes/admin/panels/NoticeBoard.tsx
  src/themes/admin/panels/DutySchedule.tsx
  src/themes/admin/panels/MeetingManagement.tsx
  src/themes/admin/panels/SchoolCalendar.tsx
  src/themes/admin/panels/StaffAttendance.tsx
  src/themes/library/panels/BorrowStats.tsx
  src/themes/library/panels/BookBorrowRank.tsx
  src/themes/library/panels/ReadingActivities.tsx
  src/themes/library/panels/VisitorStats.tsx
  src/themes/academics/panels/ScheduleSpace.tsx
  src/themes/academics/panels/TeachingDevices.tsx
  src/themes/academics/panels/StudentAttendance.tsx
  src/themes/academics/panels/ExamManagement.tsx
  src/themes/security/panels/MonitorStatus.tsx
  src/themes/security/panels/AccessControl.tsx
  src/themes/security/panels/StudentLeave.tsx
  src/themes/security/panels/VisitorManagement.tsx
  src/themes/security/panels/AlertEvents.tsx
  src/themes/security/panels/CanteenSafety.tsx

不变:
  src/components/layout/ScreenLayout.tsx     — Grid 不变
  src/components/layout/TopBar.tsx           — 不动
  src/components/layout/BottomBar.tsx        — 不动
  src/themes/registry.tsx                    — 不动
  src/api/*                                  — 不动
  src/stores/*                               — 不动
```

---

### Task 1: 类型系统 + CSS 基础

**Files:**
- Modify: `src/types/panel.ts`
- Modify: `src/index.css`

- [ ] **Step 1: 扩展 PanelConfig 类型**

替换 `src/types/panel.ts` 为：

```typescript
import type { ReactNode } from 'react'

export interface PanelConfig {
  id: string
  title: string
  height?: 'auto' | 'flex-1' | 'flex-2' | 'flex-3'
  collapsible?: boolean
  collapsedSummary?: string
}

export interface DashboardPanelProps {
  title?: string
  flexGrow?: number
  collapsible?: boolean
  collapsedSummary?: string
  className?: string
  children: ReactNode
}
```

- [ ] **Step 2: 添加/调整 CSS 变量**

读取 `src/index.css` 当前 `:root` 块（第5-57行），在 `--font-size-xxl` 前插入新变量，修改 `--font-size-xxl` 和 `--font-size-sm`，最后添加新变量：

在 `--font-size-xxl: 28px;` (line 47) 之前添加：

```css
  --font-size-3xs: 0.55rem;
  --font-size-2xs: 0.62rem;
```

将 line 37 `--font-size-sm: 0.75rem;` 改为 `--font-size-sm: 0.78rem;`

将 line 47 `--font-size-xxl: 28px;` 改为 `--font-size-xxl: 1.5rem;`

在 `--font-size-xxl` 行后添加：

```css
  --font-size-3xl: 1.9rem;
```

在 `--skeleton-bg` 行后 (line 56) 添加：

```css
  --panel-padding: 12px;
  --panel-scrollbar-width: 4px;
  --chart-min-height: 120px;
```

- [ ] **Step 3: 浅色主题字号差异化**

在 `[data-ui-theme="light"]` 块（约 line 59-98）中，替换整个 `--font-size-*` 系列变量。找到 light 主题中的字号行（当前没有，因为只有 `:root` 有字号），在 light 块末尾 `}` 之前添加：

```css
  --font-size-3xs: 0.58rem;
  --font-size-2xs: 0.65rem;
  --font-size-xs: 0.72rem;
  --font-size-sm: 0.80rem;
  --font-size-md: 0.90rem;
  --font-size-lg: 1.02rem;
  --font-size-xl: 1.17rem;
  --font-size-xxl: 1.52rem;
  --font-size-3xl: 2rem;
  --panel-padding: 12px;
  --panel-scrollbar-width: 4px;
```

- [ ] **Step 4: 添加滚动条样式**

在 `src/index.css` 末尾（`}` 闭合之后）添加：

```css
.panel-scroll::-webkit-scrollbar {
  width: var(--panel-scrollbar-width);
}

.panel-scroll::-webkit-scrollbar-thumb {
  background: var(--scrollbar-thumb);
  border-radius: 2px;
}

.panel-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.panel-scroll {
  scrollbar-width: thin;
  scrollbar-color: var(--scrollbar-thumb) transparent;
}
```

- [ ] **Step 5: 验证构建**

```bash
pnpm build
```

期望：编译通过，无类型错误

- [ ] **Step 6: 提交**

```bash
git add src/types/panel.ts src/index.css
git commit -m "feat: 扩展 PanelConfig 类型 + CSS 字号/滚动条变量"
```

---

### Task 2: ChartTheme 扩展

**Files:**
- Modify: `src/config/chartTheme.ts`

- [ ] **Step 1: 扩展 ChartTheme 接口和 DARK/LIGHT 配色**

替换 `src/config/chartTheme.ts` 为：

```typescript
import { useUIThemeStore } from '@/stores/useUIThemeStore'
import type { UITheme } from '@/stores/useUIThemeStore'

export interface ChartTheme {
  axisLabel: string
  axisLine: string
  splitLine: string
  label: string
  title: string
  legendText: string
  borderColor: string
  gaugeAxis: string
  shadowColor: string
  colors: string[]
  gaugeColors: string[]
  heatmapGradient: string[]
}

const DARK: ChartTheme = {
  axisLabel: 'rgba(255,255,255,0.6)',
  axisLine: 'rgba(34,211,238,0.3)',
  splitLine: 'rgba(34,211,238,0.1)',
  label: 'rgba(255,255,255,0.8)',
  title: 'rgba(34,211,238,0.9)',
  legendText: 'rgba(255,255,255,0.7)',
  borderColor: 'rgba(10,22,40,1)',
  gaugeAxis: '#fff',
  shadowColor: 'rgba(34,211,238,0.4)',
  colors: ['#22d3ee', '#818cf8', '#facc15', '#34d399', '#f472b6', '#fb923c', '#a78bfa', '#2dd4bf'],
  gaugeColors: ['#34d399', '#22d3ee', '#facc15', '#fb923c', '#f472b6'],
  heatmapGradient: ['#0a1628', '#1a3a5c', '#2a6090', '#22d3ee', '#67e8f9'],
}

const LIGHT: ChartTheme = {
  axisLabel: 'rgba(0,0,0,0.5)',
  axisLine: 'rgba(0,0,0,0.1)',
  splitLine: 'rgba(0,0,0,0.06)',
  label: 'rgba(0,0,0,0.6)',
  title: 'rgba(0,0,0,0.5)',
  legendText: 'rgba(0,0,0,0.5)',
  borderColor: 'rgba(0,0,0,0.06)',
  gaugeAxis: '#333',
  shadowColor: 'rgba(0,0,0,0.15)',
  colors: ['#0284c7', '#4f46e5', '#ca8a04', '#059669', '#db2777', '#ea580c', '#7c3aed', '#0d9488'],
  gaugeColors: ['#059669', '#0284c7', '#ca8a04', '#ea580c', '#db2777'],
  heatmapGradient: ['#eef1f5', '#bae6fd', '#7dd3fc', '#0284c7', '#0369a1'],
}

const THEMES: Record<UITheme, ChartTheme> = { dark: DARK, light: LIGHT }

export function useChartTheme(): ChartTheme {
  const uiTheme = useUIThemeStore((s) => s.uiTheme)
  return THEMES[uiTheme]
}
```

- [ ] **Step 2: 验证构建**

```bash
pnpm build
```

期望：编译通过

- [ ] **Step 3: 提交**

```bash
git add src/config/chartTheme.ts
git commit -m "feat: 扩展 chartTheme colors → 8色 + gaugeColors + heatmapGradient"
```

---

### Task 3: SidePanel + DashboardPanel 布局升级

**Files:**
- Modify: `src/components/layout/SidePanel.tsx`
- Modify: `src/components/ui/DashboardPanel.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: SidePanel 添加滚动**

替换 `src/components/layout/SidePanel.tsx` 为：

```typescript
import type { ReactNode } from 'react'

interface SidePanelProps {
  children: ReactNode
}

export default function SidePanel({ children }: SidePanelProps) {
  return (
    <div className="panel-scroll" style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      height: '100%',
      paddingTop: 4,
      overflowY: 'auto',
      backdropFilter: 'blur(6px)',
      WebkitBackdropFilter: 'blur(6px)',
    }}>
      {children}
    </div>
  )
}
```

- [ ] **Step 2: DashboardPanel 支持 flexGrow + collapsible + scrollMode**

替换 `src/components/ui/DashboardPanel.tsx` 为：

```typescript
import { useState } from 'react'
import type { ReactNode } from 'react'

interface DashboardPanelProps {
  title?: string
  flexGrow?: number
  collapsible?: boolean
  collapsedSummary?: string
  className?: string
  children: ReactNode
}

export default function DashboardPanel({
  title,
  flexGrow = 1,
  collapsible = false,
  collapsedSummary,
  className = '',
  children,
}: DashboardPanelProps) {
  const [collapsed, setCollapsed] = useState(false)
  const showCollapse = collapsible && flexGrow >= 3
  const scrollMode = flexGrow >= 2 ? 'auto' : 'hidden'

  return (
    <div
      className={`panel-enter relative flex flex-col backdrop-blur-md border rounded-md overflow-hidden ${className}`}
      style={{
        flex: collapsed && showCollapse ? '0 0 auto' : flexGrow,
        minHeight: collapsed && showCollapse ? 0 : 0,
        height: collapsed && showCollapse ? 48 : undefined,
        background: 'var(--panel-bg)',
        borderColor: 'var(--border-strong)',
        transition: 'flex 0.3s ease, min-height 0.3s ease, height 0.3s ease',
      }}
    >
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2" style={{ borderColor: 'var(--accent)' }} />
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2" style={{ borderColor: 'var(--accent)' }} />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2" style={{ borderColor: 'var(--accent)' }} />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2" style={{ borderColor: 'var(--accent)' }} />

      {title && (
        <div
          className="flex items-center px-4 py-2 border-b flex-shrink-0"
          style={{
            borderBottomColor: 'var(--border-light)',
            background: 'linear-gradient(90deg, rgba(var(--accent-rgb), 0.15), transparent)',
          }}
        >
          <div
            className="w-1 h-4 mr-2"
            style={{
              background: 'var(--accent)',
              boxShadow: '0 0 8px rgba(var(--accent-rgb), 0.8)',
            }}
          />
          <h3
            className="font-bold tracking-wide flex-1"
            style={{
              color: 'var(--text-primary)',
              filter: 'drop-shadow(0 0 2px rgba(var(--accent-rgb), 0.5))',
            }}
          >
            {title}
          </h3>
          {showCollapse && (
            <button
              onClick={() => setCollapsed((v) => !v)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--accent)',
                cursor: 'pointer',
                fontSize: 'var(--font-size-md)',
                padding: '2px 6px',
                lineHeight: 1,
              }}
            >
              {collapsed ? '▶' : '▼'}
            </button>
          )}
        </div>
      )}
      {(!collapsed || !showCollapse) && (
        <div
          className={`flex-1 relative ${scrollMode === 'auto' ? 'panel-scroll' : ''}`}
          style={{
            padding: 'var(--panel-padding)',
            overflowY: scrollMode,
            overflowX: 'hidden',
          }}
        >
          {children}
        </div>
      )}
      {collapsed && showCollapse && collapsedSummary && (
        <div
          style={{
            fontSize: 'var(--font-size-xs)',
            color: 'var(--text-tertiary)',
            padding: '0 16px 4px',
          }}
        >
          {collapsedSummary}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 3: App.tsx 传递 flexGrow/collapsible**

修改 `src/App.tsx` 中面板渲染部分（lines 62-67 和 75-80）。将：

```tsx
<DashboardPanel key={p.id} title={p.title}>
```

改为：

```tsx
<DashboardPanel
  key={p.id}
  title={p.title}
  flexGrow={p.height === 'flex-2' ? 2 : p.height === 'flex-3' ? 3 : 1}
  collapsible={p.collapsible}
  collapsedSummary={p.collapsedSummary}
>
```

左右两侧都要改（共 2 处）。

- [ ] **Step 4: 验证构建**

```bash
pnpm build
```

期望：编译通过

- [ ] **Step 5: 提交**

```bash
git add src/components/layout/SidePanel.tsx src/components/ui/DashboardPanel.tsx src/App.tsx
git commit -m "feat: DashboardPanel flexGrow/collapsible + SidePanel 滚动"
```

---

### Task 4: 图表组件统一（共 11 个）

以下所有图表改动遵循统一模式：
1. 默认颜色 → `t.colors`（或 `t.gaugeColors`/`t.heatmapGradient`）
2. 硬编码 `fontSize: N` → 从 `document.documentElement` 读取 CSS 变量计算值
3. 默认高度下调（如 200→160），但组件内 `Math.max(height, 120)` 保底

- [ ] **Step 1: 创建字号读取工具函数**

在 `src/config/chartTheme.ts` 末尾（`useChartTheme` 之后）添加：

```typescript
export function getChartFontSizes() {
  const rootStyle = getComputedStyle(document.documentElement)
  return {
    axisFontSize: parseInt(rootStyle.getPropertyValue('--font-size-xs').trim()) || 10,
    legendFontSize: parseInt(rootStyle.getPropertyValue('--font-size-sm').trim()) || 11,
    titleFontSize: parseInt(rootStyle.getPropertyValue('--font-size-md').trim()) || 12,
  }
}
```

- [ ] **Step 2: BarChart** — 修改 `src/components/charts/BarChart.tsx`

```typescript
import ReactECharts from 'echarts-for-react'
import type { EChartsOption } from 'echarts'
import { useChartTheme, getChartFontSizes } from '@/config/chartTheme'

interface BarChartProps {
  data: { name: string; value: number }[]
  height?: number
  horizontal?: boolean
  color?: string
  colors?: (string | undefined)[]
  barWidth?: number | string
  gridLeft?: number | string
  gridBottom?: number | string
  gridTop?: number | string
}

const MIN_HEIGHT = 120

export default function BarChart({ data, height = 160, horizontal = true, color, colors, barWidth, gridLeft, gridBottom, gridTop }: BarChartProps) {
  const t = useChartTheme()
  const f = getChartFontSizes()
  const seriesColor = color || colors?.[0] || t.colors[0]
  const option: EChartsOption = {
    tooltip: { trigger: 'axis' },
    grid: { left: gridLeft ?? 10, right: 20, top: gridTop ?? 5, bottom: gridBottom ?? 5, containLabel: true },
    [horizontal ? 'yAxis' : 'xAxis']: {
      type: 'category',
      data: data.map((d) => d.name),
      axisLabel: { color: t.axisLabel, fontSize: f.axisFontSize, verticalAlign: 'middle' },
      axisLine: { show: false },
      axisTick: { show: false },
    },
    [horizontal ? 'xAxis' : 'yAxis']: {
      type: 'value',
      splitLine: { lineStyle: { color: t.splitLine } },
      axisLabel: { color: t.axisLabel, fontSize: f.axisFontSize },
    },
    series: [
      {
        type: 'bar',
        data: data.map((d, i) => ({
          value: d.value,
          itemStyle: {
            color: colors?.[i] || seriesColor || t.colors[i % t.colors.length],
            borderRadius: horizontal ? [0, 3, 3, 0] : [3, 3, 0, 0],
            opacity: 0.85,
          },
        })),
        barWidth: barWidth || '50%',
      },
    ],
  }

  return <ReactECharts option={option} style={{ height: Math.max(height, MIN_HEIGHT), width: '100%' }} notMerge />
}
```

- [ ] **Step 3: LineChart** — 修改 `src/components/charts/LineChart.tsx`

```typescript
import ReactECharts from 'echarts-for-react'
import type { EChartsOption } from 'echarts'
import { useChartTheme, getChartFontSizes } from '@/config/chartTheme'

interface LineChartProps {
  xData: string[]
  series: { name: string; data: number[]; color?: string }[]
  height?: number
  smooth?: boolean
  area?: boolean
}

const MIN_HEIGHT = 120

export default function LineChart({ xData, series, height = 160, smooth = false, area = false }: LineChartProps) {
  const t = useChartTheme()
  const f = getChartFontSizes()
  const option: EChartsOption = {
    tooltip: { trigger: 'axis' },
    legend: {
      data: series.map((s) => s.name),
      bottom: 0,
      textStyle: { color: t.legendText, fontSize: f.legendFontSize },
    },
    grid: { left: 10, right: '6%', top: 5, bottom: 32, containLabel: true },
    xAxis: {
      type: 'category',
      data: xData,
      axisLabel: { color: t.axisLabel, fontSize: f.axisFontSize, rotate: 30 },
      axisLine: { lineStyle: { color: t.axisLine } },
    },
    yAxis: {
      type: 'value',
      scale: true,
      splitLine: { lineStyle: { color: t.splitLine } },
      axisLabel: { color: t.axisLabel, fontSize: f.axisFontSize },
    },
    series: series.map((s, i) => ({
      type: 'line',
      name: s.name,
      data: s.data,
      smooth,
      lineStyle: { color: s.color || t.colors[i % t.colors.length], width: 2 },
      areaStyle: area ? { color: (s.color || t.colors[i % t.colors.length]) + '20' } : undefined,
      itemStyle: { color: s.color || t.colors[i % t.colors.length] },
    })),
  }

  return <ReactECharts option={option} style={{ height: Math.max(height, MIN_HEIGHT), width: '100%' }} notMerge />
}
```

- [ ] **Step 4: PieChart** — 修改 `src/components/charts/PieChart.tsx`

```typescript
import ReactECharts from 'echarts-for-react'
import type { EChartsOption } from 'echarts'
import { useChartTheme, getChartFontSizes } from '@/config/chartTheme'

interface PieChartProps {
  data: { name: string; value: number }[]
  height?: number
  colors?: string[]
  radius?: [string, string]
}

const MIN_HEIGHT = 120

export default function PieChart({ data, height = 160, colors, radius }: PieChartProps) {
  const t = useChartTheme()
  const f = getChartFontSizes()
  const r = radius || ['0', '55%']
  const pieColors = colors || t.colors.slice(0, data.length)
  const option: EChartsOption = {
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    color: pieColors,
    legend: {
      orient: 'vertical',
      right: 5,
      top: 'center',
      textStyle: { color: t.legendText, fontSize: f.legendFontSize },
      itemWidth: 8,
      itemHeight: 8,
    },
    series: [
      {
        type: 'pie',
        radius: r,
        center: ['50%', '50%'],
        data,
        avoidLabelOverlap: true,
        label: { show: false },
        emphasis: { itemStyle: { shadowBlur: 10, shadowColor: t.shadowColor } },
      },
    ],
  }

  return <ReactECharts option={option} style={{ height: Math.max(height, MIN_HEIGHT), width: '100%' }} notMerge />
}
```

- [ ] **Step 5: RingChart** — 修改 `src/components/charts/RingChart.tsx`

删除 line 15 的 `const DEFAULT_COLORS = [...]`。

替换 line 17 的默认参数和函数体。完整文件：

```typescript
import ReactECharts from 'echarts-for-react'
import type { EChartsOption } from 'echarts'
import { useChartTheme, getChartFontSizes } from '@/config/chartTheme'

interface RingChartProps {
  data: { name: string; value: number }[]
  height?: number
  colors?: string[]
  centerLabel?: string
  centerLabelSize?: number
  centerLabelColor?: string
  legendPosition?: 'bottom' | 'right'
}

const MIN_HEIGHT = 120

export default function RingChart({ data, height = 160, colors, centerLabel, centerLabelSize = 14, centerLabelColor = '#4a9eff', legendPosition }: RingChartProps) {
  const t = useChartTheme()
  const f = getChartFontSizes()
  const ringColors = colors || t.colors.slice(0, data.length)
  const option: EChartsOption = {
    tooltip: { trigger: 'item' },
    color: ringColors,
    legend: legendPosition
      ? legendPosition === 'right'
        ? {
            orient: 'vertical',
            right: 0,
            top: 'center',
            textStyle: { color: t.legendText, fontSize: f.legendFontSize },
            itemWidth: 8,
            itemHeight: 8,
          }
        : {
            orient: 'horizontal',
            bottom: 0,
            left: 'center',
            textStyle: { color: t.legendText, fontSize: f.legendFontSize },
            itemWidth: 8,
            itemHeight: 8,
            itemGap: 8,
          }
      : undefined,
    series: [
      {
        type: 'pie',
        radius: legendPosition === 'right' ? ['40%', '62%'] : ['50%', '75%'],
        center: legendPosition === 'right' ? ['35%', '50%'] : ['50%', '50%'],
        data,
        label: { show: false },
        emphasis: { scale: false },
      },
    ],
    graphic: centerLabel
      ? [
          {
            type: 'text',
            left: legendPosition === 'right' ? '35%' : 'center',
            top: 'center',
            style: {
              text: centerLabel,
              align: 'center',
              fill: centerLabelColor,
              fontSize: centerLabelSize,
              fontWeight: 'bold',
            },
          },
        ]
      : [],
  }

  return <ReactECharts option={option} style={{ height: Math.max(height, MIN_HEIGHT), width: '100%' }} notMerge />
}
```

- [ ] **Step 6: GaugeChart** — 修改 `src/components/charts/GaugeChart.tsx`

```typescript
import ReactECharts from 'echarts-for-react'
import type { EChartsOption } from 'echarts'
import { useChartTheme, getChartFontSizes } from '@/config/chartTheme'

interface GaugeChartProps {
  value: number
  max?: number
  name?: string
  height?: number
}

const MIN_HEIGHT = 120

export default function GaugeChart({ value, max = 100, name = '', height = 150 }: GaugeChartProps) {
  const t = useChartTheme()
  const f = getChartFontSizes()
  const option: EChartsOption = {
    series: [
      {
        type: 'gauge',
        startAngle: 210,
        endAngle: -30,
        center: ['50%', '55%'],
        radius: '90%',
        min: 0,
        max,
        axisLine: {
          lineStyle: {
            width: 16,
            color: [
              [0.3, t.gaugeColors[0]],
              [0.7, t.gaugeColors[1]],
              [1, t.gaugeColors[2]],
            ],
          },
        },
        pointer: { length: '60%', width: 6, itemStyle: { color: '#fff' } },
        axisTick: { distance: -14, length: 6, lineStyle: { color: t.gaugeAxis, width: 1 } },
        splitLine: { distance: -20, length: 16, lineStyle: { color: t.gaugeAxis, width: 2 } },
        axisLabel: { color: t.axisLabel, fontSize: f.axisFontSize, distance: 28 },
        detail: {
          valueAnimation: true,
          formatter: '{value}%',
          color: '#fff',
          fontSize: f.titleFontSize + 8,
          offsetCenter: [0, '55%'],
        },
        title: {
          offsetCenter: [0, '80%'],
          color: t.title,
          fontSize: f.legendFontSize,
        },
        data: [{ value, name }],
      },
    ],
  }

  return <ReactECharts option={option} style={{ height: Math.max(height, MIN_HEIGHT), width: '100%' }} notMerge />
}
```

- [ ] **Step 7: HeatmapChart** — 修改 `src/components/charts/HeatmapChart.tsx`

替换文件为：

```typescript
import ReactECharts from 'echarts-for-react'
import type { EChartsOption } from 'echarts'
import { useChartTheme, getChartFontSizes } from '@/config/chartTheme'

interface HeatmapChartProps {
  xLabels: string[]
  yLabels: string[]
  data: [number, number, number][]
  height?: number
}

const MIN_HEIGHT = 120

export default function HeatmapChart({ xLabels, yLabels, data, height = 180 }: HeatmapChartProps) {
  const t = useChartTheme()
  const f = getChartFontSizes()
  const option: EChartsOption = {
    tooltip: { position: 'top' },
    grid: { left: 60, right: 20, top: 5, bottom: 30 },
    xAxis: {
      type: 'category',
      data: xLabels,
      axisLabel: { color: t.axisLabel, fontSize: f.axisFontSize },
      splitArea: { show: true },
    },
    yAxis: {
      type: 'category',
      data: yLabels,
      axisLabel: { color: t.axisLabel, fontSize: f.axisFontSize },
      splitArea: { show: true },
    },
    visualMap: {
      min: 0,
      max: Math.max(...data.map((d) => d[2]), 10),
      calculable: false,
      orient: 'horizontal',
      left: 'center',
      bottom: 0,
      inRange: { color: t.heatmapGradient },
    },
    series: [
      {
        type: 'heatmap',
        data,
        label: { show: false },
        emphasis: { itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.5)' } },
      },
    ],
  }

  return <ReactECharts option={option} style={{ height: Math.max(height, MIN_HEIGHT), width: '100%' }} notMerge />
}
```

- [ ] **Step 8: TreemapChart** — 修改 `src/components/charts/TreemapChart.tsx`

替换文件为（仅改一行：line 60 硬编码色数组 → `t.colors`，字号→`getChartFontSizes`）：

```typescript
import ReactECharts from 'echarts-for-react'
import type { EChartsOption } from 'echarts'
import { useChartTheme, getChartFontSizes } from '@/config/chartTheme'

interface TreemapNode {
  name: string
  value: number
  children?: TreemapNode[]
}

interface TreemapChartProps {
  data: TreemapNode[]
  height?: number
  title?: string
}

const MIN_HEIGHT = 120

export default function TreemapChart({ data, height = 200, title }: TreemapChartProps) {
  const t = useChartTheme()
  const f = getChartFontSizes()
  const option: EChartsOption = {
    tooltip: {
      formatter: (params: any) => {
        const p = Array.isArray(params) ? params[0] : params
        return `${p.name}: ${p.value}`
      },
    },
    series: [
      {
        type: 'treemap',
        data,
        width: '100%',
        height: '100%',
        roam: false,
        nodeClick: false,
        breadcrumb: { show: false },
        label: {
          show: true,
          formatter: '{b}',
          fontSize: f.legendFontSize,
          color: t.label,
        },
        upperLabel: {
          show: true,
          height: 22,
          fontSize: f.legendFontSize,
          color: t.label,
          backgroundColor: 'rgba(0,0,0,0.3)',
        },
        itemStyle: {
          borderColor: t.borderColor,
          borderWidth: 2,
          gapWidth: 2,
        },
        levels: [
          {
            colorMappingBy: 'value',
            itemStyle: { gapWidth: 2, borderWidth: 2, borderColor: t.borderColor },
          },
          {
            colorMappingBy: 'value',
            color: t.colors,
          },
        ],
      },
    ],
  }

  if (title) {
    option.title = {
      text: title,
      textStyle: { color: t.title, fontSize: f.titleFontSize, fontWeight: 'normal' },
      left: 'center',
      top: -5,
    }
  }

  return <ReactECharts option={option} style={{ height: Math.max(height, MIN_HEIGHT), width: '100%' }} notMerge />
}
```

- [ ] **Step 9: SankeyChart** — 修改 `src/components/charts/SankeyChart.tsx`

仅改字号（lines 35, 45 → `getChartFontSizes`）和添加 MIN_HEIGHT=120，默认高度 240→200。

```typescript
import ReactECharts from 'echarts-for-react'
import type { EChartsOption } from 'echarts'
import { useChartTheme, getChartFontSizes } from '@/config/chartTheme'

interface SankeyLink {
  source: string
  target: string
  value: number
}

interface SankeyChartProps {
  data: SankeyLink[]
  categories: string[]
  height?: number
  title?: string
}

const MIN_HEIGHT = 120

export default function SankeyChart({ data, categories, height = 200, title }: SankeyChartProps) {
  const t = useChartTheme()
  const f = getChartFontSizes()
  const option: EChartsOption = {
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        const p = Array.isArray(params) ? params[0] : params
        return `${p.data?.source || p.name} → ${p.data?.target || ''}: ${p.data?.value || p.value}`
      },
    },
    series: [
      {
        type: 'sankey',
        layout: 'none',
        layoutIterations: 32,
        emphasis: { focus: 'adjacency' },
        lineStyle: { color: 'gradient', opacity: 0.4 },
        label: { color: t.label, fontSize: f.legendFontSize },
        data: categories.map((name) => ({ name })),
        links: data,
      } as any,
    ],
  }

  if (title) {
    option.title = {
      text: title,
      textStyle: { color: t.title, fontSize: f.titleFontSize, fontWeight: 'normal' },
      left: 'center',
      top: -5,
    }
  }

  return <ReactECharts option={option} style={{ height: Math.max(height, MIN_HEIGHT), width: '100%' }} notMerge />
}
```

- [ ] **Step 10: SunburstChart** — 修改 `src/components/charts/SunburstChart.tsx`

Line 46 硬编码色数组→`t.colors`，字号→`getChartFontSizes`，添加 MIN_HEIGHT=120，默认高度 260→220。

```typescript
import ReactECharts from 'echarts-for-react'
import type { EChartsOption } from 'echarts'
import { useChartTheme, getChartFontSizes } from '@/config/chartTheme'

interface SunburstNode {
  name: string
  value?: number
  children?: SunburstNode[]
}

interface SunburstChartProps {
  data: SunburstNode[]
  height?: number
  title?: string
}

const MIN_HEIGHT = 120

export default function SunburstChart({ data, height = 220, title }: SunburstChartProps) {
  const t = useChartTheme()
  const f = getChartFontSizes()
  const option: EChartsOption = {
    tooltip: {
      formatter: (params: any) => {
        const p = Array.isArray(params) ? params[0] : params
        return `${p.name}: ${p.value ?? ''}`
      },
    },
    series: [
      {
        type: 'sunburst',
        data,
        radius: [0, '95%'],
        sort: 'desc',
        emphasis: { focus: 'descendant' },
        label: {
          rotate: 'radial',
          color: t.label,
          fontSize: f.legendFontSize,
        },
        itemStyle: {
          borderRadius: 4,
          borderColor: t.borderColor,
          borderWidth: 2,
        },
        levels: [
          {} as any,
          {
            color: t.colors,
            colorMappingBy: 'value',
          } as any,
          {
            colorMappingBy: 'value',
            saturation: 0.6,
          } as any,
        ],
      },
    ],
  }

  if (title) {
    option.title = {
      text: title,
      textStyle: { color: t.title, fontSize: f.titleFontSize, fontWeight: 'normal' },
      left: 'center',
      top: -5,
    }
  }

  return <ReactECharts option={option} style={{ height: Math.max(height, MIN_HEIGHT), width: '100%' }} notMerge />
}
```

- [ ] **Step 11: FunnelChart** — 修改 `src/components/charts/FunnelChart.tsx`

删除 line 12 `DEFAULT_COLORS` 常量，`color` 默认值改为 `undefined`，在组件内 `t.colors` 作为后备，字号→`getChartFontSizes`，添加 MIN_HEIGHT=120，默认高度 260→220。

```typescript
import ReactECharts from 'echarts-for-react'
import type { EChartsOption } from 'echarts'
import { useChartTheme, getChartFontSizes } from '@/config/chartTheme'

interface FunnelChartProps {
  data: { name: string; value: number }[]
  height?: number
  title?: string
  color?: string[]
}

const MIN_HEIGHT = 120

export default function FunnelChart({ data, height = 220, title, color }: FunnelChartProps) {
  const t = useChartTheme()
  const f = getChartFontSizes()
  const funnelColors = color || t.colors
  const option: EChartsOption = {
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        const p = Array.isArray(params) ? params[0] : params
        return `${p.name}: ${p.value}`
      },
    },
    series: [
      {
        type: 'funnel',
        left: '10%',
        right: '10%',
        sort: 'descending',
        gap: 6,
        label: {
          show: true,
          position: 'inside',
          color: t.label,
          fontSize: f.legendFontSize,
          formatter: '{b}: {c}',
        },
        labelLine: { show: false },
        itemStyle: { borderColor: t.borderColor, borderWidth: 2 },
        emphasis: {
          label: { fontSize: f.titleFontSize, fontWeight: 'bold' },
        },
        data: data.map((d, i) => ({ ...d, itemStyle: { color: funnelColors[i % funnelColors.length] } })),
      },
    ],
  }

  if (title) {
    option.title = {
      text: title,
      textStyle: { color: t.title, fontSize: f.titleFontSize, fontWeight: 'normal' },
      left: 'center',
      top: -5,
    }
  }

  return <ReactECharts option={option} style={{ height: Math.max(height, MIN_HEIGHT), width: '100%' }} notMerge />
}
```

- [ ] **Step 12: RadarChart** — 修改 `src/components/charts/RadarChart.tsx`

删除 line 23 `SERIES_COLORS` 常量，改用 `t.colors`，字号→`getChartFontSizes`，添加 MIN_HEIGHT=120，默认高度 260→220。

```typescript
import ReactECharts from 'echarts-for-react'
import type { EChartsOption } from 'echarts'
import { useChartTheme, getChartFontSizes } from '@/config/chartTheme'

interface RadarIndicator {
  name: string
  max: number
}

interface RadarSeries {
  name: string
  value: number[]
  color?: string
}

interface RadarChartProps {
  indicator: RadarIndicator[]
  series: RadarSeries[]
  height?: number
  title?: string
}

const MIN_HEIGHT = 120

export default function RadarChart({ indicator, series, height = 220, title }: RadarChartProps) {
  const t = useChartTheme()
  const f = getChartFontSizes()
  const option: EChartsOption = {
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        const p = Array.isArray(params) ? params[0] : params
        return `${p.seriesName}: ${p.value ?? ''}`
      },
    },
    radar: {
      indicator,
      radius: '65%',
      splitNumber: 4,
      shape: 'polygon',
      axisName: {
        color: t.label,
        fontSize: f.legendFontSize,
      },
      splitArea: {
        areaStyle: {
          color: ['rgba(74,158,255,0.02)', 'rgba(74,158,255,0.05)', 'rgba(74,158,255,0.02)', 'rgba(74,158,255,0.05)'],
        },
      },
      splitLine: {
        lineStyle: { color: t.axisLine },
      },
      axisLine: {
        lineStyle: { color: t.axisLine },
      },
    },
    series: [
      {
        type: 'radar',
        data: series.map((s, i) => ({
          value: s.value,
          name: s.name,
          areaStyle: { color: s.color || t.colors[i % t.colors.length], opacity: 0.15 },
          lineStyle: { color: s.color || t.colors[i % t.colors.length], width: 2 },
          itemStyle: { color: s.color || t.colors[i % t.colors.length] },
        })),
        symbol: 'circle',
        symbolSize: 6,
        label: { show: false },
      },
    ],
  }

  if (title) {
    option.title = {
      text: title,
      textStyle: { color: t.title, fontSize: f.titleFontSize, fontWeight: 'normal' },
      left: 'center',
      top: -5,
    }
  }

  return <ReactECharts option={option} style={{ height: Math.max(height, MIN_HEIGHT), width: '100%' }} notMerge />
}
```

- [ ] **Step 13: 验证构建**

```bash
pnpm build
```

期望：编译通过

- [ ] **Step 14: 提交**

```bash
git add src/config/chartTheme.ts src/components/charts/
git commit -m "feat: 统一图表颜色/字号/高度，chartTheme.colors成为唯一来源"
```

---

### Task 5: 主题 index.tsx 权重分配（6 个）

所有改动模式相同：在 panels 数组中的每个对象添加 `height` 和 `collapsible` 字段。

- [ ] **Step 1: Overview** — 修改 `src/themes/overview/index.tsx` lines 15-23

```typescript
export const overviewPanels: { left: PanelConfig[]; right: PanelConfig[] } = {
  left: [
    { id: 'overview-faculty', title: '教职工全景态势', height: 'flex-3', collapsible: true, collapsedSummary: '教职工组成、学历、职称、学科分布' },
    { id: 'overview-student-info', title: '学生基础信息', height: 'flex-1' },
  ],
  right: [
    { id: 'overview-activity-stats', title: '活跃度时段统计', height: 'flex-1' },
    { id: 'overview-asset-overview', title: '资产概况', height: 'flex-1' },
    { id: 'overview-room-dist', title: '功能室分布', height: 'flex-1' },
  ],
}
```

- [ ] **Step 2: Teaching-Research** — 修改 `src/themes/teaching-research/index.tsx`

```typescript
left: [
  { id: 'tr-resources', title: '教学资源分类', height: 'flex-1' },
  { id: 'tr-resource-stats', title: '资源统计数据', height: 'flex-1' },
  { id: 'tr-resource-updates', title: '资源更新动态', height: 'flex-1' },
],
right: [
  { id: 'tr-teacher-topics', title: '教师课题统计', height: 'flex-1' },
  { id: 'tr-research-projects', title: '研究项目列表', height: 'flex-1' },
  { id: 'tr-teacher-studios', title: '名师工作室', height: 'flex-2' },
],
```

- [ ] **Step 3: Admin** — 修改 `src/themes/admin/index.tsx`

```typescript
left: [
  { id: 'admin-notice', title: '通知公告', height: 'flex-1' },
  { id: 'admin-duty', title: '值班安排', height: 'flex-1' },
  { id: 'admin-meeting', title: '会议管理', height: 'flex-2' },
],
right: [
  { id: 'admin-calendar', title: '校历日程', height: 'flex-2' },
  { id: 'admin-attendance', title: '教职工考勤', height: 'flex-3', collapsible: true, collapsedSummary: '出勤率、部门对比、30日趋势' },
],
```

- [ ] **Step 4: Library** — 修改 `src/themes/library/index.tsx`

```typescript
left: [
  { id: 'lib-borrow-stats', title: '借阅统计', height: 'flex-2' },
  { id: 'lib-borrow-rank', title: '借阅排行', height: 'flex-3', collapsible: true, collapsedSummary: '热门图书、班级排行、阅读之星' },
],
right: [
  { id: 'lib-reading-activities', title: '阅读活动', height: 'flex-1' },
  { id: 'lib-visitor-stats', title: '到馆统计', height: 'flex-2' },
],
```

- [ ] **Step 5: Academics** — 修改 `src/themes/academics/index.tsx`

```typescript
left: [
  { id: 'acad-schedule-space', title: '课表与空间调度', height: 'flex-3', collapsible: true, collapsedSummary: '教室使用率、课程分布、设备利用率' },
  { id: 'acad-devices', title: '教学设备', height: 'flex-2' },
],
right: [
  { id: 'acad-attendance', title: '学生出勤', height: 'flex-3', collapsible: true, collapsedSummary: '出勤率、年级对比、班级排名、30日趋势' },
  { id: 'acad-exams', title: '考试管理', height: 'flex-3', collapsible: true, collapsedSummary: '近期考试、各科均分、成绩分布' },
],
```

- [ ] **Step 6: Security** — 修改 `src/themes/security/index.tsx`

```typescript
left: [
  { id: 'sec-monitor-status', title: '监控设备状态', height: 'flex-2' },
  { id: 'sec-access-control', title: '门禁通行统计', height: 'flex-2' },
  { id: 'sec-student-leave', title: '学生请假管理', height: 'flex-3', collapsible: true, collapsedSummary: '今日请假、类型分布、各年级对比、请假记录' },
],
right: [
  { id: 'sec-visitor', title: '访客管理', height: 'flex-2' },
  { id: 'sec-alert-events', title: '告警事件', height: 'flex-2' },
  { id: 'sec-canteen', title: '明厨亮灶', height: 'flex-2' },
],
```

- [ ] **Step 7: 验证构建**

```bash
pnpm build
```

期望：编译通过

- [ ] **Step 8: 提交**

```bash
git add src/themes/overview/index.tsx src/themes/teaching-research/index.tsx src/themes/admin/index.tsx src/themes/library/index.tsx src/themes/academics/index.tsx src/themes/security/index.tsx
git commit -m "feat: 6主题面板权重分配 + collapsible 标记"
```

---

### Task 6: 面板内部字号修复 — Overview + Teaching-Research

**Files:**
- Modify: `src/themes/overview/panels/FacultyPanorama.tsx`
- Modify: `src/themes/overview/panels/StudentInfo.tsx`
- Modify: `src/themes/overview/panels/AssetOverview.tsx`
- Modify: `src/themes/teaching-research/panels/TeachingResourcesPanel.tsx`
- Modify: `src/themes/teaching-research/panels/ResourceStatistics.tsx`
- Modify: `src/themes/teaching-research/panels/ResourceUpdates.tsx`
- Modify: `src/themes/teaching-research/panels/TeacherStudiosPanel.tsx`

- [ ] **Step 1: FacultyPanorama — 字号修复**

- `line 36`: `fontSize: 10` → `fontSize: 'var(--font-size-xs)'`

- [ ] **Step 2: StudentInfo — 字号修复**

- `line 28`: `fontSize: 20` → `fontSize: 'var(--font-size-xl)'`
- `line 29`: `fontSize: 10` → `fontSize: 'var(--font-size-xs)'`
- `line 30`: `fontSize: 14` → `fontSize: 'var(--font-size-md)'`

同时调整图表高度：`line 40` `height={120}` 保持不变（已在 MIN_HEIGHT 之上）

- [ ] **Step 3: AssetOverview — 字号修复**

- `line 41`: `width: 32, height: 32` → `width: 30, height: 30`
- `line 54`: `fontSize: 20` → `fontSize: 'var(--font-size-xl)'`
- `line 57`: `fontSize: 12` → `fontSize: 'var(--font-size-sm)'`

- [ ] **Step 4: TeachingResourcesPanel — 字号修复**

- `line 31`: `fontSize: 18` → `fontSize: 'var(--font-size-lg)'`
- `line 32`: `fontSize: 9` → `fontSize: 'var(--font-size-2xs)'`
- `line 34`: `fontSize: 11` → `fontSize: 'var(--font-size-sm)'`

- [ ] **Step 5: ResourceStatistics — 字号修复**

- `line 30`: `fontSize: 22` → `fontSize: 'var(--font-size-xxl)'`
- `line 31`: `fontSize: 11` → `fontSize: 'var(--font-size-sm)'`

- [ ] **Step 6: ResourceUpdates — 字号修复**

- `line 17`: `maxWidth: 140` 保持不变
- `line 21`: `fontSize: 9` → `fontSize: 'var(--font-size-2xs)'`
- `line 22-23`: `fontSize: 10` → `fontSize: 'var(--font-size-xs)'`

- [ ] **Step 7: TeacherStudiosPanel — 字号修复 + overflow**

- `line 28`: `fontSize: 12` → `fontSize: 'var(--font-size-sm)'`
- `line 33`: `fontSize: 10` → `fontSize: 'var(--font-size-xs)'`
- `line 43`: `fontSize: 10` → `fontSize: 'var(--font-size-xs)'`
- `line 44-46`: `fontSize: 10` → `fontSize: 'var(--font-size-xs)'`

- [ ] **Step 8: 验证构建 + 提交**

```bash
pnpm build
git add src/themes/overview/panels/ src/themes/teaching-research/panels/
git commit -m "fix: Overview + TeachingResearch 面板字号→CSS变量"
```

---

### Task 7: 面板内部字号修复 — Admin + Library

**Files:**
- Modify: `src/themes/admin/panels/NoticeBoard.tsx`
- Modify: `src/themes/admin/panels/DutySchedule.tsx`
- Modify: `src/themes/admin/panels/MeetingManagement.tsx`
- Modify: `src/themes/admin/panels/SchoolCalendar.tsx`
- Modify: `src/themes/admin/panels/StaffAttendance.tsx`
- Modify: `src/themes/library/panels/BorrowStats.tsx`
- Modify: `src/themes/library/panels/BookBorrowRank.tsx`
- Modify: `src/themes/library/panels/ReadingActivities.tsx`
- Modify: `src/themes/library/panels/VisitorStats.tsx`

- [ ] **Step 1: NoticeBoard — 字号修复**

- Line 25: `fontSize: 12` → `fontSize: 'var(--font-size-sm)'`
- Lines 27, 29, 30: `fontSize: 9` → `fontSize: 'var(--font-size-2xs)'`

- [ ] **Step 2: DutySchedule — 字号修复**

- Line 34: `fontSize: 10` → `fontSize: 'var(--font-size-xs)'`
- Line 37: `fontSize: 14` → `fontSize: 'var(--font-size-md)'`
- Line 40: `fontSize: 10` → `fontSize: 'var(--font-size-xs)'`

- [ ] **Step 3: MeetingManagement — 字号修复**

- Lines 15, 19: `fontSize: 22` → `fontSize: 'var(--font-size-xxl)'`
- Lines 16, 20: `fontSize: 10` → `fontSize: 'var(--font-size-xs)'`
- Line 37: `fontSize: 10` → `fontSize: 'var(--font-size-xs)'`
- Line 38: `fontSize: 9` → `fontSize: 'var(--font-size-2xs)'`

- [ ] **Step 4: SchoolCalendar — 字号修复**

- Lines 23-24, 33, 44: `fontSize: 10` → `fontSize: 'var(--font-size-xs)'`
- Lines 25, 35, 45: `fontSize: 12` → `fontSize: 'var(--font-size-sm)'`

- [ ] **Step 5: StaffAttendance — 字号修复**

此面板使用 NumberFlip（已用 CSS 变量），主要关注图表高度：
- Line 22: `BarChart height={100}` → `height={120}`
- Line 32: `LineChart height={100}` → `height={120}`

- [ ] **Step 6: BorrowStats — 图表高度**

- Line 20: `LineChart height={140}` 保持不变（已在 120 之上）

- [ ] **Step 7: BookBorrowRank — 图表高度 + 字号**

- Line 27: `BarChart height={120}` 保持不变
- Line 31: `PieChart height={100}` → `height={120}`
- Line 37: `BarChart height={130}` 保持不变
- Line 54: `width: 16, height: 16` 保持不变
- Line 57: `fontSize: 9` → `fontSize: 'var(--font-size-2xs)'`
- Line 61: `fontSize: 10` → `fontSize: 'var(--font-size-xs)'`

- [ ] **Step 8: ReadingActivities — 字号修复**

- Line 31: `fontSize: 12` → `fontSize: 'var(--font-size-sm)'`
- Line 32: `fontSize: 10` → `fontSize: 'var(--font-size-xs)'`
- Line 35 (if exists): `fontSize: 10` → `fontSize: 'var(--font-size-xs)'`

- [ ] **Step 9: VisitorStats — 字号修复（如需要）**

- NumberFlip 已用 CSS 变量，BarChart 高度 160 已在 MIN_HEIGHT 之上

- [ ] **Step 10: 验证构建 + 提交**

```bash
pnpm build
git add src/themes/admin/panels/ src/themes/library/panels/
git commit -m "fix: Admin + Library 面板字号→CSS变量 + 图表高度调整"
```

---

### Task 8: 面板内部字号修复 — Academics + Security

**Files:**
- Modify: `src/themes/academics/panels/ScheduleSpace.tsx`
- Modify: `src/themes/academics/panels/TeachingDevices.tsx`
- Modify: `src/themes/academics/panels/StudentAttendance.tsx`
- Modify: `src/themes/academics/panels/ExamManagement.tsx`
- Modify: `src/themes/security/panels/MonitorStatus.tsx`
- Modify: `src/themes/security/panels/AccessControl.tsx`
- Modify: `src/themes/security/panels/StudentLeave.tsx`
- Modify: `src/themes/security/panels/VisitorManagement.tsx`
- Modify: `src/themes/security/panels/AlertEvents.tsx`
- Modify: `src/themes/security/panels/CanteenSafety.tsx`

- [ ] **Step 1: ScheduleSpace — 图表高度**

- Line 31: `BarChart height={80}` → `height={120}`
- Line 35: `PieChart height={90}` → `height={120}`
- Line 39: `GaugeChart height={80}` → `height={120}`

- [ ] **Step 2: TeachingDevices — 图表高度**

- Line 26: `RingChart height={120}` 保持不变
- Line 31: `PieChart height={120}` 保持不变

- [ ] **Step 3: StudentAttendance — 图表高度**

- Line 18: `GaugeChart height={90}` → `height={120}`
- Line 22: `BarChart height={80}` → `height={120}`
- Line 28: `BarChart height={90}` → `height={120}`
- Line 31: `LineChart height={80}` → `height={120}`

- [ ] **Step 4: ExamManagement — 图表高度 + 字号**

- Line 23: `fontSize: 11` → `fontSize: 'var(--font-size-sm)'`
- Line 32: `fontSize: 20` → `fontSize: 'var(--font-size-xl)'`
- Line 33: `fontSize: 9` → `fontSize: 'var(--font-size-2xs)'`
- Line 39: `BarChart height={70}` → `height={120}`
- Line 43: `FunnelChart height={180}` 保持不变

- [ ] **Step 5: MonitorStatus — 图表高度**

- Line 17: `RingChart height={100}` → `height={120}`
- Line 27: `GaugeChart height={100}` → `height={120}`
- Line 32: `BarChart height={80}` → `height={120}`

- [ ] **Step 6: AccessControl — 图表高度**

- Line 24: `BarChart height={110}` → `height={120}`

- [ ] **Step 7: StudentLeave — 图表高度 + 字号**

- Line 23: `PieChart height={200}` → `height={140}`
- Line 28: `BarChart height={100}` → `height={120}`
- Line 35: `fontSize: 10` → `fontSize: 'var(--font-size-xs)'`

- [ ] **Step 8: VisitorManagement — 字号**

- Line 25: 如果有 `fontSize: 10` → `fontSize: 'var(--font-size-xs)'`

- [ ] **Step 9: AlertEvents — 字号**

- Line 55: 如果有 `fontSize: 10` → `fontSize: 'var(--font-size-xs)'`

- [ ] **Step 10: CanteenSafety — 字号**

- Line 23: `fontSize: 28` → `fontSize: 'var(--font-size-3xl)'`
- Lines 24, 34, 49: `fontSize: 11` → `fontSize: 'var(--font-size-sm)'`
- Line 52: `fontSize: 9` → `fontSize: 'var(--font-size-2xs)'`
- Line 53: `fontSize: 10` → `fontSize: 'var(--font-size-xs)'`
- Line 43: `BarChart height={80}` → `height={120}`

- [ ] **Step 11: 验证构建 + 提交**

```bash
pnpm build
git add src/themes/academics/panels/ src/themes/security/panels/
git commit -m "fix: Academics + Security 面板字号→CSS变量 + 图表高度≥120px"
```

---

### Task 9: 最终验证

- [ ] **Step 1: 运行构建**

```bash
pnpm build
```

期望：编译通过，无类型错误

- [ ] **Step 2: 运行所有测试**

```bash
pnpm test
```

期望：37/37 单元测试通过（测试可能需要适配新增 props）

- [ ] **Step 3: 运行 E2E 测试**

```bash
npx playwright test
```

期望：8/8 测试通过

- [ ] **Step 4: 启动开发服务器目视验证**

```bash
pnpm dev
```

手动检查：
1. 各专题左右面板权重分配正确（flex-3 面板明显更大）
2. 折叠按钮出现且可点击（flex-3 面板标题栏右侧 ▼）
3. 面板内滚动条正常（内容超出时）
4. 切换深/浅主题，字号自动变化
5. 图表颜色随深浅主题切换
6. 3D 场景交互不受影响

- [ ] **Step 5: 提交**

```bash
git add -A
git commit -m "chore: final verification, all tests pass"
```

---

## 总结

| 阶段 | 任务数 | 预计时间 |
|------|--------|---------|
| Foundation (types + CSS + chartTheme) | 2 | 15 min |
| Layout (SidePanel + DashboardPanel + App) | 1 | 20 min |
| Charts (11 个组件) | 1 | 40 min |
| Theme Indices (6 文件) | 1 | 15 min |
| Panel Internals (28 文件, 3 批次) | 3 | 60 min |
| Verification | 1 | 15 min |
| **合计** | **9** | **~3 小时** |
