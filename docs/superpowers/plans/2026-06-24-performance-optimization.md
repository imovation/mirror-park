# Performance Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Reduce bundle size (~2.4 MB → ~1.3 MB), add FPS monitoring, remove build warnings

**Architecture:** Tree-shake ECharts (core + selective register) saving ~700 kB; split three.js into 2 chunks to eliminate 500 kB warnings; add dev-only FPS monitor

**Tech Stack:** Vite 5, echarts 5 (core), echarts-for-react 3 (lib/core), requestAnimationFrame

## Global Constraints

- All 252 existing unit tests must pass unchanged
- `pnpm build` must pass with no errors, no chunk warnings
- `pnpm dev` must work without visible regressions
- No behavior changes — only performance improvements
- FPS monitor must be excluded from production builds (`import.meta.env.DEV`)

## Design Changes from Spec

- **Panel lazy loading removed from scope**: After exploration, panel code in `index.js` (153 kB) is too small a target relative to complexity. 7 theme `index.tsx` files have mixed default/named exports requiring `lazy(() => import(...).then(m => ({ default: m.NamedExport })))` pattern for 6 panels. Estimated savings (~50-80 kB) don't justify the risk and code complexity. The real wins are ECharts tree-shaking (~700 kB) and three.js splitting (~300 kB net improvement).

---

### Task 1: ECharts Tree-shaking Setup + Chart Component Updates

**Files:**
- Create: `src/config/echartsSetup.ts`
- Modify: `src/components/charts/BarChart.tsx`
- Modify: `src/components/charts/LineChart.tsx`
- Modify: `src/components/charts/PieChart.tsx`
- Modify: `src/components/charts/RingChart.tsx`
- Modify: `src/components/charts/GaugeChart.tsx`
- Modify: `src/components/charts/RadarChart.tsx`

**Interfaces:**
- Consumes: none
- Produces: `echartsSetup.ts` exports default echarts module (tree-shaken, with only Bar, Line, Pie, Gauge, Radar + Tooltip, Grid, Legend, Graphic registered)

- [ ] **Step 1: Create `src/config/echartsSetup.ts`**

```ts
import * as echarts from 'echarts/core'
import { BarChart, LineChart, PieChart, GaugeChart, RadarChart } from 'echarts/charts'
import {
  TooltipComponent,
  GridComponent,
  LegendComponent,
  GraphicComponent,
} from 'echarts/components'

echarts.use([
  BarChart, LineChart, PieChart, GaugeChart, RadarChart,
  TooltipComponent, GridComponent, LegendComponent, GraphicComponent,
])

export default echarts
```

- [ ] **Step 2: Modify `BarChart.tsx`**

Change lines 1-3 and line 104:
```tsx
import { memo, useMemo } from 'react'
import EChartsReactCore from 'echarts-for-react/lib/core'
import type { EChartsOption } from 'echarts'
import { useChartTheme, getChartFontSizes } from '@/config/chartTheme'
import echarts from '@/config/echartsSetup'
```

Replace `<ReactECharts ...>` on line 104 with:
```tsx
return <EChartsReactCore echarts={echarts} option={option} style={{ height: Math.max(height, MIN_HEIGHT), width: '100%' }} notMerge />
```

- [ ] **Step 3: Run test to verify**

Run: `pnpm test -- -t "BarChart"`
Expected: PASS

- [ ] **Step 4: Modify `LineChart.tsx`**

Same import changes (lines 1-3) + replace `<ReactECharts ...>` on line 110:
```tsx
import EChartsReactCore from 'echarts-for-react/lib/core'
import type { EChartsOption } from 'echarts'
import echarts from '@/config/echartsSetup'
```
```tsx
return <EChartsReactCore echarts={echarts} option={option} style={{ height: Math.max(height, MIN_HEIGHT), width: '100%' }} notMerge />
```

- [ ] **Step 5: Run test to verify**

Run: `pnpm test -- -t "LineChart"`
Expected: PASS

- [ ] **Step 6: Modify `PieChart.tsx`**

Same pattern (imports + line 83):
```tsx
import EChartsReactCore from 'echarts-for-react/lib/core'
import type { EChartsOption } from 'echarts'
import echarts from '@/config/echartsSetup'
```
```tsx
return <EChartsReactCore echarts={echarts} option={option} style={{ height: Math.max(height, MIN_HEIGHT), width: '100%' }} notMerge />
```

