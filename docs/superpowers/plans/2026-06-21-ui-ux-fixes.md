# UI/UX Audit Fixes Implementation Plan

> **For agentic workers:** Use superpowers:subagent-driven-development to implement this plan. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Fix all ~35 UI/UX issues identified in `docs/UI_UX_AUDIT.md` across 7 themes' data panels, CSS design system, and chart components.

**Architecture:** Three workstreams: (1) Core design system (CSS + shared components), (2) Per-theme panel fixes, (3) Hardcoded hex cleanup.

**Tech Stack:** React 18, TypeScript, ECharts 5 (RingChart/BarChart), TailwindCSS, Zustand

---

## Workstream A: Core Design System & Shared Components

### Task A1: RingChart center text clipping fix

**File:** `src/components/charts/RingChart.tsx`

- [ ] **Change radius** from `['50%', '75%']` to `['38%', '62%']` (inner 38% → more space for text)
- [ ] **Auto-size centerLabel**: if string length > 5, reduce fontSize by factor 0.7

### Task A2: Bottom bar light mode visibility

**File:** `src/index.css`

- [ ] Change light mode `--bottombar-bg` from `rgba(0,0,0,0.05)` to `rgba(255,255,255,0.85)` and add `border-top: 1px solid var(--border)`

**File:** `src/components/layout/BottomBar.tsx`

- [ ] Add `text-shadow: '0 1px 2px rgba(0,0,0,0.3)'` to the left span in dark mode only

### Task A3: Text-muted contrast improvement

**File:** `src/index.css`

- [ ] Dark mode `--text-muted`: `rgba(255,255,255,0.45)` → `rgba(255,255,255,0.55)`

### Task A4: BarChart adaptive labels

**File:** `src/components/charts/BarChart.tsx`

- [ ] Auto-hide data labels when height < 150: `showLabel && height < 150 ? undefined : label`
- [ ] Add `fontSize: clamp(10px, 0.7rem, 12px)` fallback

### Task A5: DashboardPanel collapse button margin

**File:** `src/components/ui/DashboardPanel.tsx`

- [ ] Add `marginLeft: 'auto'` to the collapse button container

### Task A6: ChartLegend spacing

**File:** `src/config/chartTheme.ts`

- [ ] Increase `grid.bottom` to account for bottom legends

### Task A7: NumberFlip pause on equal value

**File:** `src/components/ui/NumberFlip.tsx`

- [ ] Add `useRef` to track previous value; skip animation if unchanged

---

## Workstream B: Per-Theme Panel Fixes

### Task B1: Overview theme

**Files:**
- `src/themes/overview/panels/AssetOverview.tsx`
- `src/themes/overview/panels/FacultyPanorama.tsx`
- `src/themes/overview/panels/ActivityTimeStats.tsx`
- `src/themes/overview/panels/RoomDistribution.tsx`
- `src/themes/overview/panels/StudentInfo.tsx`

- [ ] **AssetOverview**: Add `minHeight: 0` + `overflow: 'auto'` to the 3x2 grid container to prevent text clipping
- [ ] **FacultyComposition**: Remove the 3-stat-card row (numbers are redundant with RingChart center)
- [ ] **FacultyStructure**: Increase grid.bottom to 20% for X-axis label space
- [ ] **StudentInfo**: Move grade comparison BarChart above 3-grade sub-card; wrap sub-cards in 1x3 grid
- [ ] **RoomDistribution**: Add `barMinHeight: 4` and increase label fontSize
- [ ] **ActivityTimeStats**: Fix stat card colors to use var(--accent) for peak hour highlight

### Task B2: Teaching-research theme

**Files:**
- `src/themes/teaching-research/panels/ResourceUpdates.tsx`
- `src/themes/teaching-research/panels/TeacherTopics.tsx`
- `src/themes/teaching-research/index.tsx`

- [ ] **ResourceUpdates**: Remove 4-stat-card row (duplicates with ResourceStats); change "—" placeholder to "近期更新" section
- [ ] **TeacherTopics**: RingChart legend position to bottom; BarChart shared X-axis
- [ ] **index.tsx**: Adjust panel heights

### Task B3: Admin theme

**Files:**
- `src/themes/admin/panels/NoticeBoard.tsx`
- `src/themes/admin/panels/MeetingManagement.tsx`
- `src/themes/admin/panels/CalendarEvents.tsx`
- `src/themes/admin/panels/StaffAttendance.tsx`

