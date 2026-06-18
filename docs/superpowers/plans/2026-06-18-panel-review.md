# 数据面板全面审查与优化 — 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 对 39 个数据面板做视觉一致性、代码质量和数据完整性全面优化。

**Architecture:** 先横切修复全局共性问题（硬编码颜色→CSS变量、空状态统一、标签组件抽取），再逐专题审查个性问题（视觉填充率、Mock数据合理性、边界情况）。

**Tech Stack:** React 18 + TypeScript, ECharts 5, Zustand, TanStack Query v5, CSS Variables

---

## Phase 1: Cross-Cutting Fixes

### Task 1: Fix StatusPanel error color

**Files:**
- Modify: `src/components/ui/StatusPanel.tsx:9`

**Issue:** Error state uses `var(--color-warning)` but should use `var(--color-danger)`.

- [ ] **Step 1: Fix color**

```tsx
// StatusPanel.tsx line 9
// old:
error: { icon: '⚠️', text: '数据加载失败', color: 'var(--color-warning)' },
// new:
error: { icon: '⚠️', text: '数据加载失败', color: 'var(--color-danger)' },
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ui/StatusPanel.tsx
git commit -m "fix: StatusPanel error state uses color-danger instead of color-warning"
```

---

### Task 2: Create ChartLabel component

**Files:**
- Create: `src/components/ui/ChartLabel.tsx`
- Modify: 39 panel files (replace inline sub-label divs)

**Issue:** 75+ instances of `<div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 2 }}>...</div>` that break light theme.

- [ ] **Step 1: Create ChartLabel component**

```tsx
// src/components/ui/ChartLabel.tsx
interface ChartLabelProps {
  children: React.ReactNode
  align?: 'left' | 'center'
}

export default function ChartLabel({ children, align = 'left' }: ChartLabelProps) {
  return (
    <div style={{
      fontSize: 11,
      color: 'var(--text-tertiary)',
      marginBottom: 4,
      textAlign: align,
    }}>
      {children}
    </div>
  )
}
```

- [ ] **Step 2: Update component barrel export**

Read `src/components/ui/index.ts` or check if it exists, add export for ChartLabel.

- [ ] **Step 3: Replace in ALL panel files**

Replace pattern:
```tsx
<div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 2 }}>标题</div>
```
with:
```tsx
import ChartLabel from '@/components/ui/ChartLabel'
// ...
<ChartLabel>标题</ChartLabel>
```

And pattern:
```tsx
<div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginBottom: 2 }}>标题</div>
```
with:
```tsx
<ChartLabel align="center">标题</ChartLabel>
```