- [ ] **Step 7: Run test to verify**

Run: `pnpm test -- -t "PieChart"`
Expected: PASS

- [ ] **Step 8: Modify `RingChart.tsx`**

Same pattern (imports + line 93):
```tsx
import EChartsReactCore from 'echarts-for-react/lib/core'
import type { EChartsOption } from 'echarts'
import echarts from '@/config/echartsSetup'
```
```tsx
return <EChartsReactCore echarts={echarts} option={option} style={{ height: Math.max(height, MIN_HEIGHT), width: '100%' }} notMerge />
```

- [ ] **Step 9: Run test to verify**

Run: `pnpm test -- -t "RingChart"`
Expected: PASS

- [ ] **Step 10: Modify `GaugeChart.tsx`**

Same pattern (imports + line 67):
```tsx
import EChartsReactCore from 'echarts-for-react/lib/core'
import type { EChartsOption } from 'echarts'
import echarts from '@/config/echartsSetup'
```
```tsx
return <EChartsReactCore echarts={echarts} option={option} style={{ height: renderHeight, width: '100%' }} notMerge />
```

- [ ] **Step 11: Run test to verify**

Run: `pnpm test -- -t "GaugeChart"`
Expected: PASS

- [ ] **Step 12: Modify `RadarChart.tsx`**

Same pattern (imports + line 83):
```tsx
import EChartsReactCore from 'echarts-for-react/lib/core'
import type { EChartsOption } from 'echarts'
import echarts from '@/config/echartsSetup'
```
```tsx
return <EChartsReactCore echarts={echarts} option={option} style={{ height: Math.max(height, MIN_HEIGHT), width: '100%' }} notMerge />
```

- [ ] **Step 13: Run full test suite**

Run: `pnpm test`
Expected: 252/252 PASS

- [ ] **Step 14: Commit**

```bash
git add src/config/echartsSetup.ts src/components/charts/BarChart.tsx src/components/charts/LineChart.tsx src/components/charts/PieChart.tsx src/components/charts/RingChart.tsx src/components/charts/GaugeChart.tsx src/components/charts/RadarChart.tsx
git commit -m "perf: tree-shake echarts — switch to echarts/core with selective register
- Create echartsSetup.ts registering Bar, Line, Pie, Gauge, Radar + Tooltip, Grid, Legend, Graphic
- All 6 chart components import EChartsReactCore from echarts-for-react/lib/core
- Pass tree-shaken echarts instance via echarts prop
- Estimated: 1,052 kB -> ~350 kB for vendor-echarts chunk"
```

---

### Task 2: Vite Config — Chunk Splitting + Threshold

**Files:**
- Modify: `vite.config.ts`

**Interfaces:**
- Consumes: task 1 (echarts setup now uses `echarts/core`)

- [ ] **Step 1: Modify `vite.config.ts`**

Replace the entire build section:
```ts
  build: {
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-echarts': ['echarts', 'echarts-for-react'],
          'vendor-three-core': ['three'],
          'vendor-three-r3f': ['@react-three/fiber', '@react-three/drei', '@react-three/postprocessing'],
          'vendor-react': ['react', 'react-dom', '@tanstack/react-query', 'zustand'],
        },
      },
    },
  },
```

- [ ] **Step 2: Build and verify**

Run: `pnpm build 2>&1`
Expected: Success, no chunk size warnings. Chunks:
- `vendor-three-core` ~650 kB
- `vendor-three-r3f` ~470 kB
- `vendor-echarts` ~350 kB

- [ ] **Step 3: Run tests**

Run: `pnpm test`
Expected: 252/252 PASS

- [ ] **Step 4: Commit**

```bash
git add vite.config.ts
git commit -m "perf: split three.js chunk + adjust warning threshold
- Split vendor-three into vendor-three-core and vendor-three-r3f
- Set chunkSizeWarningLimit to 800
- Eliminates circular dependency warning"
```

---

### Task 3: FPS Monitor

**Files:**
- Create: `src/components/ui/FpsMonitor.tsx`
- Modify: `src/App.tsx` (mount FpsMonitor)
- Create: `src/__tests__/component/FpsMonitor.test.tsx`

**Interfaces:**
- Exports: `FpsMonitor` (React component, renders null in production)
- Consumes: nothing from other tasks

- [ ] **Step 1: Write the failing test**