- [ ] **NoticeBoard**: Increase maxHeight or add more items; remove "—" placeholder
- [ ] **MeetingManagement**: Grid 1x5 instead of 2-col for room status
- [ ] **CalendarEvents**: Fix color legend to match list item colors
- [ ] **StaffAttendance**: Add 8 departments (complete list) for bar chart

### Task B4: Library theme

**Files:**
- `src/themes/library/panels/BorrowStats.tsx`
- `src/themes/library/panels/BookRank.tsx`
- `src/themes/library/panels/ReadingStars.tsx`
- `src/themes/library/panels/LibraryActivity.tsx`
- `src/themes/library/panels/LibraryEntry.tsx`

- [ ] **BookRank**: Stack 2 bar charts vertically instead of side-by-side; wider bars
- [ ] **ReadingStars**: Add section divider between reading stars and book recommendations
- [ ] **LibraryEntry**: 2 charts side-by-side instead of stacked

### Task B5: Academics theme

**Files:**
- `src/themes/academics/panels/ScheduleSpace.tsx`
- `src/themes/academics/panels/StudentAttendance.tsx`
- `src/themes/academics/panels/AttendanceAndSpace.tsx`
- `src/themes/academics/panels/ExamManagement.tsx`

- [ ] **ScheduleSpace**: Share X-axis between 2 bar charts; increase label display
- [ ] **StudentAttendance**: Different colors for 3 stats (today=accent, grade=success, 30d=muted)
- [ ] **AttendanceAndSpace**: Simplify — reduce to 2 charts, remove "实时冲突"

### Task B6: Security theme

**Files:**
- `src/themes/security/panels/MonitorStatus.tsx`
- `src/themes/security/panels/AccessControl.tsx`
- `src/themes/security/panels/SecurityOverview.tsx`
- `src/themes/security/panels/SecurityAlerts.tsx`

- [ ] **MonitorStatus**: Increase Gauge fontSize; increase BarChart label to 12px
- [ ] **SecurityOverview**: StatCard colors match data (danger for alerts, success for processed)
- [ ] **SecurityAlerts**: Add tooltip for "140%↑"同比 value
- [ ] **AccessControl**: Fix mock data to be consistent

### Task B7: Logistics theme

**Files:**
- `src/themes/logistics/panels/LogisticsLeave.tsx`
- `src/themes/logistics/panels/DormManagement.tsx`
- `src/themes/logistics/panels/LogisticsVisitors.tsx`
- `src/themes/logistics/panels/LogisticsCanteen.tsx`

- [ ] **LogisticsLeave**: Reduce to 3 stat cards (remove 病假占比 or merge with trend)
- [ ] **DormManagement**: Add `whiteSpace: 'nowrap'` to NumberFlip label
- [ ] **LogisticsVisitors**: PieChart → RingChart for consistency; add center total
- [ ] **LogisticsCanteen**: Add `maxHeight: 200px + overflowY: auto` to safety check grid to prevent overflow

---

## Workstream C: Hardcoded Hex Cleanup

### Task C1: Replace hardcoded hex colors with CSS variables

**Files to fix:**
- `src/themes/admin/panels/NoticeBoard.tsx` — `'#4a9eff', '#00c853', '#ff6d00', '#ff1744'`
- `src/themes/teaching-research/panels/ResourceUpdates.tsx` — `color: '#fff'`
- `src/themes/library/panels/ReadingStars.tsx` — `color: '#fff'`
- `src/themes/security/SecurityScene.tsx` — `color: '#fff', background: 'rgba(255,23,68,0.9)'`
- `src/themes/logistics/panels/LogisticsCanteen.tsx` — `rgba(0,200,83,0.08)`, `rgba(74,158,255,0.08)`, `rgba(250,173,20,0.08)`

- [ ] Replace with `var(--accent)`, `var(--color-success)`, `var(--color-warning)`, `var(--color-danger)` etc.
- [ ] Replace rgba backgrounds with their CSS variable equivalents

---

### Task C2: Add CSS chart color variables

**File:** `src/index.css`

- [ ] Add `--color-chart-1` through `--color-chart-8` matching `chartTheme.ts` dark/light values

---

## Verification

- [ ] `pnpm build` — must pass with 0 errors
- [ ] `pnpm test` — all 248+ tests pass
- [ ] `pnpm test:e2e` — all 80+ e2e tests pass
- [ ] Visual: Open dev server, verify each theme for layout issues
