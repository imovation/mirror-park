# Panel Space Utilization — Consolidated Audit & Fix Plan

## Overview

168 issues across 6 themes, 11 shared components, 39 panels. Below is the synthesis: root causes → priority categories → simplest fixes.

---

## 1. Root Cause Analysis

Only **4 root causes** produce all 10 pattern categories.

### RC1: Panel sizing is intrinsic, not flex-grow (produces Patterns 1, 2, 9)

**Chain of causation**:
```
SidePanel: flex column, height:100%, NO gap
  └── DashboardPanel: flex column, NO flex:1/0 (default = flex: 0 1 auto)
        └── Content area: flex-1 (this works, but its parent doesn't stretch)
```

- `SidePanel` (`src/components/layout/SidePanel.tsx:9-12`) is a `flex-direction: column` with `height: 100%`, but its children (`DashboardPanel`) have no `flex` property. Without `flex: 1 1 0`, each panel takes its intrinsic height.
- 3 panels in a column that has ~700px available → panels render at ~150/140/120px → 300px of empty space at the bottom.
- The `marginBottom: 6` on `DashboardPanel` (line 16) is the *only* spacing; there's no `gap` on the container. The last panel's 6px bottom margin is wasted.

**Affects**: Patterns 1 (panels don't grow), 2 (no gap, margin-only spacing), 9 (short panels with 50%+ waste).

### RC2: Chart/SwimLane heights are hardcoded px (produces Patterns 3, 4, 10)

**Chain of causation**:
- Every chart component signature: `height = 200` default, passed as `<ReactECharts style={{ height, width: '100%' }}>`.
- Call sites override with specific numbers (75, 80, 90, 100, 120, 130, 140, 150, 200, 220).
- Even when the DashboardPanel content area grows (via `flex-1`), charts stay at their hardcoded px height.
- `ScrollList` takes `maxHeight` prop; call sites pass hardcoded values (80–200), never computed from container.
- Panel-internal height ratios are consistent across call sites (e.g. TeacherDistribution always 140+75), but the absolute values are arbitrary and don't scale.

**Root**: No `useResizeObserver` / container query / percentage heights anywhere. Every component is "I know how tall I am" rather than "I fill what I'm given."

### RC3: Color tokens are under-used (produces Pattern 5)

**Available CSS variables**: `--accent` (`#4a9eff`), `--color-success` (`#00c853`), `--color-warning` (`#ff6d00`), `--color-danger` (`#ff1744`), `--color-pending` (`#ffc107`), plus `--accent-rgb` for rgba() constructions.

Hardcoded hex duplicates of these exact colors appear in:
| Color | Token exists | # of hardcoded uses |
|-------|-------------|---------------------|
| `#4a9eff` | `--accent` | 18 (NumberFlip + charts) |
| `#00c853` | `--color-success` | 14 |
| `#ff6d00` | `--color-warning` | 6 |
| `#ff1744` | `--color-danger` | 5 |
| `#ffc107` | `--color-pending` | 4 |
| `#aa00ff` | (none) | 5 |
| `#e74c3c`, `#00bcd4`, `#ff80ab` | (none) | 3 |

**Severity**: Light theme breaks — all 48 hardcoded hex values will remain dark in light mode because they bypass CSS variable switching. Only `StudentInfo.tsx:30-31` mixes both `var(--text-*)` and hardcoded hex within the same inline style block.

### RC4: Dead/unreachable paths from renderPanel/parents mismatch (produces Pattern 6)

Three theme index files import and handle a panel in their `renderPanel` switch but never list it in their `panels.{left,right}` array. These panels have no UI path to render:

| Theme | Panel Component | Switch case | In panels array? |
|-------|----------------|-------------|-------------------|
| Admin | `AdminOverview` | `admin-overview` | No |
| Security | `SecurityOverview` | `sec-overview` | No |
| Academics | `TeachingOverview` | `acad-overview` | No |

Plus: `CollectionOverview.tsx` exists at `src/themes/library/panels/` but is never imported by `src/themes/library/index.tsx` — purely dead file (18 lines, `useCollection` query, rendering 4 NumberFlip cards).

---

## 2. Issue Prioritization

### CRITICAL (must fix — functional breakage)

| # | Issue | Root | Fix location |
|---|-------|------|-------------|
| C1 | Panels don't fill column height → 30–50% wasted space on all themes | RC1 | SidePanel + DashboardPanel |
| C2 | Light theme broken for 48 hardcoded hex colors | RC3 | 12 panel files + NumberFlip |

### IMPORTANT (degraded UX / technical debt)

| # | Issue | Root | Fix location |
|---|-------|------|-------------|
| I1 | Charts don't scale to container → mismatched sizes on resize/zoom | RC2 | 11 chart components |
| I2 | ScrollList maxHeight doesn't grow with panel | RC2 | ScrollList + call sites |
| I3 | NumberFlip `fontSize: 28` raw px | RC3 | NumberFlip.tsx:55 |
| I4 | `overflow: hidden` clips multi-chart panels silently | — | DashboardPanel.tsx:50 |
| I5 | SidePanel has no `gap` — marginBottom-only spacing → 6px waste on last item | RC1 | SidePanel.tsx |

### MINOR (code health / maintainability)

| # | Issue | Root | Fix location |
|---|-------|------|-------------|
| M1 | 4 dead/inaccessible panel files | RC4 | 4 index.tsx files |
| M2 | Chart height ratios vary: TeacherDistribution 140/75 (1.87:1), ClassroomUsage 80/80 (1:1) | RC2 | Individual panels |
| M3 | `aa00ff` / `e74c3c` / `00bcd4` / `ff80ab` — no CSS token mapping | RC3 | index.css + panels |

---

## 3. Optimization Approach — Simplest Fix Per Root Cause

### Fix RC1: Make panels distribute space with SidePanel `gap`

**Step 1** — `SidePanel.tsx` (1 line change):
```
gap: 'var(--panel-gap, 6px)'
```
…added to the existing style object on line 9. Register `--panel-gap: 6px` in `index.css` alongside other CSS variables so both themes can override.

**Step 2** — `DashboardPanel.tsx` (1 line change):
Remove `marginBottom: 6` from line 16. The gap is now the container's job.

**Step 3** — Make 1 panel per column grow to fill:
The simplest approach: **don't**. If you set `flex: 1` on every `DashboardPanel`, all 3 panels would grow equally — wrong behavior. The real solution is: keep `SidePanel` columns scrollable (they already are via ScreenLayout `overflow: auto`), optionally add `flex-grow: 1` to the **last** DashboardPanel in each column only when content is too short.

Simpler alternative — **no JS change**: Just set `justify-content: flex-start` (already default) and let panels render at intrinsic height. The "empty space" at bottom is acceptable on a big-screen dashboard — users expect this behavior. The real problem is panels with 1-2 rows of content; those need more internal visual fill, not column-level stretching.

**Recommended**: Keep column layout as-is (intrinsic sizing), fix panel *internal* fill via RC2 (chart resize). This avoids risking content distortion from forced flex-grow.

### Fix RC2: Make charts height-adaptive via container query or 100%

**Option A (simplest)** — Change all chart components:
```tsx
// Before:
style={{ height, width: '100%' }}
// After:
style={{ height: '100%', width: '100%' }}
```
This requires the parent container to have an explicit height, which currently it does not. This is a breaking path — would require restructuring every panel to use `flex: 1` containers with height.

**Option B (recommended)** — Add `observer` wrapper around ReactECharts:
```tsx
// Wrap in a ResizeObserver that passes computed height to ECharts
<EChartsResponsive height={200} style={{ width: '100%' }}>
```
A single 20-line wrapper (`EChartsResponsive`) that takes a `minHeight` and scales to fill available space. Swap all 11 chart components to delegate sizing to this wrapper.

This is a medium effort: touch 11 chart files + verify ~30 panel call sites don't break visually.

**Option C (pragmatic)** — Do nothing on chart heights. They already render correctly in their default sizes. Only fix:
1. Panels with wildly mismatched internal proportions (TeacherDistribution 140/75, ClassroomUsage 80/80)
2. ScrollList maxHeight → use `min(MAX, calc-size(available))` via a simple ResizeObserver hook

### Fix RC3: Replace hardcoded hex with CSS variables

**NumberFlip** — Already uses `var(--accent)` as default. The hardcoded hexes are in call sites. Fix: change callers from `color="#4a9eff"` to `color="var(--accent)"`, `#00c853` → `var(--color-success)`, `#ffc107` → `var(--color-pending)`, `#ff1744` → `var(--color-danger)`.

**Panel colors map** — Standardized mapping table for all 12 panel files:
| Hardcoded hex | Replace with |
|--------------|-------------|
| `#4a9eff` | `var(--accent)` |
| `#00c853` | `var(--color-success)` |
| `#ff6d00` | `var(--color-warning)` |
| `#ff1744` | `var(--color-danger)` |
| `#ffc107` | `var(--color-pending)` |
| `#aa00ff` | Add `--color-purple: #aa00ff` to index.css |
| `#e74c3c` | Map to `var(--color-danger)` or add `--color-red: #e74c3c` |
| `#00bcd4` | Add `--color-cyan: #00bcd4` to index.css |
| `#ff80ab` | Add `--color-pink: #ff80ab` to index.css |

For chart `colors` prop arrays (RingChart, PieChart), the fix is simple string replacement.

For light theme (colors that need different light-mode values): the accent and semantic colors already have light variants in index.css. New colors (`--color-purple`, `--color-cyan`, `--color-pink`) need light variants too — pick a darker/warmer variant for light backgrounds.

**NumberFlip fontSize**: Change line 55 from `fontSize: 28` to `fontSize: 'var(--font-size-number, 1.75rem)'`. This should be fine since AGENTS.md says all components are rem-based; we just register the variable.

### Fix RC4: Remove dead code or integrate it

**Cleanup options** (pick one):

A) **Wire the panel in**: Add `{ id: 'admin-overview', title: '行政概况' }` to admin `panels.left` or `panels.right`. Same for `sec-overview` and `acad-overview`. Import `CollectionOverview` in library `index.tsx` and add it to `panels.left`. This makes them reachable.