Files to modify (ALL files matching the pattern):
- `src/themes/overview/panels/TeacherDistribution.tsx` (2 instances)
- `src/themes/overview/panels/ActivityHeatmap.tsx` (1 instance)
- `src/themes/overview/panels/StudentInfo.tsx` (1 instance)
- `src/themes/admin/panels/StaffAttendance.tsx` (2 instances)
- `src/themes/admin/panels/MeetingManagement.tsx` (2 instances)
- `src/themes/library/panels/HotBooks.tsx` (3 instances)
- `src/themes/library/panels/BorrowStats.tsx` (none - uses inline chart, OK)
- `src/themes/library/panels/ClassBorrowRank.tsx` (2 instances)
- `src/themes/library/panels/VisitorStats.tsx` (1 instance)
- `src/themes/academics/panels/CourseSchedule.tsx` (3 instances)
- `src/themes/academics/panels/ClassroomUsagePanel.tsx` (3 instances)
- `src/themes/academics/panels/StudentAttendance.tsx` (4 instances)
- `src/themes/academics/panels/ExamManagement.tsx` (4 instances)
- `src/themes/academics/panels/ClassManagement.tsx` (2 instances)
- `src/themes/academics/panels/TeachingDevices.tsx` (2 instances)
- `src/themes/security/panels/MonitorStatus.tsx` (2 instances)
- `src/themes/security/panels/AccessControl.tsx` (2 instances)
- `src/themes/security/panels/StudentLeave.tsx` (3 instances)
- `src/themes/security/panels/VisitorManagement.tsx` (2 instances)
- `src/themes/security/panels/AlertEvents.tsx` (3 instances)
- `src/themes/security/panels/CanteenSafety.tsx` (2 instances)
- `src/themes/teaching-research/panels/TeachingResourcesPanel.tsx` (1 instance)

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/ChartLabel.tsx src/themes/
git commit -m "feat: add ChartLabel component, replace all inline sub-label divs"
```

---

### Task 3: Unify empty-data pattern (return null → StatusPanel empty)

**Files:**
- Modify: ALL 35 panels that use `if (!data) return null`

**Issue:** 29 panels return `null` on empty data, causing panel to collapse to blank. Should show `<StatusPanel type="empty" />`.

- [ ] **Step 1: Replace `return null` with StatusPanel empty in all panels**

In each panel file, change:
```tsx
if (!data) return null
```
to:
```tsx
if (!data) return <StatusPanel type="empty" />
```

Files to modify:
- `src/themes/overview/panels/SchoolInfo.tsx`
- `src/themes/overview/panels/PersonnelComposition.tsx`
- `src/themes/overview/panels/TeacherDistribution.tsx`
- `src/themes/overview/panels/StudentInfo.tsx`
- `src/themes/overview/panels/ActivityHeatmap.tsx`
- `src/themes/admin/panels/AdminOverview.tsx`
- `src/themes/admin/panels/NoticeBoard.tsx`
- `src/themes/admin/panels/DutySchedule.tsx`
- `src/themes/admin/panels/SchoolCalendar.tsx`
- `src/themes/admin/panels/StaffAttendance.tsx`
- `src/themes/admin/panels/MeetingManagement.tsx`
- `src/themes/teaching-research/panels/TeachingResourcesPanel.tsx`
- `src/themes/teaching-research/panels/ResourceStatistics.tsx`
- `src/themes/teaching-research/panels/ResourceUpdates.tsx`
- `src/themes/teaching-research/panels/TeacherTopics.tsx`
- `src/themes/teaching-research/panels/ResearchProjectsList.tsx`
- `src/themes/teaching-research/panels/TeacherStudiosPanel.tsx`
- `src/themes/library/panels/CollectionOverview.tsx`
- `src/themes/library/panels/BorrowStats.tsx`
- `src/themes/library/panels/HotBooks.tsx`
- `src/themes/library/panels/ClassBorrowRank.tsx`
- `src/themes/library/panels/ReadingActivities.tsx`
- `src/themes/library/panels/VisitorStats.tsx`
- `src/themes/academics/panels/TeachingOverview.tsx`
- `src/themes/academics/panels/CourseSchedule.tsx`
- `src/themes/academics/panels/ClassroomUsagePanel.tsx`
- `src/themes/academics/panels/StudentAttendance.tsx`
- `src/themes/academics/panels/ExamManagement.tsx`
- `src/themes/academics/panels/ClassManagement.tsx`
- `src/themes/academics/panels/TeachingDevices.tsx`
- `src/themes/security/panels/SecurityOverview.tsx`
- `src/themes/security/panels/MonitorStatus.tsx`
- `src/themes/security/panels/AccessControl.tsx`
- `src/themes/security/panels/StudentLeave.tsx`
- `src/themes/security/panels/VisitorManagement.tsx`
- `src/themes/security/panels/AlertEvents.tsx`
- `src/themes/security/panels/CanteenSafety.tsx`

- [ ] **Step 2: Commit**

```bash
git add src/themes/
git commit -m "fix: replace `return null` with StatusPanel empty for all data panels"
```

---

### Task 4: Fix hardcoded rgba(255,255,255,...) colors to CSS variables

**Files:**
- Modify: ALL panel files with hardcoded white/light colors

**Issue:** 75+ instances of `rgba(255,255,255,0.X)` hardcoded in style objects. These only work in dark theme.

**Mapping:**
| Hardcoded | Replace with |
|-----------|-------------|
| `rgba(255,255,255,0.85)` | `var(--text-primary)` |
| `rgba(255,255,255,0.7)` | `var(--text-secondary)` |
| `rgba(255,255,255,0.6)` | `var(--text-tertiary)` (in body text context) |
| `rgba(255,255,255,0.5)` | `var(--text-tertiary)` |
| `rgba(255,255,255,0.4)` | `var(--text-tertiary)` |
| `rgba(255,255,255,0.3)` | `var(--text-muted)` |
| `rgba(255,255,255,0.75)` | `var(--text-secondary)` |

- [ ] **Step 1: Replace in remaining panel files (those not already covered by Task 2)**

Files with remaining hardcoded rgba:
- `src/themes/overview/panels/BuildingDetail.tsx` — 4 instances
- `src/themes/overview/panels/RecentActivity.tsx` — 3 instances
- `src/themes/admin/panels/NoticeBoard.tsx` — 3 instances
- `src/themes/admin/panels/DutySchedule.tsx` — 3 instances
- `src/themes/admin/panels/SchoolCalendar.tsx` — 5 instances
- `src/themes/admin/panels/MeetingManagement.tsx` — 3 instances (remaining after Task 2)
- `src/themes/teaching-research/panels/ResourceUpdates.tsx` — 2 instances
- `src/themes/teaching-research/panels/TeacherStudiosPanel.tsx` — 3 instances
- `src/themes/library/panels/ClassBorrowRank.tsx` — 1 instance
- `src/themes/academics/panels/ExamManagement.tsx` — 2 instances (remaining)
- `src/themes/academics/panels/ClassManagement.tsx` — 2 instances
- `src/themes/security/panels/AccessControl.tsx` — 2 instances (remaining)
- `src/themes/security/panels/StudentLeave.tsx` — 2 instances (remaining)
- `src/themes/security/panels/VisitorManagement.tsx` — 2 instances (remaining)
- `src/themes/security/panels/AlertEvents.tsx` — 2 instances (remaining)
- `src/themes/security/panels/CanteenSafety.tsx` — 2 instances (remaining)

For each file, replace all `rgba(255,255,255,0.X)` with the corresponding CSS variable.

- [ ] **Step 2: Replace hardcoded active/inactive colors**

For status color ternary patterns using raw hex/color codes for dark theme only:
```tsx
color: e.status === '进行中' ? '#4a9eff' : e.status === '已完成' ? '#00c853' : 'rgba(255,255,255,0.5)'
```
These are semantic colors and should use CSS variables:
- `#4a9eff` → `var(--accent)`
- `#00c853` → `var(--color-success)`
- `#ff1744` → `var(--color-danger)`
- `#ffc107` → `var(--color-pending)`
- `#ff6d00` → `var(--color-warning)`

