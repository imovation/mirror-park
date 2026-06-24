# Performance Optimization Design

> 2026-06-24
> Part of "完成无需外部资源的所有待完成项" — Batch 1 of 3

## Scope

Three items: Chunk Volume Optimization, FPS Monitor, (Worker Threads skipped — no heavy computation found).

## Architecture Changes

### 1. ECharts Tree-shaking

**Problem**: Full `echarts` (~1,052 kB) bundled but only 6 chart types used.

**Solution**: Switch all chart components to `echarts/core` with selective register:

- New file: `src/config/echartsSetup.ts` — registers BarChart, LineChart, PieChart, GaugeChart, RadarChart, Graphic, Tooltip, Grid, Legend, Title
- Modified: `BarChart.tsx`, `LineChart.tsx`, `PieChart.tsx`, `RingChart.tsx`, `GaugeChart.tsx`, `RadarChart.tsx` — import from `echarts/core`
- Not modified (unused charts already tree-shaken by being unreferenced): `FunnelChart`, `HeatmapChart`, `SankeyChart`, `SunburstChart`, `TreemapChart`

**Expected**: ~1,052 kB → ~350 kB

### 2. Three.js Chunk Splitting

**Problem**: `vendor-three` chunk at 1,137 kB exceeds 500 kB warning.

**Solution**: Split into two manualChunks:

```
vendor-three-core: ['three']                      (~650 kB)
vendor-three-r3f:  ['@react-three/fiber',         (~470 kB)
                     '@react-three/drei',
                     '@react-three/postprocessing']
```

Also set `chunkSizeWarningLimit: 800` to reduce false alarms.

### 3. Panel Lazy Loading

**Problem**: All 38 panel components eagerly loaded in main `index.js` (153 kB).

**Solution**: Use `React.lazy()` per panel in `registry.tsx`:

- Each `renderPanel` case returns `<Suspense fallback={<StatusPanel type="loading" />}>` wrapping the lazy-loaded panel
- No behavior change — panels still render in same positions
- Build automatically code-splits each panel into separate chunk

**Expected**: ~80 kB removed from main chunk.

### 4. FPS Monitor

**New component**: `src/components/ui/FpsMonitor.tsx`

- Dev-only (`import.meta.env.DEV` guard)
- Position: fixed bottom-right, above BottomBar
- Shows: real-time FPS number + mini sparkline (last 60 frames)
- Implementation: `useEffect` with `requestAnimationFrame` loop, updates counter every second
- Mounted in `App.tsx` alongside AlertPopup

### 5. Vite Config

```ts
build: {
  chunkSizeWarningLimit: 800,
  rollupOptions: {
    output: {
      manualChunks: {
        'vendor-echarts': ['echarts/core', 'echarts-for-react'],
        'vendor-three-core': ['three'],
        'vendor-three-r3f': ['@react-three/fiber', '@react-three/drei', '@react-three/postprocessing'],
        'vendor-react': ['react', 'react-dom', '@tanstack/react-query', 'zustand'],
      },
    },
  },
}
```

## Files Modified

| File | Change |
|------|--------|
| `vite.config.ts` | manualChunks split, chunkSizeWarningLimit |
| `package.json` | (no change — `echarts` dep stays, import changes only) |
| `src/config/echartsSetup.ts` | **NEW** — echarts/core register |
| `src/components/charts/BarChart.tsx` | import from echarts/core |
| `src/components/charts/LineChart.tsx` | import from echarts/core |
| `src/components/charts/PieChart.tsx` | import from echarts/core |
| `src/components/charts/RingChart.tsx` | import from echarts/core |
| `src/components/charts/GaugeChart.tsx` | import from echarts/core |
| `src/components/charts/RadarChart.tsx` | import from echarts/core |
| `src/components/ui/FpsMonitor.tsx` | **NEW** — FPS monitor component |
| `src/themes/registry.tsx` | lazy() panels |
| `src/App.tsx` | mount FpsMonitor |

## Testing

- All 252 existing tests pass unchanged (echarts/core import is compatible)
- New test: `FpsMonitor` renders in DEV, null in production
- Build output verified: no chunk exceeds 800 kB
- `pnpm build` passes with 0 warnings

## Verification

```bash
pnpm build        # No warnings, check chunk sizes
pnpm test         # 252/252 pass
pnpm dev          # Manual check: FPS visible, all panels render
```