B) **Remove**: Delete the 4 dead files, remove their imports and switch cases from the 4 index.tsx files.

C) **Hybrid**: Wire the 3 overview panels in (they're useful landing views), delete `CollectionOverview.tsx` (it's just 4 NumberFlips — trivial content).

---

## 4. Theme-Specific Notes

### Overview
- `ActivityHeatmap` at `height={220}` in a panel with no other content — fine.
- `TeacherDistribution` has two BarCharts (140px + 75px) → unbalanced 2:1 ratio. Consider making 1:1 (~each 100px) since both show categorical counts.

### Teaching Research
- `TeacherStudiosPanel` has 8 hardcoded subject colors (line 5-12). This is the most complex color fix because these are semantic-to-subject mappings (语文=red, 数学=blue, etc). Best approach: add `--color-subject-chinese`, `--color-subject-math`, etc. to index.css, or use a `SUBJECT_COLORS` const object that references `var(--*)` tokens.
- `TeacherTopics` is a thin panel — 2 NumberFlips + 2 micro-charts. Could add a ScrollList of recent topics to improve visual fill.

### Admin
- `StaffAttendance` has 6 small elements (3 NumberFlips + BarChart + LineChart + GaugeChart) crammed into one panel — highest clipping risk from `overflow: hidden`. Consider splitting into two panels.
- `DutySchedule` has only a ScrollList — very light panel. Could add a NumberFlip header showing "今日值班人次".
- `MeetingManagement` has hardcoded colors in NumberFlip calls.

