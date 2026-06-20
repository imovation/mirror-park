# 测试补充 Phase 2 — 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 补齐 19 个组件单元测试（9 图表 + 4 布局 + 6 UI），~48 新增用例。

**Architecture:** 每个组件一个独立测试文件，2-3 个用例（渲染 + 边界）。图表组件使用 `renderWithProviders`（需要 `useChartTheme` hook 的 Provider）。布局/UI 组件按需使用 Zustand store 初始状态。

**Tech Stack:** Vitest + Testing Library + jsdom

---

## Phase 1: Chart Components (Tasks 1-9)

All chart tests follow the same pattern. Each task creates one file with 2 tests using `renderWithProviders`.

### Task 1: LineChart

**Files:** Create `src/__tests__/component/LineChart.test.tsx`

- [ ] **Step 1: Write test**

```tsx
import { renderWithProviders } from '@/__tests__/test-utils'
import LineChart from '@/components/charts/LineChart'

describe('LineChart', () => {
  it('renders chart container with data', () => {
    const { container } = renderWithProviders(
      <LineChart xData={['Jan', 'Feb']} series={[{ name: 'S1', data: [10, 20] }]} />,
    )
    expect(container.firstElementChild).not.toBeNull()
  })

  it('handles empty data without crashing', () => {
    const { container } = renderWithProviders(
      <LineChart xData={[]} series={[]} />,
    )
    expect(container.firstElementChild).not.toBeNull()
  })
})
```

- [ ] **Step 2: Run and commit**

```bash
npx vitest run -- -t "LineChart"
git add src/__tests__/component/LineChart.test.tsx
git commit -m "test: add LineChart unit tests"
```

---

### Task 2: RingChart

**Files:** Create `src/__tests__/component/RingChart.test.tsx`

```tsx
import { renderWithProviders } from '@/__tests__/test-utils'
import RingChart from '@/components/charts/RingChart'

describe('RingChart', () => {
  it('renders chart container with data', () => {
    const { container } = renderWithProviders(
      <RingChart data={[{ name: 'A', value: 30 }, { name: 'B', value: 70 }]} />,
    )
    expect(container.firstElementChild).not.toBeNull()
  })

  it('handles empty data without crashing', () => {
    const { container } = renderWithProviders(<RingChart data={[]} />)
    expect(container.firstElementChild).not.toBeNull()
  })
})
```

Run: `npx vitest run -- -t "RingChart"`  
Commit: `git add ... && git commit -m "test: add RingChart unit tests"`

---

### Task 3: GaugeChart

**Files:** Create `src/__tests__/component/GaugeChart.test.tsx`

```tsx
import { renderWithProviders } from '@/__tests__/test-utils'
import GaugeChart from '@/components/charts/GaugeChart'

describe('GaugeChart', () => {
  it('renders chart container with value', () => {
    const { container } = renderWithProviders(<GaugeChart value={75} />)
    expect(container.firstElementChild).not.toBeNull()
  })

  it('renders with name and max', () => {
    const { container } = renderWithProviders(
      <GaugeChart value={50} max={200} name="评分" />,
    )
    expect(container.firstElementChild).not.toBeNull()
  })
})
```

Run: `npx vitest run -- -t "GaugeChart"`  
Commit.

---

### Task 4: HeatmapChart

**Files:** Create `src/__tests__/component/HeatmapChart.test.tsx`

```tsx
import { renderWithProviders } from '@/__tests__/test-utils'
import HeatmapChart from '@/components/charts/HeatmapChart'

describe('HeatmapChart', () => {
  it('renders chart container with data', () => {
    const { container } = renderWithProviders(
      <HeatmapChart
        xLabels={['A', 'B']}
        yLabels={['X', 'Y']}
        data={[[0, 0, 10], [0, 1, 20], [1, 0, 30], [1, 1, 40]]}
      />,
    )
    expect(container.firstElementChild).not.toBeNull()
  })

  it('handles empty data without crashing', () => {
    const { container } = renderWithProviders(
      <HeatmapChart xLabels={[]} yLabels={[]} data={[]} />,
    )
    expect(container.firstElementChild).not.toBeNull()
  })
})
```