- [ ] **Step 3: Commit**

```bash
git add src/themes/
git commit -m "fix: replace hardcoded rgba(255,255,255,...) colors with CSS variables for light-theme compatibility"
```

---

### Task 5: Fix RecentActivity — add SSE hook

**Files:**
- Modify: `src/themes/overview/panels/RecentActivity.tsx`
- Modify: `src/api/queries/overview.ts` (add useRecentActivity hook + type)
- Modify: `src/api/mocks/handlers/overview.ts` (add mock handler)
- Modify: `src/api/mocks/server.ts` (register handler if new file)

- [ ] **Step 1: Add query hook to overview.ts**

```ts
// Add to src/api/queries/overview.ts

export interface RecentActivityItem {
  id: string
  time: string
  title: string
  status: string
}

export const useRecentActivity = () =>
  useQuery<RecentActivityItem[]>({
    queryKey: ['overview', 'recentActivity'],
    queryFn: () => fetchApi<RecentActivityItem[]>('/overview/recent-activity'),
    refetchInterval: REFRESH_INTERVALS.NEAR_REALTIME,
  })
```

- [ ] **Step 2: Add mock handler to existing array**

In `src/api/mocks/handlers/overview.ts`, add a new entry to the existing `overviewHandlers` array BEFORE the closing `]`:

```ts
http.get(`${BASE}/overview/recent-activity`, () => {
  const titles = [
    '校园安保巡查完成', '教学设备巡检正常', '图书馆新书上架',
    '体育馆场地预约', '行政会议已结束', '教职工考勤统计更新',
    '校园活动场地布置中', '食堂食品安全检查通过',
    '校车运行正常', '访客登记系统更新',
  ]
  const statuses = ['已完成', '进行中', '正常']
  const items = Array.from({ length: 12 }, (_, i) => ({
    id: `event-${Date.now()}-${i}`,
    time: `${String(Math.floor(Math.random() * 17) + 6).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
    title: titles[i % titles.length],
    status: statuses[Math.floor(Math.random() * statuses.length)],
  }))
  return HttpResponse.json(items)
}),
```

No changes needed to `src/api/mocks/server.ts` — the handler is automatically included via the existing `overviewHandlers` spread.

- [ ] **Step 3: Rewrite RecentActivity.tsx**

```tsx
import { useRecentActivity } from '@/api/queries/overview'
import ScrollList from '@/components/ui/ScrollList'
import StatusPanel from '@/components/ui/StatusPanel'

