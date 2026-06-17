# Ultra-Wide Resolution Adaptation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Adapt layout for ultra-wide resolutions (5760×1080, 7680×1080) by capping side panel width, limiting font growth, and cleaning up unused constants.

**Architecture:** 3 independent file changes — ScreenLayout, index.css, constants.ts.

**Tech Stack:** CSS, React inline styles

---

### Task 1: Cap side panel width + font scaling + cleanup

**Files:**
- Modify: `src/components/layout/ScreenLayout.tsx`
- Modify: `src/index.css`
- Modify: `src/utils/constants.ts`

- [ ] **Step 1: Cap side panel max-width in ScreenLayout**

Read `src/components/layout/ScreenLayout.tsx`. Add `maxWidth: 420` to the left and right panel wrapper `div` style objects.

The left panel div changes from:
```tsx
<div style={{ gridArea: 'left', overflow: 'auto' }}>{leftPanel}</div>
```
to:
```tsx
<div style={{ gridArea: 'left', overflow: 'auto', maxWidth: 420 }}>{leftPanel}</div>
```

The right panel div changes from:
```tsx
<div style={{ gridArea: 'right', overflow: 'auto' }}>{rightPanel}</div>
```
to:
```tsx
<div style={{ gridArea: 'right', overflow: 'auto', maxWidth: 420 }}>{rightPanel}</div>
```

- [ ] **Step 2: Add ultra-wide font cap to index.css**

Read `src/index.css`. After the existing `@media (min-width: 3840px)` block, add:

```css
@media (min-width: 3840px) {
  html, body, #root {
    font-size: calc(14px + 0.2vw);
  }
}

@media (min-width: 5760px) {
  html, body, #root {
    font-size: 24px;
  }
}
```

If the `@media (min-width: 3840px)` block already exists, just add the 5760px block after it.

- [ ] **Step 3: Remove unused LAYOUT constants**

Read `src/utils/constants.ts`. Remove the `LAYOUT` object entirely (lines 1-7). The file should start with `REFRESH_INTERVALS`.

The file after changes:

```ts
export const REFRESH_INTERVALS = {
  REALTIME: 5000,
  NEAR_REALTIME: 5 * 60 * 1000,
  PERIODIC: 60 * 60 * 1000,
} as const

export const SCENE = {
  FOG_COLOR: '#0a1628',
  FOG_NEAR: 50,
  FOG_FAR: 500,
  DEFAULT_CAMERA: {
    position: [0, 60, 30] as [number, number, number],
    target: [0, 0, 0] as [number, number, number],
  },
  THEME_CAMERAS: {
    overview: { position: [0, 6, 48] as [number, number, number], target: [0, 3, 13.5] as [number, number, number] },
    'teaching-research': { position: [-10, 25, 20] as [number, number, number], target: [-10, 5, 4] as [number, number, number] },
    admin: { position: [-15, 20, 15] as [number, number, number], target: [-5, 5, -8] as [number, number, number] },
    library: { position: [-5, 15, 2] as [number, number, number], target: [-10, 4, -10] as [number, number, number] },
    academics: { position: [-6, 15, 25] as [number, number, number], target: [-6, 8, 4] as [number, number, number] },
    security: { position: [-40, 22, -15] as [number, number, number], target: [-12, 4, -3] as [number, number, number] },
  } as Record<string, { position: [number, number, number]; target: [number, number, number] }>,
} as const
```

Then check if `LAYOUT` is imported anywhere:
```bash
rg "LAYOUT" src/ --include "*.ts" --include "*.tsx"
```
Expected: No results (LAYOUT was unused)

- [ ] **Step 4: Verify build**

Run: `pnpm build`
Expected: Build succeeds

- [ ] **Step 5: Run tests**

Run: `pnpm test --run`
Expected: 35/35 pass

- [ ] **Step 6: Commit**

```bash
git add src/components/layout/ScreenLayout.tsx src/index.css src/utils/constants.ts
git commit -m "fix(responsive): cap side panel width, limit font growth for ultra-wide resolutions"
```

---

### Task 2: Final verification

- [ ] **Step 1: Run full test suite**

```bash
pnpm test --run
```
Expected: 35/35 pass

- [ ] **Step 2: Run build**

```bash
pnpm build
```
Expected: Build succeeds

- [ ] **Step 3: Commit any remaining changes**

```bash
git add -A
git commit -m "chore: verify tests and build after ultra-wide resolution adaptation"
```
