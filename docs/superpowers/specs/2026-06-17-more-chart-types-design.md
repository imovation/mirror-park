# More Chart Types — Design Doc

## Overview

Add 4 new ECharts chart wrapper components to `src/components/charts/`, following the existing pattern (independent file, typed props, `ReactECharts`, dark theme, no registry).

## Components

| File | Series Type | Data Interface | Use Cases |
|------|-------------|----------------|-----------|
| `SankeyChart.tsx` | `sankey` | `{ source: string; target: string; value: number }[]` | Student flow, budget allocation |
| `SunburstChart.tsx` | `sunburst` | `{ name: string; value: number; children?: Node[] }[]` | Subject hierarchy breakdown |
| `FunnelChart.tsx` | `funnel` | `{ name: string; value: number }[]` | Enrollment funnel, approval pipeline |
| `RadarChart.tsx` | `radar` | `{ indicator: { name, max }[]; series: { name, value[] }[] }` | Multi-dim student evaluation, class comparison |

## Design Decisions

1. **Standalone files** (not a unified component) — matches existing pattern, keeps diffs small, easy to review
2. **Dark theme colors** — background `rgba(10,22,40,1)`, accent `#4a9eff`, secondary `#00c853`/`#ff6d00`/`#aa00ff`
3. **No barrel/index** — panels import directly, same as current practice
4. **Zero new dependencies** — all series types are built into ECharts 5

## Files

```
src/components/charts/
├── SankeyChart.tsx   (new, ~40 lines)
├── SunburstChart.tsx (new, ~45 lines)
├── FunnelChart.tsx   (new, ~30 lines)
├── RadarChart.tsx    (new, ~50 lines)
```

## Verification

- `pnpm build` succeeds
- All existing 35 tests still pass
- No TypeScript errors
- No visual regression (existing panels unchanged)