export default function RecentActivity() {
  const { data, isLoading, error } = useRecentActivity()

  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data || data.length === 0) return <StatusPanel type="empty" />

  const items = data.map((e) => ({
    id: e.id,
    content: (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>{e.title}</span>
        <span style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{e.time}</span>
          <span style={{
            fontSize: 10,
            color: e.status === '进行中'
              ? 'var(--accent)'
              : e.status === '已完成'
                ? 'var(--color-success)'
                : 'var(--text-tertiary)',
          }}>
            {e.status}
          </span>
        </span>
      </div>
    ),
  }))

  return <ScrollList items={items} maxHeight={200} />
}
```

- [ ] **Step 4: Remove `@faker-js/faker` import from RecentActivity.tsx** (it was only used there)

- [ ] **Step 5: Commit**

```bash
git add src/api/queries/overview.ts src/api/mocks/handlers/overview.ts src/api/mocks/server.ts src/themes/overview/panels/RecentActivity.tsx
git commit -m "feat: add useRecentActivity query hook, replace static faker data in RecentActivity panel"
```

---

### Task 6: Fix BuildingDetail — add StatusPanel states

**Files:**
- Modify: `src/themes/overview/panels/BuildingDetail.tsx`

**Issue:** No loading/error states. Uses hardcoded `rgba(255,255,255,...)` colors.

- [ ] **Step 1: Add StatusPanel import and fix colors**

```tsx
import { useSceneStore } from '@/stores/useSceneStore'
import { BUILDINGS } from '@/components/scene/CampusBase'
import StatusPanel from '@/components/ui/StatusPanel'

export default function BuildingDetail() {
  const selectedId = useSceneStore((s) => s.selectedObjectId)
  const building = BUILDINGS.find((b) => b.id === selectedId)

  if (!building) {
    return <StatusPanel type="empty" message="点击左侧3D场景中的建筑查看详情" />
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 18, fontWeight: 'bold', color: 'var(--accent)', marginBottom: 4 }}>
          {building.label}
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
          {building.info}
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 12, color: 'var(--text-secondary)' }}>
        <div>位置: X{building.position[0].toFixed(0)} Z{building.position[2].toFixed(0)}</div>
        <div>规格: {building.size[0]}m x {building.size[2]}m</div>
        <div>层数: {building.size[1]}层</div>
        <div>风格: 红砖白墙</div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/themes/overview/panels/BuildingDetail.tsx