Run and commit.

---

### Task 5: TreemapChart

**Files:** Create `src/__tests__/component/TreemapChart.test.tsx`

```tsx
import { renderWithProviders } from '@/__tests__/test-utils'
import TreemapChart from '@/components/charts/TreemapChart'

describe('TreemapChart', () => {
  it('renders chart container with data', () => {
    const { container } = renderWithProviders(
      <TreemapChart data={[{ name: 'A', value: 100 }, { name: 'B', value: 200 }]} />,
    )
    expect(container.firstElementChild).not.toBeNull()
  })

  it('handles empty data without crashing', () => {
    const { container } = renderWithProviders(<TreemapChart data={[]} />)
    expect(container.firstElementChild).not.toBeNull()
  })
})
```

Run and commit.

---

### Task 6: SankeyChart

**Files:** Create `src/__tests__/component/SankeyChart.test.tsx`

```tsx
import { renderWithProviders } from '@/__tests__/test-utils'
import SankeyChart from '@/components/charts/SankeyChart'

describe('SankeyChart', () => {
  it('renders chart container with data', () => {
    const { container } = renderWithProviders(
      <SankeyChart
        data={[{ source: 'A', target: 'B', value: 50 }]}
        categories={['A', 'B']}
      />,
    )
    expect(container.firstElementChild).not.toBeNull()
  })

  it('handles empty data without crashing', () => {
    const { container } = renderWithProviders(
      <SankeyChart data={[]} categories={[]} />,
    )
    expect(container.firstElementChild).not.toBeNull()
  })
})
```

Run and commit.

---

### Task 7: SunburstChart

**Files:** Create `src/__tests__/component/SunburstChart.test.tsx`

```tsx
import { renderWithProviders } from '@/__tests__/test-utils'
import SunburstChart from '@/components/charts/SunburstChart'

describe('SunburstChart', () => {
  it('renders chart container with data', () => {
    const { container } = renderWithProviders(
      <SunburstChart
        data={[{ name: 'A', value: 100, children: [{ name: 'A1', value: 50 }] }]}
      />,
    )
    expect(container.firstElementChild).not.toBeNull()
  })

  it('handles empty data without crashing', () => {
    const { container } = renderWithProviders(<SunburstChart data={[]} />)
    expect(container.firstElementChild).not.toBeNull()
  })
})
```

Run and commit.

---

### Task 8: FunnelChart

**Files:** Create `src/__tests__/component/FunnelChart.test.tsx`

```tsx
import { renderWithProviders } from '@/__tests__/test-utils'
import FunnelChart from '@/components/charts/FunnelChart'

describe('FunnelChart', () => {
  it('renders chart container with data', () => {
    const { container } = renderWithProviders(
      <FunnelChart data={[{ name: 'Step1', value: 100 }, { name: 'Step2', value: 60 }]} />,
    )
    expect(container.firstElementChild).not.toBeNull()
  })

  it('handles empty data without crashing', () => {
    const { container } = renderWithProviders(<FunnelChart data={[]} />)
    expect(container.firstElementChild).not.toBeNull()
  })
})
```

Run and commit.

---

### Task 9: RadarChart

**Files:** Create `src/__tests__/component/RadarChart.test.tsx`

```tsx
import { renderWithProviders } from '@/__tests__/test-utils'
import RadarChart from '@/components/charts/RadarChart'

describe('RadarChart', () => {
  it('renders chart container with data', () => {
    const { container } = renderWithProviders(
      <RadarChart
        indicator={[{ name: 'KPI1', max: 100 }, { name: 'KPI2', max: 100 }]}
        series={[{ name: 'S1', value: [80, 60] }]}
      />,
    )
    expect(container.firstElementChild).not.toBeNull()
  })

  it('handles empty indicator without crashing', () => {
    const { container } = renderWithProviders(
      <RadarChart indicator={[]} series={[]} />,
    )
    expect(container.firstElementChild).not.toBeNull()
  })
})
```

