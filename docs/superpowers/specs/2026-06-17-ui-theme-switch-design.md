# UI Theme Switch (Dark/Light) — Design Doc

## Overview

Add dark/light theme switching for the 2D dashboard UI overlay. Independent from the 3D scene's Day/Night mode. Infrastructure: CSS Custom Properties + Zustand store + `data-ui-theme` attribute.

## Approach (CSS Variables)

1. Define CSS custom properties in `:root` (dark) and `[data-ui-theme="light"]` in `index.css`
2. Create `useUIThemeStore` with `uiTheme: 'dark' | 'light'`
3. Apply `data-ui-theme` attribute to `<html>` on change
4. Replace hardcoded inline colors with `var(--xxx)` in all layout + shared UI components
5. Add a toggle button in TopBar

## Color Tokens

### Dark (Current) / Light (Inverted)

| Token | Dark Value | Light Value | Used In |
|-------|-----------|-------------|---------|
| `--page-bg` | `#0a1628` | `#eef1f5` | body background |
| `--panel-bg` | `rgba(0,0,0,0.35)` | `rgba(255,255,255,0.85)` | DashboardPanel, cards |
| `--panel-bg-solid` | `rgba(10,22,40,0.95)` | `rgba(255,255,255,0.98)` | Modal, VideoWindow |
| `--topbar-bg` | `linear-gradient(...)` | `rgba(255,255,255,0.9)` | TopBar |
| `--bottombar-bg` | `rgba(0,0,0,0.4)` | `rgba(0,0,0,0.05)` | BottomBar |
| `--text-primary` | `rgba(255,255,255,0.85)` | `rgba(0,0,0,0.85)` | High emphasis text |
| `--text-secondary` | `rgba(255,255,255,0.7)` | `rgba(0,0,0,0.7)` | Body text |
| `--text-tertiary` | `rgba(255,255,255,0.5)` | `rgba(0,0,0,0.5)` | Labels, secondary info |
| `--text-muted` | `rgba(255,255,255,0.3)` | `rgba(0,0,0,0.3)` | Timestamps, placeholders |
| `--border` | `rgba(74,158,255,0.12)` | `rgba(0,0,0,0.08)` | Panel borders |
| `--border-strong` | `rgba(74,158,255,0.3)` | `rgba(0,0,0,0.15)` | Modal borders, buttons |

### Tokens That Stay The Same

| Token | Value | Purpose |
|-------|-------|---------|
| `--accent` | `#4a9eff` | Brand accent |
| `--color-success` | `#00c853` | Success |
| `--color-warning` | `#ff6d00` | Warning |
| `--color-danger` | `#ff1744` | Danger |
| `--color-pending` | `#ffc107` | Pending |

## Files to Migrate

### Store + Toggle
- Create: `src/stores/useUIThemeStore.ts`
- Modify: `src/components/layout/TopBar.tsx` (add toggle button)
- Modify: `src/index.css` (add CSS variables)

### Layout Components
- `src/index.css` — `html` body background → `var(--page-bg)`
- `src/components/layout/TopBar.tsx` — background, borders, text colors
- `src/components/layout/BottomBar.tsx` — background, border, text
- `src/components/layout/ErrorBoundary.tsx` — background, text, button

### Shared UI Components
- `src/components/ui/DashboardPanel.tsx` — background, border, title color
- `src/components/ui/Modal.tsx` — overlay, content bg, border, text
- `src/components/ui/VideoWindow.tsx` — bg, border, title
- `src/components/ui/AlertPopup.tsx` — shadow (structural only)
- `src/components/ui/CardCarousel.tsx` — card bg, border, text
- `src/components/ui/ScrollList.tsx` — text, separators
- `src/components/ui/StatusPanel.tsx` — text colors

### Charts (Note)

Chart `borderColor: '#0a1628'` values in Treemap/Sunburst/Funnel create seamless integration with the dark background. In light mode, these would become visible borders. However, ECharts options are plain JS objects and cannot resolve CSS `var()` values. Chart structural colors are **deferred** — they will be addressed once ECharts theme support is added for the light mode in a follow-up.

## Non-Goals

- NOT migrating domain-specific color maps (calendar types, subject colors, status labels) — they are data semantics, not theme
- NOT changing ECharts data color palettes or chart structural colors (deferred)
- NOT changing 3D scene colors (Day/Night mode is separate)
- NOT converting to Tailwind classes
- NOT adding animations for theme transitions

## Verification

- `pnpm build` succeeds
- All 35 tests pass
- Toggle between dark/light in TopBar
- All panels render correctly in both modes
