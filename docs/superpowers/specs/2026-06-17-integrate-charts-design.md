# Integrate New Charts — Design Doc

## Overview
Integrate the 4 newly created ECharts components (Sankey, Sunburst, Funnel, Radar) into existing dashboard panels to showcase their value and improve data visualization.

## Integrations

### 1. SankeyChart in `StudentInfo` (Overview Theme)
- **Target File**: `src/themes/overview/panels/StudentInfo.tsx`
- **Current Chart**: Two charts (BarChart for grades, RingChart for gender)
- **New Chart**: `SankeyChart` showing the flow: `全校总数` → `各年级` → `男女生`
- **Data Transformation**: Map the `grades` data from `useStudentInfo` into Sankey nodes and links.

### 2. SunburstChart in `PersonnelComposition` (Overview Theme)
- **Target File**: `src/themes/overview/panels/PersonnelComposition.tsx`
- **Current Chart**: `RingChart` for education
- **New Chart**: `SunburstChart` replacing the `RingChart`.
- **Data Transformation**: Build a hierarchical tree. Root → Gender (`男`/`女`) → Education (`本科`/`硕士` etc.). For simplicity, we can just use the education data if gender breakdown per education isn't available, or construct a 2-level mock hierarchy.

### 3. FunnelChart in `ExamManagement` (Academics Theme)
- **Target File**: `src/themes/academics/panels/ExamManagement.tsx`
- **Current Chart**: `BarChart` for score distribution
- **New Chart**: `FunnelChart` replacing the BarChart.
- **Data Transformation**: Pass `data.scoreDistribution` directly to `FunnelChart`.

### 4. RadarChart in `TeacherDistribution` (Overview Theme)
- **Target File**: `src/themes/overview/panels/TeacherDistribution.tsx`
- **Current Chart**: `BarChart` for subject distribution
- **New Chart**: `RadarChart` replacing the BarChart.
- **Data Transformation**: Convert `subjects` to `RadarIndicator` (with a computed `max` value) and `RadarSeries`.

## Verification
- `pnpm build` succeeds
- All tests pass
- UI looks coherent in both Dark and Light modes.