Run and commit.

---

### Task 10: Run all chart tests

- [ ] **Step 1:**

```bash
pnpm test
```

Expected: 59 existing + 18 new = 77 tests pass.

---

## Phase 2: Layout Components (Tasks 11-14)

### Task 11: TopBar

**Files:** Create `src/__tests__/component/TopBar.test.tsx`

- [ ] **Step 1: Write test**

```tsx
import { renderWithProviders, screen } from '@/__tests__/test-utils'
import TopBar from '@/components/layout/TopBar'

describe('TopBar', () => {
  it('renders the platform title', () => {
    renderWithProviders(<TopBar />)
    expect(screen.getByText('智慧校园可视化平台')).toBeInTheDocument()
  })

  it('renders all 6 topic navigation buttons', () => {
    renderWithProviders(<TopBar />)
    expect(screen.getByText('综合态势')).toBeInTheDocument()
    expect(screen.getByText('教学研究')).toBeInTheDocument()
    expect(screen.getByText('行政办公')).toBeInTheDocument()
    expect(screen.getByText('智慧图书')).toBeInTheDocument()
    expect(screen.getByText('智慧教学')).toBeInTheDocument()
    expect(screen.getByText('智慧安防')).toBeInTheDocument()
  })

  it('renders theme toggle button', () => {
    renderWithProviders(<TopBar />)
    expect(screen.getByText('☀️ 亮色')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run and commit**

```bash
npx vitest run -- -t "TopBar"
git add src/__tests__/component/TopBar.test.tsx
git commit -m "test: add TopBar unit tests"
```

---

### Task 12: SidePanel

**Files:** Create `src/__tests__/component/SidePanel.test.tsx`

```tsx
import { renderWithProviders, screen } from '@/__tests__/test-utils'
import SidePanel from '@/components/layout/SidePanel'

