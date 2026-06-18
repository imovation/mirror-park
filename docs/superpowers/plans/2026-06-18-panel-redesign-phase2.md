# 智慧校园数据面板重构 (Phase 2) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 完成剩余四个专题（智慧图书、行政办公、智慧教学、智慧安防）的数据面板重构，全面应用 Phase 1 开发的 `CompactStatsRow` 和 `RankList` 组件。

**Architecture:** 
- 将各专题总览面板（Overview）全部转换为 `<CompactStatsRow>` 置顶。
- 将大量的原生 ECharts 柱状排行图（BarChart）和原始 `<ScrollList>` 统一升级为带发光 Badge 和进度条的 `<RankList>`。
- 移除占位过大的仪表盘（GaugeChart），使用极简 DOM 进度条替代。

**Tech Stack:** React 18, TailwindCSS / Inline Styles, CSS Variables

---

### Task 1: Refactor Library Theme

**Files:**
- Modify: `src/themes/library/panels/CollectionOverview.tsx`
- Modify: `src/themes/library/panels/ClassBorrowRank.tsx`

- [ ] **Step 1: Refactor `CollectionOverview.tsx` to `CompactStatsRow`**
```tsx
import { useCollection } from '@/api/queries/library'
import CompactStatsRow from '@/components/ui/CompactStatsRow'
import StatusPanel from '@/components/ui/StatusPanel'

export default function CollectionOverview() {
  const { data, isLoading, error } = useCollection()
  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return <StatusPanel type="empty" />

  return (
    <CompactStatsRow items={[
      { id: 'paper', label: '纸质图书', value: data.paperBooks, unit: '册', color: 'var(--accent)' },
      { id: 'ebook', label: '电子图书', value: data.ebooks, unit: '册', color: 'var(--color-success)' },
      { id: 'journal', label: '期刊种类', value: data.journals, unit: '种' },
      { id: 'news', label: '报纸种类', value: data.newspapers, unit: '种' }
    ]} />
  )
}
```

- [ ] **Step 2: Refactor `ClassBorrowRank.tsx` to use `RankList`**
Replace the generic BarChart and ScrollList with the unified RankList.
```tsx
import { useClassRank } from '@/api/queries/library'
import RankList from '@/components/ui/RankList'
import StatusPanel from '@/components/ui/StatusPanel'

export default function ClassBorrowRank() {
  const { data, isLoading, error } = useClassRank()
  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return <StatusPanel type="empty" />

  const rankItems = data.classRank.slice(0, 8).map((c, i) => ({
    id: `class-${i}`,
    name: c.className,
    value: c.count,
    unit: '册',
    color: 'var(--accent)'
  }))

  return <RankList items={rankItems} maxHeight={220} />
}
```

- [ ] **Step 3: Commit Library Theme Refactor**
```bash
git add src/themes/library/
git commit -m "refactor: optimize Library panels with CompactStatsRow and RankList"
```

---

### Task 2: Refactor Admin Theme

**Files:**
- Modify: `src/themes/admin/panels/AdminOverview.tsx`

- [ ] **Step 1: Refactor `AdminOverview.tsx` to `CompactStatsRow`**
```tsx
import { useAdminOverview } from '@/api/queries/admin'
import CompactStatsRow from '@/components/ui/CompactStatsRow'
import StatusPanel from '@/components/ui/StatusPanel'

export default function AdminOverview() {
  const { data, isLoading, error } = useAdminOverview()
  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return <StatusPanel type="empty" />

  return (
    <CompactStatsRow items={[
      { id: 'dept', label: '部门数量', value: data.departmentCount, unit: '个', color: 'var(--accent)' },
      { id: 'staff', label: '教职工总数', value: data.staffCount, unit: '人' },
      { id: 'rate', label: '今日出勤率', value: Math.round(data.attendanceRate * 100), unit: '%', color: 'var(--color-success)' },
      { id: 'room', label: '功能室数量', value: data.roomCount, unit: '间', color: 'var(--color-warning)' }
    ]} />
  )
}
```

- [ ] **Step 2: Commit Admin Theme Refactor**
```bash
git add src/themes/admin/
git commit -m "refactor: optimize Admin panels with CompactStatsRow"
```

---

### Task 3: Refactor Academics Theme

**Files:**
- Modify: `src/themes/academics/panels/TeachingOverview.tsx`
- Modify: `src/themes/academics/panels/ClassroomUsagePanel.tsx`

- [ ] **Step 1: Refactor `TeachingOverview.tsx` to `CompactStatsRow`**
```tsx
import { useAcademicsOverview } from '@/api/queries/academics'
import CompactStatsRow from '@/components/ui/CompactStatsRow'
import StatusPanel from '@/components/ui/StatusPanel'

export default function TeachingOverview() {
  const { data, isLoading, error } = useAcademicsOverview()
  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return <StatusPanel type="empty" />

  return (
    <CompactStatsRow items={[
      { id: 'today', label: '今日课程', value: data.todayCourses, unit: '节', color: 'var(--accent)' },
      { id: 'now', label: '正在上课', value: data.activeCourses, unit: '节', color: 'var(--color-success)' },
      { id: 'rooms', label: '教室总数', value: data.totalClassrooms, unit: '间' },
      { id: 'rate', label: '教室使用率', value: Math.round(data.usageRate * 100), unit: '%', color: 'var(--color-warning)' }
    ]} />
  )
}
```