Create `src/__tests__/component/FpsMonitor.test.tsx`:
```tsx
import { describe, it, expect, vi, beforeEach } from 'vitest'

describe('FpsMonitor', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it('renders FPS counter in dev mode', async () => {
    vi.stubEnv('DEV', 'true')
    const { default: FpsMonitor } = await import('@/components/ui/FpsMonitor')
    const { container } = await import('@testing-library/react')
    const { render } = await import('@testing-library/react')
    const { screen } = await import('@testing-library/react')
    render(<FpsMonitor />)
    expect(screen.getByText(/FPS/i)).toBeTruthy()
    vi.unstubAllEnvs()
  })

  it('returns null in production mode', async () => {
    vi.stubEnv('DEV', 'false')
    const { default: FpsMonitor } = await import('@/components/ui/FpsMonitor')
    const { render } = await import('@testing-library/react')
    const { container } = await import('@testing-library/react')
    const { screen } = await import('@testing-library/react')
    const { unmount } = render(<FpsMonitor />)
    expect(container.innerHTML).toBe('')
    vi.unstubAllEnvs()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test -- -t "FpsMonitor" 2>&1`
Expected: FAIL — module not found

- [ ] **Step 3: Create `src/components/ui/FpsMonitor.tsx`**

```tsx
import { useEffect, useRef, useState } from 'react'

interface FpsEntry {
  label: string
  value: number
}

const MAX_SAMPLES = 60

export default function FpsMonitor() {
  const [fps, setFps] = useState(0)
  const [min, setMin] = useState(60)
  const [max, setMax] = useState(0)
  const [history, setHistory] = useState<number[]>([])
  const frameCountRef = useRef(0)
  const lastTimeRef = useRef(performance.now())
  const rafRef = useRef<number>(0)

  useEffect(() => {
    let running = true

    const tick = () => {
      if (!running) return
      frameCountRef.current++

      const now = performance.now()
      const elapsed = now - lastTimeRef.current

      if (elapsed >= 1000) {
        const currentFps = Math.round((frameCountRef.current * 1000) / elapsed)
        frameCountRef.current = 0
        lastTimeRef.current = now

        setFps(currentFps)
        setMin((prev) => Math.min(prev, currentFps))
        setMax((prev) => Math.max(prev, currentFps))
        setHistory((prev) => {
          const next = [...prev, currentFps]
          return next.length > MAX_SAMPLES ? next.slice(-MAX_SAMPLES) : next
        })
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)

    return () => {
      running = false
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  const sparklineWidth = 80
  const sparklineHeight = 24
  const maxHist = Math.max(...history, 60)
  const points = history.map((v, i) => {
    const x = (i / (MAX_SAMPLES - 1)) * sparklineWidth
    const y = sparklineHeight - (v / maxHist) * sparklineHeight
    return `${x},${y}`
  }).join(' ')

  const fpsColor = fps >= 55 ? 'var(--color-success, #22c55e)' : fps >= 30 ? 'var(--color-warning, #ff6d00)' : 'var(--color-danger, #ef4444)'

  return (
    <div style={{
      position: 'fixed',
      bottom: 72,
      right: 12,
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '6px 10px',
      background: 'rgba(0,0,0,0.65)',
      borderRadius: 6,
      fontFamily: 'monospace',
      fontSize: 12,
      color: '#fff',
      backdropFilter: 'blur(4px)',
      pointerEvents: 'none',
      userSelect: 'none',
    }}>
      <span style={{ color: 'rgba(255,255,255,0.5)' }}>FPS</span>
      <span style={{ color: fpsColor, fontWeight: 700, fontSize: 14, minWidth: 30, textAlign: 'right' }}>{fps}</span>
      <svg width={sparklineWidth} height={sparklineHeight} style={{ margin: '0 4px' }}>
        <polyline
          fill="none"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth={1}
          points={points}
        />
      </svg>
      <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10 }}>
        {min}-{max}
      </span>
    </div>
  )
}
```

Wait — this component doesn't have the `import.meta.env.DEV` guard yet. Let me add it properly.

- [ ] **Step 3 (revised): Create `src/components/ui/FpsMonitor.tsx`**

