# More Chart Types Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add 4 ECharts chart wrapper components (Sankey, Sunburst, Funnel, Radar) following the existing pattern in `src/components/charts/`.

**Architecture:** Each chart is a standalone React component using `echarts-for-react`. Each accepts typed props, builds an ECharts option object with dark theme styling, and renders via `<ReactECharts>`. No registry or barrel index — panels import charts directly by path.

**Tech Stack:** React 18, TypeScript, ECharts 5, echarts-for-react

---

### Task 1: SankeyChart

**Files:**
- Create: `src/components/charts/SankeyChart.tsx`

- [ ] **Step 1: Create SankeyChart component**

Write `src/components/charts/SankeyChart.tsx`:

```tsx
import ReactECharts from 'echarts-for-react'
import type { EChartsOption } from 'echarts'

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

export default function SankeyChart({ data, categories, height = 240, title }: SankeyChartProps) {
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
        label: { color: 'rgba(255,255,255,0.7)', fontSize: 11 },
        data: categories.map((name) => ({ name })),
        links: data,
      },
    ],
  }

  if (title) {
    option.title = {
      text: title,
      textStyle: { color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 'normal' },
      left: 'center',
      top: -5,
    }
  }

  return <ReactECharts option={option} style={{ height, width: '100%' }} notMerge />
}
```

- [ ] **Step 2: Verify build**

Run: `pnpm build`
Expected: Build succeeds with no errors

- [ ] **Step 3: Commit**

```bash
git add src/components/charts/SankeyChart.tsx
git commit -m "feat(charts): add SankeyChart component"
```

---

### Task 2: SunburstChart

**Files:**
- Create: `src/components/charts/SunburstChart.tsx`

- [ ] **Step 1: Create SunburstChart component**

Write `src/components/charts/SunburstChart.tsx`:

```tsx
import ReactECharts from 'echarts-for-react'
import type { EChartsOption } from 'echarts'

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

export default function SunburstChart({ data, height = 260, title }: SunburstChartProps) {
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
          color: '#fff',
          fontSize: 11,
        },
        itemStyle: {
          borderRadius: 4,
          borderColor: '#0a1628',
          borderWidth: 2,
        },
        levels: [
          {},
          {
            color: ['#4a9eff', '#00c853', '#ff6d00', '#aa00ff', '#ffd600', '#00bcd4'],
            colorMappingBy: 'value',
          },
          {
            colorMappingBy: 'value',
            saturation: 0.6,
          },
        ],
      },
    ],
  }

  if (title) {
    option.title = {
      text: title,
      textStyle: { color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 'normal' },
      left: 'center',
      top: -5,
    }
  }

  return <ReactECharts option={option} style={{ height, width: '100%' }} notMerge />
}
```

- [ ] **Step 2: Verify build**

Run: `pnpm build`
Expected: Build succeeds with no errors

- [ ] **Step 3: Commit**

```bash
git add src/components/charts/SunburstChart.tsx
git commit -m "feat(charts): add SunburstChart component"
```

---

### Task 3: FunnelChart

**Files:**
- Create: `src/components/charts/FunnelChart.tsx`

- [ ] **Step 1: Create FunnelChart component**

Write `src/components/charts/FunnelChart.tsx`:

```tsx
import ReactECharts from 'echarts-for-react'
import type { EChartsOption } from 'echarts'

interface FunnelChartProps {
  data: { name: string; value: number }[]
  height?: number
  title?: string
  color?: string[]
}

const DEFAULT_COLORS = ['#4a9eff', '#00c853', '#ffd600', '#ff6d00', '#aa00ff']

export default function FunnelChart({ data, height = 260, title, color = DEFAULT_COLORS }: FunnelChartProps) {
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
        gap: 4,
        label: {
          show: true,
          position: 'inside',
          color: '#fff',
          fontSize: 12,
          formatter: '{b}: {c}',
        },
        labelLine: { show: false },
        itemStyle: { borderColor: '#0a1628', borderWidth: 2 },
        emphasis: {
          label: { fontSize: 14, fontWeight: 'bold' },
        },
        data: data.map((d, i) => ({ ...d, itemStyle: { color: color[i % color.length] } })),
      },
    ],
  }

  if (title) {
    option.title = {
      text: title,
      textStyle: { color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 'normal' },
      left: 'center',
      top: -5,
    }
  }

  return <ReactECharts option={option} style={{ height, width: '100%' }} notMerge />
}
```

- [ ] **Step 2: Verify build**

Run: `pnpm build`
Expected: Build succeeds with no errors

- [ ] **Step 3: Commit**

```bash
git add src/components/charts/FunnelChart.tsx
git commit -m "feat(charts): add FunnelChart component"
```

---

### Task 4: RadarChart

**Files:**
- Create: `src/components/charts/RadarChart.tsx`

- [ ] **Step 1: Create RadarChart component**

Write `src/components/charts/RadarChart.tsx`:

```tsx
import ReactECharts from 'echarts-for-react'
import type { EChartsOption } from 'echarts'

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

const SERIES_COLORS = ['#4a9eff', '#00c853', '#ff6d00', '#aa00ff', '#ffd600']

export default function RadarChart({ indicator, series, height = 260, title }: RadarChartProps) {
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
        color: 'rgba(255,255,255,0.6)',
        fontSize: 11,
      },
      splitArea: {
        areaStyle: {
          color: ['rgba(74,158,255,0.02)', 'rgba(74,158,255,0.05)', 'rgba(74,158,255,0.02)', 'rgba(74,158,255,0.05)'],
        },
      },
      splitLine: {
        lineStyle: { color: 'rgba(74,158,255,0.15)' },
      },
      axisLine: {
        lineStyle: { color: 'rgba(74,158,255,0.15)' },
      },
    },
    series: [
      {
        type: 'radar',
        data: series.map((s, i) => ({
          value: s.value,
          name: s.name,
          areaStyle: { color: s.color || SERIES_COLORS[i % SERIES_COLORS.length], opacity: 0.15 },
          lineStyle: { color: s.color || SERIES_COLORS[i % SERIES_COLORS.length], width: 2 },
          itemStyle: { color: s.color || SERIES_COLORS[i % SERIES_COLORS.length] },
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
      textStyle: { color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 'normal' },
      left: 'center',
      top: -5,
    }
  }

  return <ReactECharts option={option} style={{ height, width: '100%' }} notMerge />
}
```

- [ ] **Step 2: Verify build**

Run: `pnpm build`
Expected: Build succeeds with no errors

- [ ] **Step 3: Commit**

```bash
git add src/components/charts/RadarChart.tsx
git commit -m "feat(charts): add RadarChart component"
```

---

### Task 5: Verify all tests pass

- [ ] **Step 1: Run full test suite**

Run: `pnpm test --run`
Expected: All 35 tests pass

- [ ] **Step 2: Run final build**

Run: `pnpm build`
Expected: Build succeeds with no errors

- [ ] **Step 3: Commit any remaining changes**

```bash
git add -A
git commit -m "chore: verify all tests and build after chart additions"
```
