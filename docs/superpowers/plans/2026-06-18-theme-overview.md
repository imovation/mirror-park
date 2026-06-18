# Phase 2: Overview (综合态势) Theme Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the full "综合态势" (Overview) theme with Top Metrics strip, 3 left panels, 3 right panels, matching the design screenshots in `docs/panmd/综合态势.png`.

**Architecture:** Add `topMetrics` to ScreenLayout and ThemeEntry types. Create OverviewTopMetrics combining data from 3 queries. Rewrite PersonnelComposition, TeacherDistribution, StudentInfo. Create 3 new panels: ActivityTimeStats, AssetOverview, RoomDistribution. Add mock data handlers for new endpoints.

**Tech Stack:** React 18, TypeScript, ECharts 5, TailwindCSS, Zustand, MSW.

**Key principles:** All charts use `useChartTheme()` for dark/light compatibility. All panels wrapped in `DashboardPanel` container. All loading/error states use `StatusPanel`.

---

### Task 1: ScreenLayout + ThemeEntry + App Wiring

**Files:**
- Modify: `src/components/layout/ScreenLayout.tsx`
- Modify: `src/themes/registry.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Add topMetrics to ScreenLayout**

Modify `src/components/layout/ScreenLayout.tsx`:
```tsx
import type { ReactNode } from 'react'

interface ScreenLayoutProps {
  topBar: ReactNode
  topMetrics?: ReactNode
  leftPanel: ReactNode
  rightPanel: ReactNode
  bottomBar: ReactNode
}

export default function ScreenLayout({ topBar, topMetrics, leftPanel, rightPanel, bottomBar }: ScreenLayoutProps) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateAreas: `
          "topbar  topbar  topbar"
          "left    topmetrics right"
          "left    bottommids right"
          "bottombar bottombar bottombar"
        `,
        gridTemplateRows: 'minmax(48px, 4vh) auto 1fr minmax(28px, 2.5vh)',
        gridTemplateColumns: 'minmax(240px, 18vw) 1fr minmax(240px, 18vw)',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      <div style={{ gridArea: 'topbar', pointerEvents: 'auto' }}>{topBar}</div>
      {topMetrics && (
        <div style={{ gridArea: 'topmetrics', pointerEvents: 'auto', display: 'flex', justifyContent: 'center', padding: '12px', zIndex: 10 }}>
          {topMetrics}
        </div>
      )}
      <div style={{ gridArea: 'left', overflow: 'auto', maxWidth: 420, pointerEvents: 'auto' }}>{leftPanel}</div>
      <div style={{ gridArea: 'right', overflow: 'auto', maxWidth: 420, pointerEvents: 'auto' }}>{rightPanel}</div>
      <div style={{ gridArea: 'bottombar', pointerEvents: 'auto' }}>{bottomBar}</div>
    </div>
  )
}
```

- [ ] **Step 2: Add topMetrics to ThemeEntry**

Modify `src/themes/registry.tsx`:
```tsx
type SceneRenderer = () => ReactNode
type PanelRenderer = (panelId: string) => ReactNode

interface ThemeEntry {
  scene: SceneRenderer
  panels: { left: PanelConfig[]; right: PanelConfig[] }
  renderPanel: PanelRenderer
  topMetrics?: () => ReactNode
}
```

- [ ] **Step 3: Wire topMetrics in App.tsx**

Modify `src/App.tsx` to pass topMetrics to ScreenLayout:
```tsx
// Inside AppContent, add after `const entry = getThemeEntry(currentTheme)`:
const TopMetricsComponent = entry.topMetrics

// In ScreenLayout usage, add:
topMetrics={TopMetricsComponent ? <TopMetricsComponent /> : undefined}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/ScreenLayout.tsx src/themes/registry.tsx src/App.tsx
git commit -m "feat: add topMetrics infrastructure to ScreenLayout and ThemeEntry"
```

### Task 2: Overview TopMetrics + Layout Definition

**Files:**
- Create: `src/themes/overview/panels/OverviewTopMetrics.tsx`
- Modify: `src/themes/overview/index.tsx`
- Modify: `src/api/queries/overview.ts`
- Modify: `src/api/mocks/handlers/overview.ts`

- [ ] **Step 1: Add totalTeachers/totalStudents to schoolInfo query**

Modify `src/api/queries/overview.ts`: Add `totalTeachers` and `totalStudents` to `SchoolInfo` interface:
```typescript
export interface SchoolInfo {
  landArea: number
  buildingArea: number
  classCount: number
  buildingCount: number
  totalTeachers: number
  totalStudents: number
}
```

Modify `src/api/mocks/handlers/overview.ts` to return these fields:
```typescript
http.get(`${BASE}/overview/school-info`, () => {
  return HttpResponse.json({
    landArea: 48700,
    buildingArea: 88000,
    classCount: 60,
    buildingCount: 9,
    totalTeachers: 196,
    totalStudents: 2800,
  })
}),
```

- [ ] **Step 2: Create OverviewTopMetrics**

Create `src/themes/overview/panels/OverviewTopMetrics.tsx`:
```tsx
import { useSchoolInfo } from '@/api/queries/overview'
import StatusPanel from '@/components/ui/StatusPanel'

