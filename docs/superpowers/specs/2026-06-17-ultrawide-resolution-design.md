# Ultra-Wide Resolution Adaptation — Design Doc

## Overview

Adapt the dashboard layout for ultra-wide resolutions (5760×1080, 7680×1080). Current grid caps side panels at `18vw` with no max-width, causing panels to become unusably wide (~1037px at 5760, ~1382px at 7680) and the 3D scene area to shrink.

## Issues

| Issue | Current | At 5760×1080 | At 7680×1080 |
|-------|---------|-------------|-------------|
| Side panel width | `minmax(240px, 18vw)` | ~1037px | ~1382px |
| Scene area width | `1fr` (~64%) | ~57% | ~50% |
| Base font | `calc(12px + 0.25vw)` | ~26.4px | ~31.2px |

## Changes

### 1. ScreenLayout — cap side panel max-width

Change grid columns from:
```
'minmax(240px, 18vw) 1fr minmax(240px, 18vw)'
```
to:
```
'minmax(240px, 18vw) 1fr minmax(240px, 18vw)'
```
Then add `max-width: 420px` on the panel container divs.

### 2. Font scaling — cap at ultra-wide

Add media query to cap font growth:
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

### 3. Remove unused LAYOUT constants

Delete `LAYOUT` object from `src/utils/constants.ts` (LEFT_PANEL_WIDTH, RIGHT_PANEL_WIDTH, TOP_BAR_HEIGHT, BOTTOM_BAR_HEIGHT are all unused).

## Files

| File | Change |
|------|--------|
| `src/components/layout/ScreenLayout.tsx` | Add `maxWidth: 420` on left/right panel wrappers |
| `src/index.css` | Add `@media (min-width: 5760px)` font cap |
| `src/utils/constants.ts` | Remove unused `LAYOUT` object |

## Non-Goals

- No mobile/tablet layout (below 1200px is out of scope)
- No Three.js DPR/FOV adjustments
- No ECharts container adjustments (charts auto-resize)
- No side panel collapse/hide behavior

## Verification

- Layout renders correctly at 1920×1080 (no regression)
- Layout renders correctly at 3840×2160 (slightly wider panels)
- Build passes, tests pass
