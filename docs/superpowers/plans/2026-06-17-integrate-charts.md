# Integrate New Charts Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrate Sankey, Sunburst, Funnel, and Radar charts into existing panels.

---

### Task 1: Integrate SankeyChart into StudentInfo

**Files:**
- Modify: `src/themes/overview/panels/StudentInfo.tsx`

- [ ] **Step 1: Replace charts in StudentInfo**
Read `src/themes/overview/panels/StudentInfo.tsx`.
Import `SankeyChart`: `import SankeyChart from '@/components/charts/SankeyChart'` (remove `BarChart` and `RingChart` imports).

Construct Sankey links from `data.grades`:
```tsx
  const sankeyLinks = data.grades.flatMap((g) => [
    { source: '全校学生', target: g.name, value: g.total },
    { source: g.name, target: `男 (${g.name})`, value: g.male },
    { source: g.name, target: `女 (${g.name})`, value: g.female },
  ])
  const categories = ['全校学生', ...data.grades.map(g => g.name), ...data.grades.map(g => `男 (${g.name})`), ...data.grades.map(g => `女 (${g.name})`)]
```

Replace the two `div` chart containers with a single one containing:
```tsx
<SankeyChart data={sankeyLinks} categories={categories} height={220} />
```

- [ ] **Step 2: Verify build**
Run: `pnpm build`

- [ ] **Step 3: Commit**
Commit message: "feat(overview): integrate SankeyChart into StudentInfo panel"

---

### Task 2: Integrate SunburstChart into PersonnelComposition

**Files:**
- Modify: `src/themes/overview/panels/PersonnelComposition.tsx`

- [ ] **Step 1: Replace RingChart with SunburstChart**
Read `src/themes/overview/panels/PersonnelComposition.tsx`.
Import `SunburstChart` instead of `RingChart`.

Transform data (creating a fake hierarchy for the sunburst):
```tsx
  const sunburstData = [
    {
      name: '教职工',
      children: [
        {
          name: '男',
          value: data.maleCount,
        },
        {
          name: '女',
          value: data.femaleCount,
        }
      ]
    },
    {
      name: '学历',
      children: data.education.map(e => ({ name: e.name, value: e.value }))
    }
  ]
```

Replace the `RingChart` component with:
```tsx
<SunburstChart data={sunburstData} height={200} />
```

- [ ] **Step 2: Verify build**
Run: `pnpm build`

- [ ] **Step 3: Commit**
Commit message: "feat(overview): integrate SunburstChart into PersonnelComposition panel"

---

### Task 3: Integrate FunnelChart into ExamManagement

**Files:**
- Modify: `src/themes/academics/panels/ExamManagement.tsx`

- [ ] **Step 1: Replace BarChart with FunnelChart**
Read `src/themes/academics/panels/ExamManagement.tsx`.
Import `FunnelChart` instead of `BarChart`.

In the render logic, replace `<BarChart data={data.scoreDistribution} />` with:
```tsx
<FunnelChart data={data.scoreDistribution} height={200} />
```

- [ ] **Step 2: Verify build**
Run: `pnpm build`

- [ ] **Step 3: Commit**
Commit message: "feat(academics): integrate FunnelChart into ExamManagement panel"

---

### Task 4: Integrate RadarChart into TeacherDistribution

**Files:**
- Modify: `src/themes/overview/panels/TeacherDistribution.tsx`

- [ ] **Step 1: Replace BarChart with RadarChart**
Read `src/themes/overview/panels/TeacherDistribution.tsx`.
Import `RadarChart` instead of `BarChart`.

Transform `data.subjects` for RadarChart:
```tsx
  const maxSubject = Math.max(...data.subjects.map(s => s.value)) + 5
  const indicator = data.subjects.map(s => ({ name: s.name, max: maxSubject }))
  const series = [{ name: '教师人数', value: data.subjects.map(s => s.value) }]
```

Replace `<BarChart data={data.subjects} />` with:
```tsx
<RadarChart indicator={indicator} series={series} height={240} />
```

- [ ] **Step 2: Verify build**
Run: `pnpm build`

- [ ] **Step 3: Commit**
Commit message: "feat(overview): integrate RadarChart into TeacherDistribution panel"

---

### Task 5: Final Verification

- [ ] **Step 1: Test & Build**
Run `pnpm test --run` and `pnpm build`.

- [ ] **Step 2: Commit**
Commit message: "chore: verify tests and build after integrating new charts"
