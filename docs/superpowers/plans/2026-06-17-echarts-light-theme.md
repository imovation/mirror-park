# ECharts Light Theme Implementation Plan

**Goal:** Make chart components respond to UI theme (dark/light) by replacing hardcoded colors with tokens from `useChartTheme()`.

---

### Task 1: Create chartTheme.ts + update all 11 chart components

**Files:**
- Create: `src/config/chartTheme.ts`
- Modify: all 11 chart component files in `src/components/charts/`

- [ ] **Step 1: Create chartTheme.ts**

Write `src/config/chartTheme.ts`:

```ts
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
}

const DARK: ChartTheme = {
  axisLabel: 'rgba(255,255,255,0.4)',
  axisLine: 'rgba(74,158,255,0.15)',
  splitLine: 'rgba(74,158,255,0.08)',
  label: 'rgba(255,255,255,0.6)',
  title: 'rgba(255,255,255,0.5)',
  legendText: 'rgba(255,255,255,0.5)',
  borderColor: '#0a1628',
  gaugeAxis: '#fff',
  shadowColor: 'rgba(0,0,0,0.5)',
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
}

const THEMES: Record<UITheme, ChartTheme> = { dark: DARK, light: LIGHT }

export function useChartTheme(): ChartTheme {
  const uiTheme = useUIThemeStore((s) => s.uiTheme)
  return THEMES[uiTheme]
}
```

- [ ] **Step 2: Update BarChart**

Read `src/components/charts/BarChart.tsx`. Replace:
- `axisLabel: { color: 'rgba(255,255,255,0.5)' }` → `axisLabel: { color: t.axisLabel }`
- `splitLine: { lineStyle: { color: 'rgba(74,158,255,0.08)' } }` → `splitLine: { lineStyle: { color: t.splitLine } }`

Add at top of function:
```ts
const t = useChartTheme()
```

- [ ] **Step 3: Update LineChart**

Read `src/components/charts/LineChart.tsx`. Replace:
- `textStyle: { color: 'rgba(255,255,255,0.5)' }` → `textStyle: { color: t.legendText }`
- `axisLabel: { color: 'rgba(255,255,255,0.4)' }` → `axisLabel: { color: t.axisLabel }`
- `axisLine: { lineStyle: { color: 'rgba(74,158,255,0.15)' } }` → `axisLine: { lineStyle: { color: t.axisLine } }`
- `splitLine: { lineStyle: { color: 'rgba(74,158,255,0.08)' } }` → `splitLine: { lineStyle: { color: t.splitLine } }`

Add `const t = useChartTheme()` at top.

- [ ] **Step 4: Update PieChart + RingChart**

Read `src/components/charts/PieChart.tsx`:
- `label: { color: 'rgba(255,255,255,0.6)' }` → `label: { color: t.label }`
- `shadowColor: 'rgba(0,0,0,0.5)'` → `shadowColor: t.shadowColor`

Read `src/components/charts/RingChart.tsx` (same label pattern).

- [ ] **Step 5: Update GaugeChart**

Read `src/components/charts/GaugeChart.tsx`:
- `axisLabel: { color: 'rgba(255,255,255,0.4)' }` → `axisLabel: { color: t.axisLabel }`
- `title: { color: 'rgba(255,255,255,0.5)' }` → `title: { color: t.title }`
- `axisTick: { lineStyle: { color: '#fff' } }` → `axisTick: { lineStyle: { color: t.gaugeAxis } }`
- `splitLine: { lineStyle: { color: '#fff' } }` → `splitLine: { lineStyle: { color: t.gaugeAxis } }`
- `detail: { color: '#4a9eff' }` stays (accent color is same in both modes)

- [ ] **Step 6: Update TreemapChart**

Read `src/components/charts/TreemapChart.tsx`:
- `borderColor: '#0a1628'` (2 occurrences) → `borderColor: t.borderColor`
- `title: { textStyle: { color: 'rgba(255,255,255,0.5)' } }` → `title: { textStyle: { color: t.title } }`

- [ ] **Step 7: Update SunburstChart**

Read `src/components/charts/SunburstChart.tsx`:
- `borderColor: '#0a1628'` → `borderColor: t.borderColor`
- `label: { color: '#fff' }` → `label: { color: t.label }`

- [ ] **Step 8: Update FunnelChart**

Read `src/components/charts/FunnelChart.tsx`:
- `borderColor: '#0a1628'` → `borderColor: t.borderColor`
- `label: { color: '#fff' }` → `label: { color: t.label }`

- [ ] **Step 9: Update RadarChart**

Read `src/components/charts/RadarChart.tsx`:
- `axisName: { color: 'rgba(255,255,255,0.6)' }` → `axisName: { color: t.label }`
- `splitArea: { areaStyle: { color: ['rgba(74,158,255,0.02)', 'rgba(74,158,255,0.05)', ...] } }` → these can stay or be adjusted (subtle pattern, less critical)
- `splitLine: { lineStyle: { color: 'rgba(74,158,255,0.15)' } }` → `splitLine: { lineStyle: { color: t.axisLine } }`
- `axisLine: { lineStyle: { color: 'rgba(74,158,255,0.15)' } }` → `axisLine: { lineStyle: { color: t.axisLine } }`

- [ ] **Step 10: Update SankeyChart**

Read `src/components/charts/SankeyChart.tsx`:
- `label: { color: 'rgba(255,255,255,0.7)' }` → `label: { color: t.label }`

- [ ] **Step 11: Update HeatmapChart**

Read `src/components/charts/HeatmapChart.tsx`:
- `axisLabel: { color: 'rgba(255,255,255,0.3)' }` → `axisLabel: { color: t.axisLabel }`
- Keep `inRange` gradient as-is (data-driven, not structural)

- [ ] **Step 12: Verify build and tests**

Run:
```bash
pnpm build
pnpm test --run
```

- [ ] **Step 13: Commit**

```bash
git add src/config/chartTheme.ts src/components/charts/
git commit -m "feat(theme): add chart theme hook for ECharts light mode support"
```
