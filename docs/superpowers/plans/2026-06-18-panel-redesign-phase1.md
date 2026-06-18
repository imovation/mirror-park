# 智慧校园数据面板重构 (Phase 1) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建三大基础数据 UI 组件，并完成“综合态势”与“教学研究”两大核心专题的全面视觉与数据重构。

**Architecture:** 在 `src/components/ui/` 下新增高复用展示组件。对 API mock 数据进行扩展以支持新增的“资产”和“功能室”等指标。使用现有的 `DashboardPanel` 作为外层容器，内部嵌入高度压缩的新组件，以确保单屏显示不溢出。

**Tech Stack:** React 18, TailwindCSS / Inline Styles, CSS Variables, ECharts (ReactECharts), MSW (Mock)

---

### Task 1: Create Foundation UI Components

**Files:**
- Create: `src/components/ui/CompactStatsRow.tsx`
- Create: `src/components/ui/RankList.tsx`
- Create: `src/components/ui/IconGrid.tsx`

- [ ] **Step 1: Write `CompactStatsRow`**
Create the horizontal stats row.
```tsx
// src/components/ui/CompactStatsRow.tsx
import NumberFlip from './NumberFlip'

export interface StatItem {
  id: string
  label: string
  value: number
  unit?: string
  color?: string
}

export default function CompactStatsRow({ items }: { items: StatItem[] }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      background: 'rgba(74,158,255,0.05)',
      borderRadius: 'var(--radius-md)',
      padding: '8px 12px',
      marginBottom: 8,
      border: '1px solid var(--border-light)'
    }}>
      {items.map(item => (
        <div key={item.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>{item.label}</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
            <span style={{ fontSize: 16, fontWeight: 'bold', color: item.color || 'var(--text-primary)', fontFamily: 'monospace' }}>
              {item.value.toLocaleString()}
            </span>
            {item.unit && <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{item.unit}</span>}
          </div>
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Write `RankList`**
Create a list with badges and inline bars.
```tsx
// src/components/ui/RankList.tsx
import ScrollList from './ScrollList'

export interface RankItem {
  id: string
  name: string
  value: number
  unit?: string
  color?: string
}