### Library
- `HotBooks` has `overflow: hidden` risk — BarChart (110px) + PieChart (100px) + ScrollList (maxHeight 90) = 300px minimum. Will clip on smaller resolutions.
- `CollectionOverview.tsx` is dead file (not imported). See RC4.

### Academics
- `ExamManagement` has BarChart(100) + FunnelChart(200) + ScrollList(maxHeight 80) — moderate clipping risk.
- `ClassroomUsagePanel` has BarChart(80) + Gauge(90) + PieChart(80) → all undersized. Each chart under 100px loses label readability. Bump minimum to 100px.
- `ClassManagement` BarChart height=90 is borderline.

### Security
- 7 hardcoded hexes in 4 files: VisitorManagement, AlertEvents, MonitorStatus, CanteenSafety. Simple token substitution per RC3.
- `MonitorStatus` RingChart centerLabel fill is `#4a9eff` (hardcoded) — needs `var(--accent)`.
- `AlertEvents` PieChart with hardcoded `colors` array — simple replacement.
- `CanteenSafety` NumberFlip + BarChart + ScrollList — moderate clipping risk.

---

## 5. Implementation Order (Recommended)

```
Phase 1 (CRITICAL, ~2h):
  1. Add CSS variables for missing colors (--color-purple, --color-cyan, --color-pink, --font-size-number)
  2. Replace all 48 hardcoded hex values in 12 panel files with var(--*) tokens
  3. Fix NumberFlip fontSize: 28 → var(--font-size-number)

Phase 2 (IMPORTANT, ~3h):
  4. Add `gap` to SidePanel, remove marginBottom from DashboardPanel
  5. Build EChartsResponsive wrapper, swap 11 chart components
  6. ScrollList: add ResizeObserver for dynamic maxHeight
  7. Change DashboardPanel content area: overflow:hidden → overflow:auto

Phase 3 (MINOR, ~1h):
  8. Clean dead panel code (4 files)
  9. Rebalance chart height ratios in TeacherDistribution, ClassroomUsagePanel, ClassManagement

Total: ~6h engineering effort
```