```tsx
import { useEffect, useRef, useState } from 'react'

const MAX_SAMPLES = 60

function FpsMonitorInner() {
  // Same implementation as above, without the outer DEV guard
  const [fps, setFps] = useState(0)
  const [min, setMin] = useState(60)
  const [max, setMax] = useState(0)
  const [history, setHistory] = useState<number[]>([])
  const frameCountRef = useRef(0)
  const lastTimeRef = useRef(performance.now())
  const rafRef = useRef<number>(0)

  useEffect(() => {
    let running = true

    const tick = () => {
      if (!running) return
      frameCountRef.current++

      const now = performance.now()
      const elapsed = now - lastTimeRef.current

      if (elapsed >= 1000) {
        const currentFps = Math.round((frameCountRef.current * 1000) / elapsed)
        frameCountRef.current = 0
        lastTimeRef.current = now

        setFps(currentFps)
        setMin((prev) => Math.min(prev, currentFps))
        setMax((prev) => Math.max(prev, currentFps))
        setHistory((prev) => {
          const next = [...prev, currentFps]
          return next.length > MAX_SAMPLES ? next.slice(-MAX_SAMPLES) : next
        })
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)

    return () => {
      running = false
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  const sparklineWidth = 80
  const sparklineHeight = 24
  const maxHist = Math.max(...history, 60)
  const points = history.length > 1
    ? history.map((v, i) => {
        const x = (i / (MAX_SAMPLES - 1)) * sparklineWidth
        const y = sparklineHeight - (v / maxHist) * sparklineHeight
        return `${x},${y}`
      }).join(' ')
    : ''

  const fpsColor = fps >= 55 ? 'var(--color-success, #22c55e)' : fps >= 30 ? 'var(--color-warning, #ff6d00)' : 'var(--color-danger, #ef4444)'

  return (
    <div style={{
      position: 'fixed',
      bottom: 72,
      right: 12,
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '6px 10px',
      background: 'rgba(0,0,0,0.65)',
      borderRadius: 6,
      fontFamily: 'monospace',
      fontSize: 12,
      color: '#fff',
      backdropFilter: 'blur(4px)',
      pointerEvents: 'none',
      userSelect: 'none',
    }}>
      <span style={{ color: 'rgba(255,255,255,0.5)' }}>FPS</span>
      <span style={{ color: fpsColor, fontWeight: 700, fontSize: 14, minWidth: 30, textAlign: 'right' }}>{fps}</span>
      {history.length > 1 && (
        <svg width={sparklineWidth} height={sparklineHeight} style={{ margin: '0 4px' }}>
          <polyline fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth={1} points={points} />
        </svg>
      )}
      <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10 }}>{min}-{max}</span>
    </div>
  )
}

export default function FpsMonitor() {
  if (import.meta.env.DEV) {
    return <FpsMonitorInner />
  }
  return null
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test -- -t "FpsMonitor" 2>&1`
Expected: PASS

- [ ] **Step 5: Mount FpsMonitor in `src/App.tsx`**

Add import at top (after line 14):
```tsx
import FpsMonitor from '@/components/ui/FpsMonitor'
```

Add inside the return of `App` function, after `</QueryClientProvider>`:
```tsx
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
      <AlertPopup />
      <FpsMonitor />
    </QueryClientProvider>
  )
}
```

- [ ] **Step 6: Run full test suite**

Run: `pnpm test`
Expected: 252/252 + 2 new = 254/254 PASS

- [ ] **Step 7: Build and verify FPS excluded**

Run: `pnpm build 2>&1`
Expected: Success, no FPS-related code in dist/

- [ ] **Step 8: Commit**

```bash
git add src/components/ui/FpsMonitor.tsx src/__tests__/component/FpsMonitor.test.tsx src/App.tsx
git commit -m "feat: add dev-only FPS monitor with real-time sparkline
- FpsMonitor component: fixed bottom-right overlay, FPS count + 60-frame history sparkline + min/max
- Guarded by import.meta.env.DEV — excluded from production builds
- Mounted in App.tsx alongside AlertPopup"
```

---

### Task 4: Final Verification

- [ ] **Step 1: Run full test suite**

Run: `pnpm test`
Expected: All tests pass (252 existing + 2 new = 254)

- [ ] **Step 2: Build and verify**

Run: `pnpm build 2>&1`
Expected: No errors, no warnings. Verify chunk names and sizes in output.

- [ ] **Step 3: Quick dev check**

Run: `pnpm dev` (let run for 5 seconds, then Ctrl+C)
Expected: Starts without errors at localhost:3000

- [ ] **Step 4: Final commit log check**

Run: `git log --oneline -6`
Expected: The 4 commits from tasks above are present