- [ ] **Step 2: Compress `ClassroomUsagePanel.tsx`**
Remove `GaugeChart` and simplify the layout to reduce height footprint.
```tsx
import { useClassroomUsage } from '@/api/queries/academics'
import BarChart from '@/components/charts/BarChart'
import PieChart from '@/components/charts/PieChart'
import StatusPanel from '@/components/ui/StatusPanel'
import ChartLabel from '@/components/ui/ChartLabel'

export default function ClassroomUsagePanel() {
  const { data, isLoading, error } = useClassroomUsage()
  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return <StatusPanel type="empty" />

  const total = data.inUse + data.available
  const usagePercent = total > 0 ? Math.round((data.inUse / total) * 100) : 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 12px' }}>
         <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>使用中: <span style={{color: 'var(--color-success)', fontWeight: 'bold'}}>{data.inUse}间</span></div>
         <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>空闲: <span style={{color: 'var(--color-warning)', fontWeight: 'bold'}}>{data.available}间</span></div>
         <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>使用率: <span style={{color: 'var(--accent)', fontWeight: 'bold'}}>{usagePercent}%</span></div>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <div style={{ flex: 1 }}>
          <ChartLabel align="center">各楼使用率</ChartLabel>
          <BarChart data={data.buildingUsage} height={80} />
        </div>
        <div style={{ flex: 1 }}>
          <ChartLabel align="center">教室类型分布</ChartLabel>
          <PieChart data={data.typeDistribution} height={80} />
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Commit Academics Theme Refactor**
```bash
git add src/themes/academics/
git commit -m "refactor: optimize Academics panels (CompactStatsRow + compressed usage panel)"
```

---

### Task 4: Refactor Security Theme

**Files:**
- Modify: `src/themes/security/panels/SecurityOverview.tsx`
- Modify: `src/themes/security/panels/AccessControl.tsx`

- [ ] **Step 1: Refactor `SecurityOverview.tsx` to `CompactStatsRow`**
```tsx
import { useSecurityOverview } from '@/api/queries/security'
import CompactStatsRow from '@/components/ui/CompactStatsRow'
import StatusPanel from '@/components/ui/StatusPanel'

export default function SecurityOverview() {
  const { data, isLoading, error } = useSecurityOverview()
  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return <StatusPanel type="empty" />

  return (
    <CompactStatsRow items={[
      { id: 'cam', label: '监控摄像头', value: data.cameras, unit: '个', color: 'var(--accent)' },
      { id: 'door', label: '门禁设备', value: data.accessControls, unit: '个' },
      { id: 'alert', label: '今日告警', value: data.todayAlerts, unit: '次', color: 'var(--color-danger)' },
      { id: 'visit', label: '今日访客', value: data.todayVisitors, unit: '人', color: 'var(--color-success)' }
    ]} />
  )
}
```

- [ ] **Step 2: Upgrade `AccessControl.tsx` to `RankList`**
Replace `BarChart` with `RankList` for point stats.
```tsx
import { useAccessData } from '@/api/queries/security'
import RankList from '@/components/ui/RankList'
import ScrollList from '@/components/ui/ScrollList'
import StatusPanel from '@/components/ui/StatusPanel'
import ChartLabel from '@/components/ui/ChartLabel'

export default function AccessControl() {
  const { data, isLoading, error } = useAccessData()
  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return <StatusPanel type="empty" />

  const rankItems = data.points.map((p, i) => ({
    id: `point-${i}`,
    name: p.name,
    value: p.value,
    unit: '次',
    color: 'var(--accent)'
  }))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 12px', borderBottom: '1px solid var(--border-light)', paddingBottom: 4 }}>
         <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>今日通行: <span style={{color: 'var(--color-success)', fontWeight: 'bold'}}>{data.todayTotal}</span></div>
         <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>异常记录: <span style={{color: 'var(--color-warning)', fontWeight: 'bold'}}>{data.abnormalRecords.length}</span></div>
      </div>
      <div style={{ flex: 1 }}>
        <ChartLabel>各门禁点通行统计</ChartLabel>
        <RankList items={rankItems} maxHeight={110} />
      </div>
      <div>
        <ChartLabel>异常通行记录</ChartLabel>
        <ScrollList items={data.abnormalRecords.map(r => ({ id: r.id, content: <div style={{display:'flex',justifyContent:'space-between'}}><span>{r.location} · {r.type}</span><span style={{display:'flex',gap:8}}><span style={{fontSize:10,color:'var(--text-muted)'}}>{r.time}</span><span style={{fontSize:10,color:r.status==='已处理'?'var(--color-success)':'var(--color-warning)'}}>{r.status}</span></span></div> }))} maxHeight={80} />
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Commit Security Theme Refactor**
```bash
git add src/themes/security/
git commit -m "refactor: optimize Security panels (CompactStatsRow + RankList)"
```

---

### Task 5: Final Check and Build

- [ ] **Step 1: Check Types and Build**
Run `pnpm tsc --noEmit` and `pnpm build`. Fix any type issues.

- [ ] **Step 2: Commit final fixes**
```bash
git add .
git commit -m "chore: phase 2 final build checks"
```