export default function RankList({ items, maxHeight = 150 }: { items: RankItem[], maxHeight?: number }) {
  const maxVal = Math.max(...items.map(i => i.value), 1)

  const listItems = items.map((item, index) => {
    const rank = index + 1
    const badgeBg = rank === 1 ? 'var(--color-danger)' : rank === 2 ? 'var(--color-warning)' : rank === 3 ? 'var(--color-pending)' : 'rgba(255,255,255,0.1)'
    const badgeColor = rank <= 3 ? '#fff' : 'var(--text-secondary)'
    const barColor = item.color || 'var(--accent)'

    return {
      id: item.id,
      content: (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '2px 0' }}>
          <div style={{ 
            width: 16, height: 16, borderRadius: 3, background: badgeBg, color: badgeColor, 
            fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' 
          }}>{rank}</div>
          <div style={{ flex: 1, fontSize: 11, color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {item.name}
          </div>
          <div style={{ width: 60, height: 4, background: 'var(--border-light)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ width: `${(item.value / maxVal) * 100}%`, height: '100%', background: barColor, borderRadius: 2 }} />
          </div>
          <div style={{ width: 30, textAlign: 'right', fontSize: 10, color: 'var(--text-primary)' }}>
            {item.value}{item.unit}
          </div>
        </div>
      )
    }
  })

  return <ScrollList items={listItems} maxHeight={maxHeight} />
}
```

- [ ] **Step 3: Write `IconGrid`**
```tsx
// src/components/ui/IconGrid.tsx
export interface GridItem {
  id: string
  icon: string
  label: string
  value: number
  unit?: string
}

export default function IconGrid({ items }: { items: GridItem[] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
      {items.map(item => (
        <div key={item.id} style={{
          display: 'flex', alignItems: 'center', gap: 10, 
          background: 'var(--card-carousel-bg)', padding: '6px 10px', 
          borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)'
        }}>
          <div style={{ 
            width: 28, height: 28, borderRadius: '50%', background: 'rgba(74,158,255,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: 'var(--accent)'
          }}>
            {item.icon}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>{item.label}</div>
            <div style={{ fontSize: 14, fontWeight: 'bold', color: 'var(--text-primary)' }}>
              {item.value} <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 'normal' }}>{item.unit}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 4: Commit UI components**
```bash
git add src/components/ui/CompactStatsRow.tsx src/components/ui/RankList.tsx src/components/ui/IconGrid.tsx
git commit -m "feat: add CompactStatsRow, RankList, IconGrid foundation components"
```

---

### Task 2: Extend Overview API & Mocks

**Files:**
- Modify: `src/api/queries/overview.ts`
- Modify: `src/api/mocks/handlers/overview.ts`

- [ ] **Step 1: Add new interfaces and queries**
In `src/api/queries/overview.ts`, add the following before the end:
```ts
export interface AssetOverview {
  computers: number
  projectors: number
  acs: number
  cameras: number
  printers: number
  accessControls: number
}

export interface FunctionalRoomDist {
  rooms: { name: string; value: number }[]
}

export const useAssetOverview = () =>
  useQuery<AssetOverview>({
    queryKey: ['overview', 'assets'],
    queryFn: () => fetchApi<AssetOverview>('/overview/assets'),
  })

export const useFunctionalRoomDist = () =>
  useQuery<FunctionalRoomDist>({
    queryKey: ['overview', 'functionalRooms'],
    queryFn: () => fetchApi<FunctionalRoomDist>('/overview/functional-rooms'),
  })
```

- [ ] **Step 2: Add mock handlers**
In `src/api/mocks/handlers/overview.ts`, add to the `overviewHandlers` array:
```ts
  http.get(`${BASE}/overview/assets`, () => {
    return HttpResponse.json({
      computers: 326,
      projectors: 68,
      acs: 186,
      cameras: 156,
      printers: 42,
      accessControls: 46
    })
  }),
  http.get(`${BASE}/overview/functional-rooms`, () => {
    return HttpResponse.json({
      rooms: [
        { name: '会议室', value: 6 },
        { name: '功能教室', value: 20 },
        { name: '机房', value: 6 },
        { name: '实验室', value: 12 }
      ]
    })
  }),
```

- [ ] **Step 3: Commit API extensions**
```bash
git add src/api/queries/overview.ts src/api/mocks/handlers/overview.ts
git commit -m "feat: add assets and functional rooms queries for Overview redesign"
```

---

### Task 3: Refactor Overview Left Panels

**Files:**
- Modify: `src/themes/overview/panels/SchoolInfo.tsx`
- Modify: `src/themes/overview/panels/StudentInfo.tsx`

- [ ] **Step 1: Refactor `SchoolInfo.tsx` to use CompactStatsRow**
```tsx
import { useSchoolInfo, usePersonnelComposition } from '@/api/queries/overview'
import CompactStatsRow from '@/components/ui/CompactStatsRow'
import StatusPanel from '@/components/ui/StatusPanel'

export default function SchoolInfo() {
  const { data: sData, isLoading: sLoading } = useSchoolInfo()
  const { data: pData, isLoading: pLoading } = usePersonnelComposition()

  if (sLoading || pLoading) return <StatusPanel type="loading" />
  if (!sData || !pData) return <StatusPanel type="empty" />

  return (
    <CompactStatsRow items={[
      { id: 'land', label: '占地面积', value: sData.landArea, unit: 'm²', color: 'var(--accent)' },
      { id: 'build', label: '建筑面积', value: sData.buildingArea, unit: 'm²', color: 'var(--color-warning)' },
      { id: 'class', label: '班级数', value: sData.classCount, unit: '个' },
      { id: 'staff', label: '教职工', value: pData.totalTeachers, unit: '人' },
      { id: 'stu', label: '学生数', value: 3000, unit: '人' }
    ]} />
  )
}
```

- [ ] **Step 2: Refactor `StudentInfo.tsx` to Dual Bar Chart**
We replace the tall Sankey chart with a compact BarChart.
```tsx
import { useStudentInfo } from '@/api/queries/overview'
import BarChart from '@/components/charts/BarChart'
import StatusPanel from '@/components/ui/StatusPanel'

export default function StudentInfo() {
  const { data, isLoading, error } = useStudentInfo()
  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return <StatusPanel type="empty" />

  // Transform data for a stacked or grouped horizontal bar, or simply show totals.
  // Using the existing BarChart horizontally for simplicity and low height.
  const chartData = data.grades.map(g => ({
    name: g.name,
    value: g.total
  }))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div style={{ display: 'flex', justifyContent: 'space-around', padding: '4px 0', borderBottom: '1px dashed var(--border)' }}>
        <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>男生 <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>1580</span></div>
        <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>女生 <span style={{ color: 'var(--color-warning)', fontWeight: 'bold' }}>1420</span></div>
      </div>
      <BarChart data={chartData} height={120} horizontal={false} color="var(--accent)" />
    </div>
  )
}
```

- [ ] **Step 3: Commit Left Panels**
```bash
git add src/themes/overview/panels/SchoolInfo.tsx src/themes/overview/panels/StudentInfo.tsx
git commit -m "refactor: optimize Overview left panels layout and height"
```

---

### Task 4: Refactor Overview Right Panels

**Files:**
- Create: `src/themes/overview/panels/AssetOverview.tsx`
- Create: `src/themes/overview/panels/FunctionalRooms.tsx`
- Modify: `src/themes/overview/index.tsx` (replace old panels)

- [ ] **Step 1: Create `AssetOverview.tsx`**
```tsx
import { useAssetOverview } from '@/api/queries/overview'
import IconGrid from '@/components/ui/IconGrid'
import StatusPanel from '@/components/ui/StatusPanel'

export default function AssetOverview() {
  const { data, isLoading, error } = useAssetOverview()
  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return <StatusPanel type="empty" />

  return (
    <IconGrid items={[
      { id: 'pc', icon: '💻', label: '电脑', value: data.computers, unit: '台' },
      { id: 'proj', icon: '📽️', label: '投影仪', value: data.projectors, unit: '台' },
      { id: 'ac', icon: '❄️', label: '空调', value: data.acs, unit: '台' },
      { id: 'cam', icon: '📹', label: '摄像头', value: data.cameras, unit: '个' },
      { id: 'print', icon: '🖨️', label: '打印机', value: data.printers, unit: '台' },
      { id: 'door', icon: '🚪', label: '门禁', value: data.accessControls, unit: '个' }
    ]} />
  )
}
```

- [ ] **Step 2: Create `FunctionalRooms.tsx`**
```tsx
import { useFunctionalRoomDist } from '@/api/queries/overview'
import RankList from '@/components/ui/RankList'
import StatusPanel from '@/components/ui/StatusPanel'

export default function FunctionalRooms() {
  const { data, isLoading, error } = useFunctionalRoomDist()
  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return <StatusPanel type="empty" />

  const rankItems = data.rooms.map((r, i) => ({
    id: `room-${i}`,
    name: r.name,
    value: r.value,
    unit: '间',
    color: 'var(--accent)'
  }))

  return <RankList items={rankItems} maxHeight={120} />
}
```

- [ ] **Step 3: Update `src/themes/overview/index.tsx`**
Remove `BuildingDetail` and `RecentActivity` from `panels.right`.
Add `overview-assets` and `overview-rooms`.
```tsx
// src/themes/overview/index.tsx modifications:
import AssetOverview from './panels/AssetOverview'
import FunctionalRooms from './panels/FunctionalRooms'
// ...
export const panels: ThemePanels = {
  left: ['overview-school-info', 'overview-personnel', 'overview-teacher-dist', 'overview-student-info'],
  right: ['overview-activity', 'overview-assets', 'overview-rooms'],
}
// ...
// in renderPanel switch:
    case 'overview-assets':
      return <DashboardPanel title="资产概况"><AssetOverview /></DashboardPanel>
    case 'overview-rooms':
      return <DashboardPanel title="功能室分布"><FunctionalRooms /></DashboardPanel>
```

- [ ] **Step 4: Commit Right Panels**
```bash
git add src/themes/overview/
git commit -m "refactor: replace overview right panels with AssetOverview and FunctionalRooms"
```

---

### Task 5: Refactor Teaching-Research Panels

**Files:**
- Modify: `src/themes/teaching-research/panels/ResourceStatistics.tsx`
- Modify: `src/themes/teaching-research/panels/ResourceUpdates.tsx`
- Modify: `src/themes/teaching-research/panels/TeacherStudiosPanel.tsx`

- [ ] **Step 1: Refactor `ResourceStatistics.tsx` to `CompactStatsRow`**
```tsx
import { useResourceStats } from '@/api/queries/teachingResearch'
import CompactStatsRow from '@/components/ui/CompactStatsRow'
import StatusPanel from '@/components/ui/StatusPanel'

export default function ResourceStatistics() {
  const { data, isLoading, error } = useResourceStats()
  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return <StatusPanel type="empty" />

  return (
    <CompactStatsRow items={[
      { id: 'total', label: '资源总量', value: data.totalResources, unit: '份', color: 'var(--accent)' },
      { id: 'q', label: '云试题数', value: data.cloudQuestions, unit: '道', color: 'var(--color-warning)' },
      { id: 'r', label: '云资源数', value: data.cloudResources, unit: '份' },
      { id: 'u', label: '近期更新', value: data.recentUpdates, unit: '次', color: 'var(--color-success)' }
    ]} />
  )
}
```

- [ ] **Step 2: Refactor `ResourceUpdates.tsx` to custom rich list**
```tsx
import { useResourceUpdates } from '@/api/queries/teachingResearch'
import ScrollList from '@/components/ui/ScrollList'
import StatusPanel from '@/components/ui/StatusPanel'

export default function ResourceUpdates() {
  const { data, isLoading, error } = useResourceUpdates()
  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data || data.recentItems.length === 0) return <StatusPanel type="empty" />

  const items = data.recentItems.map(item => ({
    id: item.id,
    content: (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 60px 40px', gap: 8, alignItems: 'center', padding: '4px 0' }}>
        <div style={{ fontSize: 12, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
        <div style={{ fontSize: 10, color: 'var(--text-secondary)' }}>{item.time}</div>
        <div style={{ fontSize: 10, color: 'var(--accent)', textAlign: 'right' }}>{item.teacher}</div>
      </div>
    )
  }))

  return <ScrollList items={items} maxHeight={160} />
}
```

- [ ] **Step 3: Refactor `TeacherStudiosPanel.tsx` to `RankList`**
```tsx
import { useTeacherStudios } from '@/api/queries/teachingResearch'
import RankList from '@/components/ui/RankList'
import StatusPanel from '@/components/ui/StatusPanel'

export default function TeacherStudiosPanel() {
  const { data, isLoading, error } = useTeacherStudios()
  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return <StatusPanel type="empty" />

  const rankItems = data.studios.map((s, i) => ({
    id: s.id,
    name: s.name,
    value: s.achievementCount,
    unit: '项成果',
    color: 'var(--accent)'
  }))

  return <RankList items={rankItems} maxHeight={160} />
}
```

- [ ] **Step 4: Commit Teaching-Research Panels**
```bash
git add src/themes/teaching-research/
git commit -m "refactor: apply new compact and rich list UI to Teaching-Research panels"
```

---

### Task 6: Review and Fix Types

- [ ] **Step 1: Run TypeScript compiler check**
Run: `pnpm tsc --noEmit`
Expected: Passes without errors.

- [ ] **Step 2: Run build**
Run: `pnpm build`
Expected: Successful build.

- [ ] **Step 3: Auto-Fix**
If any type issues arise from `overview.ts` imports or unused vars, fix them inline and commit: `chore: fix types`.