describe('SidePanel', () => {
  it('renders children content', () => {
    renderWithProviders(<SidePanel><span>Test Content</span></SidePanel>)
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('renders empty without crashing', () => {
    const { container } = renderWithProviders(<SidePanel><div /></SidePanel>)
    expect(container.firstElementChild).not.toBeNull()
  })
})
```

Run and commit.

---

### Task 13: BottomBar

**Files:** Create `src/__tests__/component/BottomBar.test.tsx`

```tsx
import { renderWithProviders, screen } from '@/__tests__/test-utils'
import BottomBar from '@/components/layout/BottomBar'

describe('BottomBar', () => {
  it('displays version number', () => {
    renderWithProviders(<BottomBar />)
    expect(screen.getByText(/v0\.2\.0/)).toBeInTheDocument()
  })

  it('shows platform title', () => {
    renderWithProviders(<BottomBar />)
    expect(screen.getByText(/智慧校园可视化平台/)).toBeInTheDocument()
  })

  it('shows SSE status text', () => {
    renderWithProviders(<BottomBar status="disconnected" />)
    expect(screen.getByText('连接已断开')).toBeInTheDocument()
  })
})
```

Run and commit.

---

### Task 14: ScreenLayout

**Files:** Create `src/__tests__/component/ScreenLayout.test.tsx`

```tsx
import { renderWithProviders, screen } from '@/__tests__/test-utils'
import ScreenLayout from '@/components/layout/ScreenLayout'

describe('ScreenLayout', () => {
  it('renders all layout slots', () => {
    renderWithProviders(
      <ScreenLayout
        topBar={<span>Top</span>}
        topMetrics={<span>Metrics</span>}
        leftPanel={<span>Left</span>}
        rightPanel={<span>Right</span>}
        bottomBar={<span>Bottom</span>}
      />,
    )
    expect(screen.getByText('Top')).toBeInTheDocument()
    expect(screen.getByText('Metrics')).toBeInTheDocument()
    expect(screen.getByText('Left')).toBeInTheDocument()
    expect(screen.getByText('Right')).toBeInTheDocument()
    expect(screen.getByText('Bottom')).toBeInTheDocument()
  })

  it('renders without topMetrics', () => {
    renderWithProviders(
      <ScreenLayout
        topBar={<span>Top</span>}
        leftPanel={<span>Left</span>}
        rightPanel={<span>Right</span>}
        bottomBar={<span>Bottom</span>}
      />,
    )
    expect(screen.getByText('Top')).toBeInTheDocument()
    expect(screen.getByText('Left')).toBeInTheDocument()
    expect(screen.getByText('Right')).toBeInTheDocument()
    expect(screen.getByText('Bottom')).toBeInTheDocument()
  })
})
```

Run and commit.

---

## Phase 3: UI Components (Tasks 15-20)

### Task 15: AlertPopup

**Files:** Create `src/__tests__/component/AlertPopup.test.tsx`

```tsx
import { renderWithProviders, screen } from '@/__tests__/test-utils'
import AlertPopup from '@/components/ui/AlertPopup'
import { useUIStore } from '@/stores/useUIStore'

describe('AlertPopup', () => {
  beforeEach(() => {
    useUIStore.setState({ alertQueue: [] })
  })

  it('renders nothing when alert queue is empty', () => {
    const { container } = renderWithProviders(<AlertPopup />)
    expect(container.innerHTML).toBe('')
  })

  it('renders alert message when queue has items', () => {
    useUIStore.setState({
      alertQueue: [{ id: '1', type: 'error', message: '测试告警消息', timestamp: new Date() }],
    })
    renderWithProviders(<AlertPopup />)
    expect(screen.getByText('测试告警消息')).toBeInTheDocument()
  })

  it('renders at most 3 visible alerts', () => {
    useUIStore.setState({
      alertQueue: [
        { id: '1', type: 'error', message: 'Alert 1', timestamp: new Date() },
        { id: '2', type: 'warning', message: 'Alert 2', timestamp: new Date() },
        { id: '3', type: 'info', message: 'Alert 3', timestamp: new Date() },
        { id: '4', type: 'error', message: 'Alert 4', timestamp: new Date() },
      ],
    })
    renderWithProviders(<AlertPopup />)
    expect(screen.getByText('Alert 1')).toBeInTheDocument()
    expect(screen.getByText('Alert 2')).toBeInTheDocument()
    expect(screen.getByText('Alert 3')).toBeInTheDocument()
    expect(screen.queryByText('Alert 4')).not.toBeInTheDocument()
  })
})
```

Run: `npx vitest run -- -t "AlertPopup"` (expect 3 pass). Commit.

---

### Task 16: CardCarousel

**Files:** Create `src/__tests__/component/CardCarousel.test.tsx`

```tsx
import { renderWithProviders, screen } from '@/__tests__/test-utils'
import CardCarousel from '@/components/ui/CardCarousel'

describe('CardCarousel', () => {
  it('renders card items', () => {
    renderWithProviders(
      <CardCarousel items={[
        { id: '1', title: 'Card A', subtitle: 'Desc A' },
        { id: '2', title: 'Card B', subtitle: 'Desc B' },
      ]} />,
    )
    expect(screen.getByText('Card A')).toBeInTheDocument()
  })

  it('shows empty state when no items', () => {
    renderWithProviders(<CardCarousel items={[]} />)
    expect(screen.getByText('暂无数据')).toBeInTheDocument()
  })
})
```

Run and commit.

---

### Task 17: ChartLabel

**Files:** Create `src/__tests__/component/ChartLabel.test.tsx`

```tsx
import { renderWithProviders, screen } from '@/__tests__/test-utils'
import ChartLabel from '@/components/ui/ChartLabel'

describe('ChartLabel', () => {
  it('renders children text', () => {
    renderWithProviders(<ChartLabel>测试标签</ChartLabel>)
    expect(screen.getByText('测试标签')).toBeInTheDocument()
  })

  it('renders with center alignment', () => {
    renderWithProviders(<ChartLabel align="center">居中</ChartLabel>)
    expect(screen.getByText('居中')).toBeInTheDocument()
  })

  it('renders empty without crashing', () => {
    const { container } = renderWithProviders(<ChartLabel>{''}</ChartLabel>)
    expect(container.firstElementChild).not.toBeNull()
  })
})
```

Run and commit.

---

### Task 18: Modal

**Files:** Create `src/__tests__/component/Modal.test.tsx`

```tsx
import { renderWithProviders, screen } from '@/__tests__/test-utils'
import Modal from '@/components/ui/Modal'
import userEvent from '@testing-library/user-event'

describe('Modal', () => {
  it('renders content when visible', () => {
    renderWithProviders(
      <Modal visible title="Test Modal" onClose={() => {}}>
        <span>Modal Content</span>
      </Modal>,
    )
    expect(screen.getByText('Test Modal')).toBeInTheDocument()
    expect(screen.getByText('Modal Content')).toBeInTheDocument()
  })

  it('does not render when not visible', () => {
    const { container } = renderWithProviders(
      <Modal visible={false} title="Hidden" onClose={() => {}}>
        <span>Hidden Content</span>
      </Modal>,
    )
    expect(container.textContent).toBe('')
  })
})
```

Run and commit.

---

### Task 19: TopMetricsCard

**Files:** Create `src/__tests__/component/TopMetricsCard.test.tsx`

```tsx
import { renderWithProviders, screen } from '@/__tests__/test-utils'
import TopMetricsCard from '@/components/ui/TopMetricsCard'

describe('TopMetricsCard', () => {
  it('renders label and value', () => {
    renderWithProviders(<TopMetricsCard label="教师总数" value="196" />)
    expect(screen.getByText('教师总数')).toBeInTheDocument()
    expect(screen.getByText('196')).toBeInTheDocument()
  })
})
```

Run and commit.

---

### Task 20: VideoWindow

**Files:** Create `src/__tests__/component/VideoWindow.test.tsx`

```tsx
import { renderWithProviders, screen } from '@/__tests__/test-utils'
import VideoWindow from '@/components/ui/VideoWindow'

describe('VideoWindow', () => {
  it('renders when visible', () => {
    renderWithProviders(<VideoWindow visible title="食堂监控" onClose={() => {}} />)
    expect(screen.getByText(/食堂监控/)).toBeInTheDocument()
  })

  it('does not render when not visible', () => {
    const { container } = renderWithProviders(
      <VideoWindow visible={false} title="Hidden" onClose={() => {}} />,
    )
    expect(container.textContent).toBe('')
  })
})
```

Run and commit.

---

## Phase 4: Verification

### Task 21: Full verification

- [ ] **Step 1: Run all unit tests**

```bash
pnpm test
```

Expected: ~107 tests pass (59 existing + ~48 new).

- [ ] **Step 2: Run build**

```bash
pnpm build
```

Expected: build passes.

- [ ] **Step 3: Final commit to update state**

```bash
git status
git diff --stat
pnpm test
```

If all pass, update AGENTS.md test counts and commit:

```bash
git add -A
git commit -m "test: complete component unit tests Phase 2 — 9 charts + 4 layout + 6 UI (~48 new cases)"
```

---

## Summary

| Phase | Tasks | New Files | Test Cases |
|-------|-------|-----------|------------|
| Charts (1-9) | 9 | 9 | 18 |
| Layout (11-14) | 4 | 4 | 9 |
| UI (15-20) | 6 | 6 | 14 |
| Verification (21) | 1 | 0 | — |
| **Total** | **20** | **19** | **~41** |
