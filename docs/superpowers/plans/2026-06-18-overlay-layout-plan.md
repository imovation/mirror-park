# Overlay Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the page layout from side-by-side CSS Grid to full-screen 3D scene with semi-transparent overlay panels.

**Architecture:** Extract the 3D scene from ScreenLayout into an absolute-positioned Layer 0 behind the UI overlay (Layer 1). ScreenLayout becomes a pure UI overlay managing only topbar/left/right/bottombar.

**Tech Stack:** React 18, TypeScript, CSS Grid, CSS custom properties

---

### Task 1: ScreenLayout — remove scene prop and update Grid

**Files:**
- Modify: `src/components/layout/ScreenLayout.tsx`

- [ ] **Step: Remove `scene` from interface and component**

Current:
```tsx
interface ScreenLayoutProps {
  topBar: ReactNode
  leftPanel: ReactNode
  scene: ReactNode
  rightPanel: ReactNode
  bottomBar: ReactNode
}

export default function ScreenLayout({
  topBar,
  leftPanel,
  scene,
  rightPanel,
  bottomBar,
}: ScreenLayoutProps) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateAreas: `
          "topbar  topbar  topbar"
          "left    scene   right"
          "bottombar bottombar bottombar"
        `,
        gridTemplateRows: 'minmax(48px, 4vh) 1fr minmax(28px, 2.5vh)',
        gridTemplateColumns: 'minmax(240px, 18vw) 1fr minmax(240px, 18vw)',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      <div style={{ gridArea: 'topbar' }}>{topBar}</div>
      <div style={{ gridArea: 'left', overflow: 'auto', maxWidth: 420 }}>{leftPanel}</div>
      <div style={{ gridArea: 'scene', position: 'relative', overflow: 'hidden' }}>{scene}</div>
      <div style={{ gridArea: 'right', overflow: 'auto', maxWidth: 420 }}>{rightPanel}</div>
      <div style={{ gridArea: 'bottombar' }}>{bottomBar}</div>
    </div>
  )
}
```

Target:
```tsx
import type { ReactNode } from 'react'

interface ScreenLayoutProps {
  topBar: ReactNode
  leftPanel: ReactNode
  rightPanel: ReactNode
  bottomBar: ReactNode
}

export default function ScreenLayout({
  topBar,
  leftPanel,
  rightPanel,
  bottomBar,
}: ScreenLayoutProps) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateAreas: `
          "topbar  topbar  topbar"
          "left    .       right"
          "bottombar bottombar bottombar"
        `,
        gridTemplateRows: 'minmax(48px, 4vh) 1fr minmax(28px, 2.5vh)',
        gridTemplateColumns: 'minmax(240px, 18vw) 1fr minmax(240px, 18vw)',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      <div style={{ gridArea: 'topbar' }}>{topBar}</div>
      <div style={{ gridArea: 'left', overflow: 'auto', maxWidth: 420 }}>{leftPanel}</div>
      <div style={{ gridArea: 'right', overflow: 'auto', maxWidth: 420 }}>{rightPanel}</div>
      <div style={{ gridArea: 'bottombar' }}>{bottomBar}</div>
    </div>
  )
}
```

Changes:
- Removed `scene` from props interface and destructuring
- Grid area `"left    scene   right"` → `"left    .       right"`
- Removed `<div style={{ gridArea: 'scene' ... }}>`
- Width changed from `100vw` to `100%` (now inside a flex parent Layer 1 instead of root)

- [ ] **Step: Verify build**

Run: `pnpm build` (will fail because App.tsx still passes `scene` prop — fixed in Task 2)

---

### Task 2: App.tsx — extract scene to Layer 0

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step: Restructure AppContent render tree**

Current render:
```tsx
<ScreenLayout
  topBar={...}
  leftPanel={...}
  scene={
    <ErrorBoundary name="3D 场景" fallback={...}>
      <SceneCanvas>{entry.scene()}</SceneCanvas>
    </ErrorBoundary>
  }
  rightPanel={...}
  bottomBar={...}
/>
```

Target render:
```tsx
<div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
  <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
    <ErrorBoundary name="3D 场景" fallback={
      <div style={{
        width: '100%', height: '100%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--page-bg)', color: 'var(--text-tertiary)', fontSize: '0.875rem',
      }}>
        3D 场景不可用
      </div>
    }>
      <SceneCanvas>{entry.scene()}</SceneCanvas>
    </ErrorBoundary>
  </div>
  <div style={{ position: 'relative', zIndex: 1, width: '100%', height: '100%' }}>
    <ScreenLayout
      topBar={<ErrorBoundary name="顶部导航"><TopBar /></ErrorBoundary>}
      leftPanel={...}
      rightPanel={...}
      bottomBar={<BottomBar status={sseStatus} />}
    />
  </div>
</div>
```

The full `return` block in `AppContent`:

```tsx
return (
  <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
    <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
      <ErrorBoundary name="3D 场景" fallback={
        <div style={{
          width: '100%', height: '100%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'var(--page-bg)', color: 'var(--text-tertiary)', fontSize: '0.875rem',
        }}>
          3D 场景不可用
        </div>
      }>
        <SceneCanvas>{entry.scene()}</SceneCanvas>
      </ErrorBoundary>
    </div>
    <div style={{ position: 'relative', zIndex: 1, width: '100%', height: '100%' }}>
      <ScreenLayout
        topBar={<ErrorBoundary name="顶部导航"><TopBar /></ErrorBoundary>}
        leftPanel={
          <ErrorBoundary name="左侧面板" fallback={<div style={{ color: 'var(--text-tertiary)', textAlign: 'center', padding: 16 }}>左侧面板异常</div>}>
            <LeftPanel>
              {entry.panels.left.map((p) => (
                <DashboardPanel key={p.id} title={p.title}>
                  <ErrorBoundary name={p.title}>
                    {entry.renderPanel(p.id)}
                  </ErrorBoundary>
                </DashboardPanel>
              ))}
            </LeftPanel>
          </ErrorBoundary>
        }
        rightPanel={
          <ErrorBoundary name="右侧面板" fallback={<div style={{ color: 'var(--text-tertiary)', textAlign: 'center', padding: 16 }}>右侧面板异常</div>}>
            <RightPanel>
              {entry.panels.right.map((p) => (
                <DashboardPanel key={p.id} title={p.title}>
                  <ErrorBoundary name={p.title}>
                    {entry.renderPanel(p.id)}
                  </ErrorBoundary>
                </DashboardPanel>
              ))}
            </RightPanel>
          </ErrorBoundary>
        }
        bottomBar={<BottomBar status={sseStatus} />}
      />
    </div>
  </div>
)
```

- [ ] **Step: Remove unused import**

Remove `SceneCanvas` import from App.tsx if it's no longer referenced directly... Actually it IS still used in the new code. Keep it.

- [ ] **Step: Verify build**

Run: `pnpm build` — Expected: PASS

---

### Task 3: index.css — adjust light theme panel background

**Files:**
- Modify: `src/index.css`

- [ ] **Step: Change light theme `--panel-bg` alpha**

```css
/* Before */
--panel-bg: rgba(255, 255, 255, 0.85);

/* After */
--panel-bg: rgba(255, 255, 255, 0.7);
```

Edit the `[data-ui-theme="light"]` section, line 34.

- [ ] **Step: Verify build**

Run: `pnpm build` — Expected: PASS

---

### Task 4: DashboardPanel — add backdrop-filter

**Files:**
- Modify: `src/components/ui/DashboardPanel.tsx`

- [ ] **Step: Add `backdropFilter` to the root div style**

Current:
```tsx
style={{
  margin: '6px 8px',
  background: 'var(--panel-bg)',
  border: '1px solid var(--border)',
  borderRadius: 6,
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  minHeight: 120,
}}
```

Target:
```tsx
style={{
  margin: '6px 8px',
  background: 'var(--panel-bg)',
  border: '1px solid var(--border)',
  borderRadius: 6,
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  minHeight: 120,
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)',
}}
```

- [ ] **Step: Verify build**

Run: `pnpm build` — Expected: PASS

---

### Task 5: LeftPanel — add backdrop-filter

**Files:**
- Modify: `src/components/layout/LeftPanel.tsx`

- [ ] **Step: Add `backdropFilter` to the root div style**

Current:
```tsx
<div style={{ display: 'flex', flexDirection: 'column', height: '100%', paddingTop: 4 }}>
```

Target:
```tsx
<div style={{
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  paddingTop: 4,
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)',
}}>
```

- [ ] **Step: Verify build**

Run: `pnpm build` — Expected: PASS

---

### Task 6: RightPanel — add backdrop-filter

**Files:**
- Modify: `src/components/layout/RightPanel.tsx`

- [ ] **Step: Add `backdropFilter` to the root div style**

Same change as LeftPanel:

```tsx
<div style={{
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  paddingTop: 4,
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)',
}}>
```

- [ ] **Step: Verify build**

Run: `pnpm build` — Expected: PASS

---

### Task 7: Verify full build and dev

- [ ] **Step: Run full build**

Run: `pnpm build` — Expected: PASS (no errors, no warnings)

- [ ] **Step: Run tests**

Run: `pnpm test` — Expected: PASS (all 35 unit tests, 8 E2E tests)

- [ ] **Step: Start dev server and visually verify**

Run: `pnpm dev`
- Open http://localhost:3000
- Verify 3D scene fills full viewport behind panels
- Verify left/right panels show semi-transparent overlay with blur effect
- Verify TopBar and BottomBar are readable over scene
- Switch between dark/light UI theme to verify panel backgrounds
- Switch between 6 topics to verify scene/panels work for each
