# 面板集成测试 Phase 4 — 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 补齐 35 个剩余数据面板的集成测试（6 个主题文件 + 1 个 TopMetrics 文件），验证数据→渲染全链路

**Architecture:** 按主题分 6 个测试文件 + 1 个 TopMetrics 文件。每个面板 2 个测试（有数据渲染 + 空数据兜底），使用 `fillQueryCache(qc, key, data)` + `renderWithProviders` + `waitFor` 断言关键文本。TopMetrics 的 6 个组件单独一个文件。

**Tech Stack:** Vitest + Testing Library + TanStack Query (cache injection)

---

## Task 1: Overview panels (3 remaining)

**Files:** Create `src/__tests__/integration/overview-panels.test.tsx`

```tsx
// src/__tests__/integration/overview-panels.test.tsx
import { renderWithProviders, screen, waitFor } from '@/__tests__/test-utils'
import { QueryClient } from '@tanstack/react-query'

import StudentInfo from '@/themes/overview/panels/StudentInfo'
import RoomDistribution from '@/themes/overview/panels/RoomDistribution'
import ActivityTimeStats from '@/themes/overview/panels/ActivityTimeStats'

function fillQueryCache(qc: QueryClient, key: string[], data: unknown) {
  qc.setQueryData(key, data)
}

function createQC() {
  return new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } })
}

describe('Overview Panel Integration', () => {
  describe('StudentInfo', () => {
    it('renders grade data when loaded', async () => {
      const qc = createQC()
      fillQueryCache(qc, ['overview', 'studentInfo'], {
        grades: [
          { name: '初一', male: 480, female: 450, total: 930 },
          { name: '初二', male: 470, female: 460, total: 930 },
          { name: '初三', male: 460, female: 480, total: 940 },
        ],
        totalStudents: 2800, maleRatio: 0.5, femaleRatio: 0.5,
      })
      renderWithProviders(<StudentInfo />, { queryClient: qc })
      await waitFor(() => {
        expect(screen.getByText(/初一/)).toBeInTheDocument()
        expect(screen.getByText('年级人数对比')).toBeInTheDocument()
      })
    })

    it('shows empty state when no data', async () => {
      const qc = createQC()
      renderWithProviders(<StudentInfo />, { queryClient: qc })
      await waitFor(() => {
        expect(screen.getByText('暂无数据')).toBeInTheDocument()
      })
    })
  })

  describe('RoomDistribution', () => {
    it('renders room data when loaded', async () => {
      const qc = createQC()
      fillQueryCache(qc, ['overview', 'rooms'], {
        rooms: [{ name: '普通教室', count: 60 }, { name: '实验室', count: 8 }],
      })
      renderWithProviders(<RoomDistribution />, { queryClient: qc })
      await waitFor(() => {
        expect(screen.getByText('功能室分布')).toBeInTheDocument()
      })
    })

    it('shows empty state when no data', async () => {
      const qc = createQC()
      renderWithProviders(<RoomDistribution />, { queryClient: qc })
      await waitFor(() => {
        expect(screen.getByText('暂无数据')).toBeInTheDocument()
      })
    })
  })

  describe('ActivityTimeStats', () => {
    it('renders activity data when loaded', async () => {
      const qc = createQC()
      fillQueryCache(qc, ['overview', 'activity'], {
        hours: ['08:00', '09:00', '10:00'],
        values: [120, 2600, 3800],
      })
      renderWithProviders(<ActivityTimeStats />, { queryClient: qc })
      await waitFor(() => {
        expect(screen.getByText('各时段活跃度')).toBeInTheDocument()
      })
    })

    it('shows empty state when no data', async () => {
      const qc = createQC()
      renderWithProviders(<ActivityTimeStats />, { queryClient: qc })
      await waitFor(() => {
        expect(screen.getByText('暂无数据')).toBeInTheDocument()
      })
    })
  })
})
```

Run: `npx vitest run -- -t "Overview Panel Integration"` — expect 6 pass.  
Commit.

---

## Task 2: Teaching-Research panels (6)

**Files:** Create `src/__tests__/integration/teaching-research-panels.test.tsx`

Read each panel source to get exact query hook names and visible text, then write tests following the same pattern as Task 1.

**Panels:** TeachingResourcesPanel, ResourceStatistics, ResourceUpdates, TeacherTopics, ResearchProjectsList, TeacherStudiosPanel

Each panel needs:
1. `fillQueryCache(qc, queryKey, mockData)` with data matching the MSW handler shape
2. `renderWithProviders(<Panel />, { queryClient: qc })`
3. `waitFor(() => expect(screen.getByText('...')).toBeInTheDocument())`
4. 2nd test: empty/no data → StatusPanel '暂无数据'

---

## Task 3: Admin panels (5)

**Files:** Create `src/__tests__/integration/admin-panels.test.tsx`

**Panels:** NoticeBoard, DutySchedule, SchoolCalendar, StaffAttendance, MeetingManagement

Same pattern as Task 1.

---

## Task 4: Library panels (3)

**Files:** Create `src/__tests__/integration/library-panels.test.tsx`

**Panels:** BookBorrowRank, ReadingActivities, VisitorStats

Note: BookBorrowRank uses 2 query hooks (`useHotBooks` and `useClassRank`) — need `fillQueryCache` for both query keys.

---

## Task 5: Academics panels (4)

**Files:** Create `src/__tests__/integration/academics-panels.test.tsx`

**Panels:** ScheduleSpace (uses `useScheduleData` + `useClassroomUsage`), StudentAttendance, ExamManagement, TeachingDevices

---

## Task 6: Security panels (6)

**Files:** Create `src/__tests__/integration/security-panels.test.tsx`

**Panels:** MonitorStatus, AccessControl, StudentLeave, VisitorManagement, AlertEvents, CanteenSafety

Note: AlertEvents has an `addAlert` side effect in `useEffect` — the test needs to handle this gracefully.

---

## Task 7: TopMetrics components (6)

**Files:** Create `src/__tests__/integration/top-metrics.test.tsx`

Test all 6 TopMetrics components:
- OverviewTopMetrics, TeachingResearchTopMetrics, AdminTopMetrics
- LibraryTopMetrics, AcademicsTopMetrics, SecurityTopMetrics

Each uses a top-level query hook. Test pattern:
1. fillQueryCache → render → wait for text
2. No data → StatusPanel

---

## Task 8: Verification

- [ ] **Step 1: Run all tests**

```bash
pnpm test
```

Expected: previously 172 plus ~70 new for panels = ~242 tests pass.

- [ ] **Step 2: Update docs**

```bash
git add AGENTS.md docs/PROJECT_STATUS.md
git commit -m "docs: update test counts after panel integration tests"
```

---

## Summary

| Task | File | Panels | Est. Cases |
|------|------|--------|-----------|
| 1 | overview-panels.test.tsx | 3 | 6 |
| 2 | teaching-research-panels.test.tsx | 6 | 12 |
| 3 | admin-panels.test.tsx | 5 | 10 |
| 4 | library-panels.test.tsx | 3 | 6 |
| 5 | academics-panels.test.tsx | 4 | 8 |
| 6 | security-panels.test.tsx | 6 | 12 |
| 7 | top-metrics.test.tsx | 6 | 12 |
| 8 | Verification | — | — |
| **Total** | **7 files** | **35 panels** | **~70 cases** |