const METRIC_CONFIG = [
  { key: 'landArea', label: '占地面积', unit: '㎡', icon: 'M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9' },
  { key: 'buildingArea', label: '建筑面积', unit: '㎡', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
  { key: 'classCount', label: '班级数', unit: '个', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
  { key: 'totalTeachers', label: '教职工', unit: '人', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
  { key: 'totalStudents', label: '学生数', unit: '人', icon: 'M13 7V3H4v18h16V7h-7zm0 0l4 4m-4-4v4h4m-4 4h.01M17 17h.01M9 13h.01M13 13h.01M17 13h.01' },
]

export default function OverviewTopMetrics() {
  const { data, isLoading, error } = useSchoolInfo()

  if (isLoading || error || !data) return null

  return (
    <div
      style={{
        display: 'flex',
        gap: 16,
        alignItems: 'center',
        background: 'var(--panel-bg)',
        backdropFilter: 'blur(12px)',
        borderRadius: 12,
        padding: '12px 24px',
        border: '1px solid var(--border)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
      }}
    >
      {METRIC_CONFIG.map((m) => (
        <div
          key={m.key}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            paddingRight: 24,
            borderRight: '1px solid var(--border-light)',
          }}
          className="last:border-0 last:pr-0"
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 8,
              background: 'var(--skeleton-bg)',
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg
              style={{ width: 22, height: 22, color: 'var(--accent)' }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d={m.icon} />
            </svg>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>{m.label}</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
              <span
                style={{
                  fontSize: 24,
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  textShadow: '0 0 8px var(--accent)',
                  fontFamily: "'Courier New', monospace",
                }}
              >
                {(data as any)[m.key]?.toLocaleString()}
              </span>
              <span style={{ fontSize: 11, color: 'var(--accent)', opacity: 0.7 }}>{m.unit}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 3: Update overview index**

Modify `src/themes/overview/index.tsx`:
```tsx
import type { PanelConfig } from '@/types/panel'
import OverviewScene from './OverviewScene'
import OverviewTopMetrics from './panels/OverviewTopMetrics'
import PersonnelComposition from './panels/PersonnelComposition'
import TeacherDistribution from './panels/TeacherDistribution'
import StudentInfo from './panels/StudentInfo'
import ActivityTimeStats from './panels/ActivityTimeStats'
import AssetOverview from './panels/AssetOverview'
import RoomDistribution from './panels/RoomDistribution'

export const overviewScene = () => <OverviewScene />
export const overviewTopMetrics = () => <OverviewTopMetrics />

export const overviewPanels: { left: PanelConfig[]; right: PanelConfig[] } = {
  left: [
    { id: 'overview-personnel', title: '人员构成' },
    { id: 'overview-teacher-dist', title: '师资分布' },
    { id: 'overview-student-info', title: '学生基础信息' },
  ],
  right: [
    { id: 'overview-activity-stats', title: '活跃度时段统计' },
    { id: 'overview-asset-overview', title: '资产概况' },
    { id: 'overview-room-dist', title: '功能室分布' },
  ],
}

export function renderOverviewPanel(panelId: string) {
  switch (panelId) {
    case 'overview-personnel': return <PersonnelComposition />
    case 'overview-teacher-dist': return <TeacherDistribution />
    case 'overview-student-info': return <StudentInfo />
    case 'overview-activity-stats': return <ActivityTimeStats />
    case 'overview-asset-overview': return <AssetOverview />
    case 'overview-room-dist': return <RoomDistribution />
    default: return null
  }
}
```

- [ ] **Step 4: Wire topMetrics in registry**

Modify `src/themes/registry.tsx`:
```tsx
import { overviewPanels, renderOverviewPanel, overviewTopMetrics } from './overview'

// In the OVERVIEW entry:
[ThemeId.OVERVIEW]: {
  scene: () => <OverviewScene />,
  panels: overviewPanels,
  renderPanel: renderOverviewPanel,
  topMetrics: overviewTopMetrics,
},
```

- [ ] **Step 5: Commit**

```bash
git add src/themes/overview/ src/api/queries/overview.ts src/api/mocks/handlers/overview.ts src/themes/registry.tsx
git commit -m "feat: overview top metrics and new panel layout"
```

### Task 3: Left Panels (Personnel + Teacher + Student)

**Files:**
- Modify: `src/themes/overview/panels/PersonnelComposition.tsx`
- Modify: `src/themes/overview/panels/TeacherDistribution.tsx`
- Modify: `src/themes/overview/panels/StudentInfo.tsx`

- [ ] **Step 1: Rewrite PersonnelComposition**

Rewrite `src/themes/overview/panels/PersonnelComposition.tsx`:
```tsx
import { usePersonnelComposition } from '@/api/queries/overview'
import RingChart from '@/components/charts/RingChart'
import ChartLabel from '@/components/ui/ChartLabel'
import StatusPanel from '@/components/ui/StatusPanel'

export default function PersonnelComposition() {
  const { data, isLoading, error } = usePersonnelComposition()

  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return <StatusPanel type="empty" />

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        <div style={{ flex: 1 }}>
          <ChartLabel>性别比例</ChartLabel>
          <RingChart
            data={[
              { name: '男', value: data.maleCount },
              { name: '女', value: data.femaleCount },
            ]}
            height={130}
          />
        </div>
        <div style={{ flex: 1 }}>
          <ChartLabel>学历分布</ChartLabel>
          <RingChart
            data={data.education.map(e => ({ name: e.name, value: e.value }))}
            height={130}
          />
        </div>
      </div>
      <ChartLabel>教职工总人数</ChartLabel>
      <div style={{ fontSize: 32, fontWeight: 'bold', color: 'var(--text-primary)', textAlign: 'center', textShadow: '0 0 12px var(--accent)' }}>
        {data.totalTeachers}
        <span style={{ fontSize: 14, color: 'var(--text-muted)', marginLeft: 8 }}>人</span>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Rewrite TeacherDistribution**

Rewrite `src/themes/overview/panels/TeacherDistribution.tsx`:
```tsx
import { useTeacherDistribution } from '@/api/queries/overview'
import BarChart from '@/components/charts/BarChart'
import ChartLabel from '@/components/ui/ChartLabel'
import StatusPanel from '@/components/ui/StatusPanel'

export default function TeacherDistribution() {
  const { data, isLoading, error } = useTeacherDistribution()

  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return <StatusPanel type="empty" />

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
      <ChartLabel>各学科教师数量</ChartLabel>
      <div style={{ flex: 1 }}>
        <BarChart
          data={data.subjects}
          height={160}
          barWidth={14}
        />
      </div>
      <ChartLabel>职称分布</ChartLabel>
      <div style={{ flex: 1 }}>
        <BarChart
          data={data.titles}
          height={90}
          barWidth={20}
        />
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Rewrite StudentInfo**

Rewrite `src/themes/overview/panels/StudentInfo.tsx`:
```tsx
import { useStudentInfo } from '@/api/queries/overview'
import BarChart from '@/components/charts/BarChart'
import ChartLabel from '@/components/ui/ChartLabel'
import StatusPanel from '@/components/ui/StatusPanel'

export default function StudentInfo() {
  const { data, isLoading, error } = useStudentInfo()

  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return <StatusPanel type="empty" />

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
      <div style={{ display: 'flex', gap: 16 }}>
        {data.grades.map((g) => (
          <div key={g.name} style={{ flex: 1, textAlign: 'center', background: 'var(--skeleton-bg)', borderRadius: 8, padding: 8 }}>
            <div style={{ fontSize: 12, color: 'var(--accent)', marginBottom: 4 }}>{g.name}</div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 12, fontSize: 14, fontWeight: 600 }}>
              <span style={{ color: '#60a5fa' }}>♂ {g.male}</span>
              <span style={{ color: '#f472b6' }}>♀ {g.female}</span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>共{g.total}人</div>
          </div>
        ))}
      </div>
      <ChartLabel>男女比例</ChartLabel>
      <div style={{ flex: 1 }}>
        <BarChart
          data={[
            { name: '初一', value: 930 },
            { name: '初二', value: 930 },
            { name: '初三', value: 940 },
          ]}
          height={100}
        />
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add src/themes/overview/panels/PersonnelComposition.tsx src/themes/overview/panels/TeacherDistribution.tsx src/themes/overview/panels/StudentInfo.tsx
git commit -m "feat: rewrite overview left panels with new UI"
```

### Task 4: Right Panels + New Mock Data

**Files:**
- Create: `src/themes/overview/panels/ActivityTimeStats.tsx`
- Create: `src/themes/overview/panels/AssetOverview.tsx`
- Create: `src/themes/overview/panels/RoomDistribution.tsx`
- Modify: `src/api/queries/overview.ts`
- Modify: `src/api/mocks/handlers/overview.ts`

- [ ] **Step 1: Add new query types and hooks**

Add to `src/api/queries/overview.ts`:
```typescript
export interface AssetData {
  computers: number
  projectors: number
  airConditioners: number
  cameras: number
  printers: number
  doorLocks: number
}

export interface RoomDistribution {
  rooms: { name: string; count: number }[]
}

export const useAssetData = () =>
  useQuery<AssetData>({
    queryKey: ['overview', 'assets'],
    queryFn: () => fetchApi<AssetData>('/overview/assets'),
  })

export const useRoomDistribution = () =>
  useQuery<RoomDistribution>({
    queryKey: ['overview', 'rooms'],
    queryFn: () => fetchApi<RoomDistribution>('/overview/rooms'),
  })
```

Add to `src/api/mocks/handlers/overview.ts`:
```typescript
http.get(`${BASE}/overview/assets`, () => {
  return HttpResponse.json({
    computers: 680,
    projectors: 72,
    airConditioners: 320,
    cameras: 420,
    printers: 36,
    doorLocks: 240,
  })
}),

http.get(`${BASE}/overview/rooms`, () => {
  return HttpResponse.json({
    rooms: [
      { name: '普通教室', count: 60 },
      { name: '计算机室', count: 6 },
      { name: '实验室', count: 8 },
      { name: '音乐室', count: 4 },
      { name: '美术室', count: 4 },
      { name: '会议室', count: 6 },
      { name: '图书馆', count: 1 },
      { name: '体育馆', count: 1 },
    ],
  })
}),
```

- [ ] **Step 2: Create ActivityTimeStats**

Create `src/themes/overview/panels/ActivityTimeStats.tsx`:
```tsx
import { useActivity } from '@/api/queries/overview'
import BarChart from '@/components/charts/BarChart'
import StatusPanel from '@/components/ui/StatusPanel'

export default function ActivityTimeStats() {
  const { data, isLoading, error } = useActivity()

  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return <StatusPanel type="empty" />

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      <div style={{ flex: 1 }}>
        <BarChart
          data={data.hours.map((h, i) => ({ name: h, value: data.values[i] }))}
          height={220}
          barWidth={12}
        />
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Create AssetOverview**

Create `src/themes/overview/panels/AssetOverview.tsx`:
```tsx
import { useAssetData } from '@/api/queries/overview'
import StatusPanel from '@/components/ui/StatusPanel'

const ASSET_ITEMS = [
  { key: 'computers', label: '电脑', icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', color: '#22d3ee' },
  { key: 'projectors', label: '投影仪', icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', color: '#818cf8' },
  { key: 'airConditioners', label: '空调', color: '#34d399' },
  { key: 'cameras', label: '摄像头', color: '#facc15' },
  { key: 'printers', label: '打印机', color: '#f472b6' },
  { key: 'doorLocks', label: '门禁', color: '#fb923c' },
]

export default function AssetOverview() {
  const { data, isLoading, error } = useAssetData()

  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return <StatusPanel type="empty" />

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
      {ASSET_ITEMS.map((a) => (
        <div
          key={a.key}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 6,
            padding: '12px 8px',
            background: 'var(--skeleton-bg)',
            borderRadius: 8,
            border: '1px solid var(--border-light)',
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: `${a.color}20`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: `1px solid ${a.color}40`,
            }}
          >
            <svg style={{ width: 18, height: 18, color: a.color }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d={a.icon || 'M12 6v6m0 0v6m0-6h6m-6 0H6'} />
            </svg>
          </div>
          <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>
            {(data as any)[a.key]?.toLocaleString()}
          </span>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{a.label}</span>
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 4: Create RoomDistribution**

Create `src/themes/overview/panels/RoomDistribution.tsx`:
```tsx
import { useRoomDistribution } from '@/api/queries/overview'
import BarChart from '@/components/charts/BarChart'
import StatusPanel from '@/components/ui/StatusPanel'

export default function RoomDistribution() {
  const { data, isLoading, error } = useRoomDistribution()

  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return <StatusPanel type="empty" />

  return (
    <div style={{ flex: 1 }}>
      <BarChart
        data={data.rooms}
        height={200}
        barWidth={14}
      />
    </div>
  )
}
```

- [ ] **Step 5: Commit**

```bash
git add src/themes/overview/panels/ActivityTimeStats.tsx src/themes/overview/panels/AssetOverview.tsx src/themes/overview/panels/RoomDistribution.tsx src/api/queries/overview.ts src/api/mocks/handlers/overview.ts
git commit -m "feat: add overview right panels and mock data"
```
