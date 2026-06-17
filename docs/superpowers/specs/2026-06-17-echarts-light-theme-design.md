# ECharts Light Theme — Design Doc

## Problem

UI theme switching (dark ↔ light) uses CSS variables for layout components, but ECharts charts still use hardcoded dark-mode colors (e.g., `rgba(255,255,255,0.5)` labels, `#0a1628` borders). In light mode, chart text becomes invisible and borders clash.

## Solution

Create a `useChartTheme()` hook that returns color tokens based on `useUIThemeStore`. Each chart component calls the hook and spreads the tokens into its `EChartsOption`.

## Token Set

```ts
interface ChartTheme {
  axisLabel: string     // axis text
  axisLine: string      // axis line
  splitLine: string     // grid lines
  label: string         // data labels (pie, radar)
  title: string         // chart title
  legendText: string    // legend
  borderColor: string   // item borders (treemap/sunburst/funnel)
  gaugeAxis: string     // gauge ticks & split lines
  shadowColor: string   // emphasis shadow
}
```

Dark mode uses current values (white-on-dark). Light mode flips to dark-on-light.

## Files

| File | Change |
|------|--------|
| `src/config/chartTheme.ts` | Create — token definitions for dark/light |
| `src/components/charts/BarChart.tsx` | Use `useChartTheme()` |
| `src/components/charts/LineChart.tsx` | Same |
| `src/components/charts/PieChart.tsx` | Same |
| `src/components/charts/RingChart.tsx` | Same |
| `src/components/charts/GaugeChart.tsx` | Same |
| `src/components/charts/TreemapChart.tsx` | Same (borderColor + title) |
| `src/components/charts/SunburstChart.tsx` | Same (borderColor + label) |
| `src/components/charts/FunnelChart.tsx` | Same (borderColor + label) |
| `src/components/charts/RadarChart.tsx` | Same (axis + split) |
| `src/components/charts/SankeyChart.tsx` | Same (label + lineStyle) |
| `src/components/charts/HeatmapChart.tsx` | Same (axis labels) |

## Non-Goals

- Data series color palettes stay unchanged (they work in both modes)
- Chart `backgroundColor` not set (inherits from parent panel)
- Heatmap `inRange` gradient stays (it's data-driven, not structural)