git commit -m "fix: BuildingDetail uses StatusPanel and CSS variables"
```

---

### Task 7: Verify formatNumber usage across all panels

**Files:**
- Audit: All panels using NumberFlip

**Issue:** NumberFlip already calls `formatNumber` internally, so no issue with NumberFlip usage. But check if any panels render raw numbers without formatNumber.

- [ ] **Step 1: Search for raw number rendering**

Search panels for patterns like `{data.someNumber}` that don't go through NumberFlip or some formatter. Count-based values (人/个/间/册) should use NumberFlip.

- [ ] **Step 2: Fix any found issues, commit**

```bash
git add src/themes/
git commit -m "fix: ensure all large numbers use formatNumber"
```

---

## Phase 2: Per-Theme Review

### Task 8: Review Overview (综合态势) — 7 panels

**Files:**
- `src/themes/overview/panels/SchoolInfo.tsx`
- `src/themes/overview/panels/PersonnelComposition.tsx`
- `src/themes/overview/panels/TeacherDistribution.tsx`
- `src/themes/overview/panels/StudentInfo.tsx`
- `src/themes/overview/panels/ActivityHeatmap.tsx`
- `src/themes/overview/panels/BuildingDetail.tsx`
- `src/themes/overview/panels/RecentActivity.tsx`

- [ ] **Step 1: Visual fill rate check**

Verify:
- SchoolInfo: 2x2 NumberFlip grid — OK, fills panel well
- PersonnelComposition: NumberFlip + Sunburst — check Sunburst height vs panel height
- TeacherDistribution: Radar + Bar dual layout — check chart heights match available space
- StudentInfo: Sankey chart — check chart height uses full panel
- ActivityHeatmap: Line chart — check fills panel
- BuildingDetail: text-only, could add building image or floor indicator
- RecentActivity: ScrollList — OK after Task 5 fix

- [ ] **Step 2: Mock data consistency**

Check overview mock data:
- `useSchoolInfo`: 73亩/8.8万m²/60班 — should be consistent
- `usePersonnelComposition`: totalTeachers should match 60班 × reasonable ratio
- `useTeacherDistribution`: subjects total should ≈ totalTeachers
- `useStudentInfo`: grades total should ≈ 2800

Read handler files and verify.

- [ ] **Step 3: Fix any issues, commit**

```bash
git add src/themes/overview/ src/api/mocks/handlers/overview.ts
git commit -m "fix: overview panels visual and data consistency"
```

---

### Task 9: Review Teaching-Research (教学研究) — 6 panels

**Files:**
- `src/themes/teaching-research/panels/TeachingResourcesPanel.tsx`
- `src/themes/teaching-research/panels/ResourceStatistics.tsx`
- `src/themes/teaching-research/panels/ResourceUpdates.tsx`
- `src/themes/teaching-research/panels/TeacherTopics.tsx`
- `src/themes/teaching-research/panels/ResearchProjectsList.tsx`
- `src/themes/teaching-research/panels/TeacherStudiosPanel.tsx`

- [ ] **Step 1: Visual fill rate**

Verify:
- TeachingResourcesPanel: Treemap — check fills panel
- ResourceStatistics: 4x NumberFlip — check grid layout
- ResourceUpdates: ScrollList — OK
- TeacherTopics: 3x NumberFlip — check spacing
- ResearchProjectsList: CardCarousel — check maxHeight
- TeacherStudiosPanel: 2-col card grid — check scroll behavior if many studios

- [ ] **Step 2: Fix hardcoded rgba in TeacherStudiosPanel**

Line 32: `color: 'rgba(255,255,255,0.85)'` → `color: 'var(--text-primary)'`
Line 43: `color: 'rgba(255,255,255,0.4)'` → `color: 'var(--text-tertiary)'`
Line 26: `background: 'rgba(74,158,255,0.06)'` → `background: 'var(--card-carousel-bg)'` (or keep — this uses accent, not white)

- [ ] **Step 3: Mock data check and commit**

```bash
git add src/themes/teaching-research/
git commit -m "fix: teaching-research panels colors and layout"
```

---

### Task 10: Review Admin (行政办公) — 6 panels

**Files:**
- `src/themes/admin/panels/AdminOverview.tsx`
- `src/themes/admin/panels/NoticeBoard.tsx`
- `src/themes/admin/panels/DutySchedule.tsx`
- `src/themes/admin/panels/SchoolCalendar.tsx`
- `src/themes/admin/panels/StaffAttendance.tsx`
- `src/themes/admin/panels/MeetingManagement.tsx`

- [ ] **Step 1: Visual fill rate**

Verify:
- AdminOverview: 4x NumberFlip — OK
- NoticeBoard: ScrollList — OK
- DutySchedule: 2-col card grid — check overflow
- SchoolCalendar: ScrollList with colored dots — check event type colors
- StaffAttendance: NumberFlip + Bar + Line — check chart heights
- MeetingManagement: NumberFlip + room cards + ScrollList — check layout density

- [ ] **Step 2: Fix DutySchedule hardcoded rgba**

Lines 33, 36: Replace with `var(--text-primary)` and `var(--text-tertiary)`

- [ ] **Step 3: Fix SchoolCalendar event type colors**

Current: `const eventColors = { '教学': '#4a9eff', '行政': '#ffc107', '假期': '#ff1744' }`
→ Use CSS variables: `{ '教学': 'var(--accent)', '行政': 'var(--color-pending)', '假期': 'var(--color-danger)' }`

- [ ] **Step 4: Commit**

```bash
git add src/themes/admin/
git commit -m "fix: admin panels colors and layout"
```

---

### Task 11: Review Library (智慧图书) — 6 panels

**Files:**
- `src/themes/library/panels/CollectionOverview.tsx`
- `src/themes/library/panels/BorrowStats.tsx`
- `src/themes/library/panels/HotBooks.tsx`
- `src/themes/library/panels/ClassBorrowRank.tsx`
- `src/themes/library/panels/ReadingActivities.tsx`
- `src/themes/library/panels/VisitorStats.tsx`

- [ ] **Step 1: Visual fill rate**

Verify:
- CollectionOverview: 4x NumberFlip — OK
- BorrowStats: 2x2 NumberFlip + Line chart — check Line height
- HotBooks: Bar + Pie + CardCarousel — heavy panel, check spacing
- ClassBorrowRank: Bar + ScrollList — OK
- ReadingActivities: CardCarousel only — OK
- VisitorStats: 2x NumberFlip + Bar — OK

- [ ] **Step 2: Fix ClassBorrowRank hardcoded rgba**

Line 25: `color: 'rgba(255,255,255,0.3)'` → `color: 'var(--text-muted)'`

- [ ] **Step 3: Commit**

```bash
git add src/themes/library/
git commit -m "fix: library panels colors"
```

---

### Task 12: Review Academics (智慧教学) — 7 panels

**Files:**
- `src/themes/academics/panels/TeachingOverview.tsx`
- `src/themes/academics/panels/CourseSchedule.tsx`
- `src/themes/academics/panels/ClassroomUsagePanel.tsx`
- `src/themes/academics/panels/StudentAttendance.tsx`
- `src/themes/academics/panels/ExamManagement.tsx`
- `src/themes/academics/panels/ClassManagement.tsx`
- `src/themes/academics/panels/TeachingDevices.tsx`

- [ ] **Step 1: Visual fill rate**

Verify:
- TeachingOverview: 4x NumberFlip — OK
- CourseSchedule: Bar + Pie + Heatmap — heavy, check each chart height
- ClassroomUsagePanel: NumberFlip + Bar + Gauge + Pie — check layout density
- StudentAttendance: Gauge + Bar + Bar + Line — check chart heights
- ExamManagement: ScrollList + NumberFlip + Bar + Funnel — most complex, verify
- ClassManagement: NumberFlip + Bar + ScrollList — check spacing
- TeachingDevices: Ring + Pie — OK

- [ ] **Step 2: Fix ExamManagement hardcoded rgba**

Lines 17, 24, 35, 39: Already handled by Task 2 (ChartLabel component)

- [ ] **Step 3: Fix ClassManagement hardcoded rgba**

Lines 30, 31: Replace with `var(--text-muted)`

- [ ] **Step 4: Commit**

```bash
git add src/themes/academics/
git commit -m "fix: academics panels colors and layout"
```

---

### Task 13: Review Security (智慧安防) — 7 panels

**Files:**
- `src/themes/security/panels/SecurityOverview.tsx`
- `src/themes/security/panels/MonitorStatus.tsx`
- `src/themes/security/panels/AccessControl.tsx`
- `src/themes/security/panels/StudentLeave.tsx`
- `src/themes/security/panels/VisitorManagement.tsx`
- `src/themes/security/panels/AlertEvents.tsx`
- `src/themes/security/panels/CanteenSafety.tsx`

- [ ] **Step 1: Visual fill rate**

Verify:
- SecurityOverview: 4x NumberFlip — OK
- MonitorStatus: Ring + Gauge + Bar — check layout
- AccessControl: NumberFlip + Bar + ScrollList — OK
- StudentLeave: NumberFlip + Pie + Bar + ScrollList — check
- VisitorManagement: NumberFlip + Pie + ScrollList — OK
- AlertEvents: NumberFlip + Pie + Ring + ScrollList — check spacing
- CanteenSafety: NumberFlip + Bar + button + ScrollList + VideoWindow — check

- [ ] **Step 2: Fix AlertEvents setInterval cleanup**

Verify useAlertData is called before guards (it is — on line 11, before line 29). OK.

Verify useEffect cleanup works (line 26: `return () => clearInterval(timer)`). OK.

Add cleanup for SSR safety: add `if (typeof window === 'undefined') return` guard in useEffect.

- [ ] **Step 3: Fix CanteenSafety button colors in light theme**

`background: 'rgba(74,158,255,0.08)'` → replace with CSS variable approach or use accent-rgb.

- [ ] **Step 4: Commit**

```bash
git add src/themes/security/
git commit -m "fix: security panels colors and layout"
```

---

### Task 14: Final verification — build + tests

- [ ] **Step 1: Run build**

```bash
pnpm build
```
Expected: no errors.

- [ ] **Step 2: Run tests**

```bash
pnpm test
```
Expected: all 35 unit + 8 E2E tests pass.

- [ ] **Step 3: Run lint**

```bash
pnpm lint
```
Expected: no errors (or only pre-existing warnings).

- [ ] **Step 4: Fix any issues and commit**

```bash
git add .
git commit -m "chore: final verification fixes"
```

---

### Task 15: Write review report

**Files:**
- Create: `docs/superpowers/specs/panel-review-report.md`

- [ ] **Step 1: Write report**

Summarize all findings organized by:
1. Visual/UX consistency issues found & fixed
2. Code quality improvements made
3. Data completeness issues found & fixed
4. Remaining issues (if any)

- [ ] **Step 2: Commit**

```bash
git add docs/superpowers/specs/panel-review-report.md
git commit -m "docs: add panel review report"
```
