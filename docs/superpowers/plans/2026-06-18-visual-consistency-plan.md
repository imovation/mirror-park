# Visual Consistency & Animation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Unify CSS variables, fix visual inconsistencies (font sizes, spacing, colors), and add proper animations/transitions across all UI components.

**Architecture:** Three layers — Layer 1 adds CSS variable foundation, Layer 2 refactors components to use variables + unify spacing, Layer 3 adds animations. Each layer depends on the previous.

**Tech Stack:** React 18, TypeScript, CSS custom properties, CSS animations

---

### Task 1: index.css — Add CSS variables

**Files:** Modify `src/index.css`

- [ ] **Step 1: Add new variables to `:root`**

In the `:root` block (after `--card-carousel-dot-inactive`), append:

```css
  --color-danger-rgb: 255, 23, 68;
  --color-warning-rgb: 255, 109, 0;
  --shadow-modal: 0 8px 32px rgba(0, 0, 0, 0.5);
  --shadow-toast: 0 4px 16px rgba(0, 0, 0, 0.3);
  --shadow-panel: 0 2px 8px rgba(0, 0, 0, 0.15);
  --font-family: 'Microsoft YaHei', 'PingFang SC', sans-serif;
  --font-size-xs: 0.7rem;
  --font-size-sm: 0.75rem;
  --font-size-md: 0.85rem;
  --font-size-lg: 1rem;
  --font-size-xl: 1.15rem;
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;
  --transition-fast: 0.15s ease;
  --transition-normal: 0.3s ease;
  --transition-slow: 0.5s ease;
  --panel-padding-x: 14px;
  --panel-padding-y: 8px;
```

- [ ] **Step 2: Add light theme overrides**

In the `[data-ui-theme="light"]` block (after `--card-carousel-dot-inactive`), append:

```css
  --shadow-modal: 0 8px 32px rgba(0, 0, 0, 0.12);
  --shadow-toast: 0 4px 16px rgba(0, 0, 0, 0.08);
  --shadow-panel: 0 2px 8px rgba(0, 0, 0, 0.06);
  --color-warning: #e6a000;
```

- [ ] **Step 3: Change font-family to variable**

Change `font-family: 'Microsoft YaHei', 'PingFang SC', sans-serif;` in `html, body, #root` to `font-family: var(--font-family);`

- [ ] **Step 4: Fix scene-loading to use accent-rgb variable**

Change `rgba(74, 158, 255, 0.08)` and `rgba(74, 158, 255, 0.25)` and `rgba(74, 158, 255, 0.15)` in `.scene-loading` and `@keyframes scene-loading-pulse` to `rgba(var(--accent-rgb), 0.08)` etc.

Current (lines 117-124):
```css
@keyframes scene-loading-pulse {
  0%, 100% { border-color: rgba(74, 158, 255, 0.08); }
  50% { border-color: rgba(74, 158, 255, 0.25); }
}

.scene-loading {
  animation: scene-loading-pulse 2s ease-in-out infinite;
  border: 2px solid rgba(74, 158, 255, 0.15);
  border-radius: 4px;
}
```

Target:
```css
@keyframes scene-loading-pulse {
  0%, 100% { border-color: rgba(var(--accent-rgb), 0.08); }
  50% { border-color: rgba(var(--accent-rgb), 0.25); }
}

.scene-loading {
  animation: scene-loading-pulse 2s ease-in-out infinite;
  border: 2px solid rgba(var(--accent-rgb), 0.15);
  border-radius: 4px;
}
```

- [ ] **Step 5: Verify**

Run: `pnpm build` — Expected: PASS

---

### Task 2: TopBar — font sizes, button padding, transitions

**Files:** Modify `src/components/layout/TopBar.tsx`

- [ ] **Step 1: Change font sizes to CSS variables**

| Line | Current | Replace with |
|------|---------|--------------|
| 58 | `fontSize: 20` | `fontSize: 'var(--font-size-xl)'` |
| 74 | `fontSize: 13` | `fontSize: 'var(--font-size-md)'` |
| 84 | `fontSize: 13` | `fontSize: 'var(--font-size-md)'` |
| 93 | `fontSize: 12` | `fontSize: 'var(--font-size-sm)'` |
| 108 | `fontSize: 12` | `fontSize: 'var(--font-size-sm)'` |
| 123 | `fontSize: 12` | `fontSize: 'var(--font-size-sm)'` |
| 130 | `fontSize: 16` | `fontSize: 'var(--font-size-lg)'` |

- [ ] **Step 2: Unify button padding**

Change music button (line 124): `padding: '4px 8px'` → `padding: '4px 10px'`

Change time mode button (line 109): `padding: '4px 12px'` → `padding: '4px 10px'`

- [ ] **Step 3: Add transition to UI/Time/Music buttons**

Add `transition: 'var(--transition-fast)'` to each of the three buttons:
- UI theme toggle (line 87-96) — add after `cursor: 'pointer'`
- Time mode toggle (line 100-111) — add after `cursor: 'pointer'`
- Music toggle (line 115-128) — add after `cursor: 'pointer'`

Also add `transition` to the music button's inline style (lines 115-125). Example for UI toggle:

```tsx
style={{
  background: uiTheme === 'light' ? 'rgba(var(--accent-rgb), 0.15)' : 'transparent',
  border: '1px solid var(--border-light)',
  borderRadius: 4,
  color: 'var(--accent)',
  cursor: 'pointer',
  fontSize: 'var(--font-size-sm)',
  padding: '4px 10px',
  fontWeight: 600,
  transition: 'var(--transition-fast)',
}}
```

Apply same `transition: 'var(--transition-fast)'` pattern to time mode and music buttons.

- [ ] **Step 4: Verify**

Run: `pnpm build` — Expected: PASS

---

### Task 3: BottomBar, ScrollList, StatusPanel — font size to variables

**Files:** Modify 3 files

- [ ] **Step 1: BottomBar font size**

**File:** `src/components/layout/BottomBar.tsx`

Line 35: `fontSize: '0.7em'` → `fontSize: 'var(--font-size-xs)'`

Line 41: `fontSize: '0.9em'` → `fontSize: 'var(--font-size-sm)'`

- [ ] **Step 2: ScrollList font size**

**File:** `src/components/ui/ScrollList.tsx`

Line 40: `fontSize: 12` → `fontSize: 'var(--font-size-sm)'`

- [ ] **Step 3: StatusPanel message font size**

**File:** `src/components/ui/StatusPanel.tsx`

Line 30: `fontSize: '0.75rem'` → `fontSize: 'var(--font-size-sm)'`

- [ ] **Step 4: Verify**

Run: `pnpm build` — Expected: PASS

---

### Task 4: DashboardPanel — remove margin/backdrop-filter, unify padding

**Files:** Modify `src/components/ui/DashboardPanel.tsx`

- [ ] **Step 1: Apply changes**

Current style (lines 10-23):
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

Target:
```tsx
style={{
  marginBottom: 6,
  background: 'var(--panel-bg)',
  border: '1px solid var(--border)',
  borderRadius: 6,
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  minHeight: 120,
}}
```

Changes:
- `margin: '6px 8px'` → `marginBottom: 6` (horizontal margin handled by SidePanel)
- Remove `backdropFilter` and `WebkitBackdropFilter` (handled by SidePanel)

- [ ] **Step 2: Unify title padding**

Line 27: `padding: '8px 14px'` → `padding: 'var(--panel-padding-y) var(--panel-padding-x)'`

- [ ] **Step 3: Unify content padding**

Line 37: `padding: 10` → `padding: 'var(--panel-padding-y) var(--panel-padding-x)'`

- [ ] **Step 4: Verify**

Run: `pnpm build` — Expected: PASS

---

### Task 5: Modal, VideoWindow — boxShadow to CSS variable

**Files:** Modify 2 files

- [ ] **Step 1: Modal shadow**

**File:** `src/components/ui/Modal.tsx`

Line 36: `boxShadow: '0 8px 32px rgba(0,0,0,0.5)'` → `boxShadow: 'var(--shadow-modal)'`

- [ ] **Step 2: VideoWindow shadow and background**

**File:** `src/components/ui/VideoWindow.tsx`

Line 22: `boxShadow: '0 8px 32px rgba(0,0,0,0.5)'` → `boxShadow: 'var(--shadow-modal)'`

Line 57: `background: '#000'` → `background: 'var(--panel-bg-solid)'`

- [ ] **Step 3: Verify**

Run: `pnpm build` — Expected: PASS

---

### Task 6: AlertPopup — colors to CSS variables

**Files:** Modify `src/components/ui/AlertPopup.tsx`

- [ ] **Step 1: Replace hardcoded colors**

Line 37: Background color — replace the ternary:
```tsx
background: alert.type === 'error' ? 'rgba(255,23,68,0.9)' : alert.type === 'warning' ? 'rgba(255,109,0,0.9)' : 'rgba(74,158,255,0.9)',
```
→
```tsx
background: alert.type === 'error' ? 'rgba(var(--color-danger-rgb), 0.9)' : alert.type === 'warning' ? 'rgba(var(--color-warning-rgb), 0.9)' : 'rgba(var(--accent-rgb), 0.9)',
```

Line 40: `color: '#fff'` → `color: 'var(--text-primary)'`

Line 42: `boxShadow: '0 4px 16px rgba(0,0,0,0.3)'` → `boxShadow: 'var(--shadow-toast)'`

Line 65: `color: '#fff'` → `color: 'var(--text-primary)'`

- [ ] **Step 2: Verify**

Run: `pnpm build` — Expected: PASS

---

### Task 7: SidePanel — merge LeftPanel + RightPanel, update App.tsx

**Files:**
- Create: `src/components/layout/SidePanel.tsx`
- Modify: `src/App.tsx`
- Delete: `src/components/layout/LeftPanel.tsx`, `src/components/layout/RightPanel.tsx`

- [ ] **Step 1: Create SidePanel.tsx**

```tsx
import type { ReactNode } from 'react'

interface SidePanelProps {
  children: ReactNode
}

export default function SidePanel({ children }: SidePanelProps) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      paddingTop: 4,
      backdropFilter: 'blur(6px)',
      WebkitBackdropFilter: 'blur(6px)',
    }}>
      {children}
    </div>
  )
}
```

- [ ] **Step 2: Update App.tsx**

Replace imports:
```tsx
// Remove:
import LeftPanel from '@/components/layout/LeftPanel'
import RightPanel from '@/components/layout/RightPanel'

// Add:
import SidePanel from '@/components/layout/SidePanel'
```

Replace `<LeftPanel>` with `<SidePanel>` and `<RightPanel>` with `<SidePanel>` in the render.

Lines 60-68 (leftPanel):
```tsx
<SidePanel>
  {entry.panels.left.map((p) => (
    ...
  ))}
</SidePanel>
```

Lines 73-81 (rightPanel):
```tsx
<SidePanel>
  {entry.panels.right.map((p) => (
    ...
  ))}
</SidePanel>
```

- [ ] **Step 3: Delete LeftPanel.tsx and RightPanel.tsx**

Run:
```bash
rm src/components/layout/LeftPanel.tsx
rm src/components/layout/RightPanel.tsx
```

- [ ] **Step 4: Verify**

Run: `pnpm build` — Expected: PASS

---

### Task 8: chartTheme.ts — borderColor fix

**Files:** Modify `src/config/chartTheme.ts`

- [ ] **Step 1: Fix hardcoded borderColor**

Line 23: `borderColor: '#0a1628'` → `borderColor: 'rgba(10,22,40,1)'`

(Using the hex as rgba to stay consistent with the theme. If `--page-bg` changes, chartTheme won't auto-follow because it's static JS — documented as known limitation.)

- [ ] **Step 2: Verify**

Run: `pnpm build` — Expected: PASS

---

### Task 9: NumberFlip — rewrite with digit roll animation

**Files:** Modify `src/components/ui/NumberFlip.tsx`

- [ ] **Step 1: Rewrite the component**

```tsx
import { formatNumber } from '@/utils/format'

interface NumberFlipProps {
  value: number
  unit?: string
  label?: string
  color?: string
}

function DigitColumn({ char }: { char: string }) {
  const digit = parseInt(char, 10)
  const isDigit = !isNaN(digit)

  return (
    <span
      style={{
        display: 'inline-block',
        overflow: 'hidden',
        height: '1em',
        verticalAlign: 'top',
        whiteSpace: 'pre',
      }}
    >
      {isDigit ? (
        <span
          style={{
            display: 'block',
            transform: `translateY(-${digit * 100}%)`,
            transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            willChange: 'transform',
          }}
        >
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
            <span key={n} style={{ display: 'block', height: '1em', lineHeight: 1 }}>{n}</span>
          ))}
        </span>
      ) : (
        <span>{char}</span>
      )}
    </span>
  )
}

export default function NumberFlip({ value, unit, label, color = 'var(--accent)' }: NumberFlipProps) {
  const formatted = formatNumber(value)

  return (
    <div style={{ textAlign: 'center' }}>
      {label && (
        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', marginBottom: 4 }}>
          {label}
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 4 }}>
        <span style={{ fontSize: 28, fontWeight: 'bold', color, fontFamily: 'monospace' }}>
          {formatted.split('').map((char, i) => (
            <DigitColumn key={i} char={char} />
          ))}
        </span>
        {unit && (
          <span style={{ fontSize: 'var(--font-size-md)', color: 'var(--text-tertiary)' }}>{unit}</span>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify**

Run: `pnpm build` — Expected: PASS

---

### Task 10: ScrollList — fix speed parameter with rAF

**Files:** Modify `src/components/ui/ScrollList.tsx`

- [ ] **Step 1: Rewrite scroll effect to use speed prop + rAF**

Replace the entire `useEffect` (lines 19-30) with:

```tsx
useEffect(() => {
  if (items.length <= 3) return

  let lastTime = performance.now()
  let scrollPos = 0
  let rafId: number

  const animate = (now: number) => {
    const dt = (now - lastTime) / 1000
    lastTime = now

    if (!isPaused && containerRef.current) {
      scrollPos += speed * dt
      const maxScroll = containerRef.current.scrollHeight - containerRef.current.clientHeight
      if (scrollPos >= maxScroll) scrollPos = 0
      containerRef.current.scrollTop = scrollPos
    }

    rafId = requestAnimationFrame(animate)
  }

  rafId = requestAnimationFrame(animate)
  return () => cancelAnimationFrame(rafId)
}, [isPaused, speed, items.length])
```

Also replace `scrollRef` declaration in the component: remove `const scrollRef = useRef<number>(0)` (line 17).

- [ ] **Step 2: Verify**

Run: `pnpm build` — Expected: PASS

---

### Task 11: Modal — enter/exit animation

**Files:** Modify `src/components/ui/Modal.tsx`

- [ ] **Step 1: Add animated wrapper**

Replace the entire component:

```tsx
import { type ReactNode, useState, useEffect } from 'react'

interface ModalProps {
  visible: boolean
  title: string
  onClose: () => void
  children: ReactNode
  width?: number
}

export default function Modal({ visible, title, onClose, children, width = 600 }: ModalProps) {
  const [show, setShow] = useState(false)
  const [closing, setClosing] = useState(false)

  useEffect(() => {
    if (visible) {
      setShow(true)
      setClosing(false)
    } else if (show) {
      setClosing(true)
      const timer = setTimeout(() => {
        setShow(false)
        setClosing(false)
      }, 200)
      return () => clearTimeout(timer)
    }
  }, [visible, show])

  if (!show) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--overlay-bg)',
        backdropFilter: 'blur(4px)',
        opacity: closing ? 0 : 1,
        transition: 'opacity 0.2s ease',
      }}
      onClick={onClose}
    >
      <div
        className="panel-enter"
        style={{
          width,
          maxHeight: '80vh',
          background: 'var(--panel-bg-solid)',
          border: '1px solid var(--border-strong)',
          borderRadius: 8,
          overflow: 'hidden',
          boxShadow: 'var(--shadow-modal)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 20px',
            borderBottom: '1px solid var(--border-light)',
            color: 'var(--accent)',
            fontSize: 'var(--font-size-md)',
            fontWeight: 600,
          }}
        >
          <span>{title}</span>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-tertiary)',
              cursor: 'pointer',
              fontSize: 18,
            }}
          >
            ✕
          </button>
        </div>
        <div style={{ padding: 20, color: 'var(--text-secondary)', fontSize: 'var(--font-size-md)' }}>
          {children}
        </div>
      </div>
    </div>
  )
}
```

Changes from current:
- Added `closing/show` state for exit animation
- Overlay fades out via `opacity` + `transition`
- Content panel uses `panel-enter` className (reuses `fadeInUp`)
- Added `useState`/`useEffect` imports
- Font sizes changed to variables

- [ ] **Step 2: Verify**

Run: `pnpm build` — Expected: PASS

---

### Task 12: VideoWindow — enter/exit animation

**Files:** Modify `src/components/ui/VideoWindow.tsx`

- [ ] **Step 1: Add animated wrapper**

Replace the entire component:

```tsx
import { useState, useEffect } from 'react'

interface VideoWindowProps {
  visible: boolean
  title: string
  onClose: () => void
}

export default function VideoWindow({ visible, title, onClose }: VideoWindowProps) {
  const [show, setShow] = useState(false)
  const [closing, setClosing] = useState(false)

  useEffect(() => {
    if (visible) {
      setShow(true)
      setClosing(false)
    } else if (show) {
      setClosing(true)
      const timer = setTimeout(() => {
        setShow(false)
        setClosing(false)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [visible, show])

  if (!show) return null

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 60,
        right: 30,
        width: 400,
        zIndex: 800,
        background: 'var(--panel-bg-solid)',
        border: '1px solid var(--border-strong)',
        borderRadius: 8,
        overflow: 'hidden',
        boxShadow: 'var(--shadow-modal)',
        animation: closing ? 'slideOutRight 0.3s ease-out forwards' : 'slideInRight 0.3s ease-out',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '8px 14px',
          borderBottom: '1px solid var(--border-light)',
          color: 'var(--accent)',
          fontSize: 'var(--font-size-md)',
          fontWeight: 600,
        }}
      >
        <span>📹 {title}</span>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-tertiary)',
            cursor: 'pointer',
            fontSize: 16,
          }}
        >
          ✕
        </button>
      </div>
      <div
        style={{
          height: 250,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--panel-bg-solid)',
          color: 'var(--text-muted)',
          fontSize: 'var(--font-size-md)',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>📹</div>
          <div>监控画面预览</div>
          <div style={{ fontSize: 10, marginTop: 4 }}>
            演示模式 — 实际对接大华ICC后显示实时画面
          </div>
        </div>
      </div>
    </div>
  )
}
```

Also add the `slideOutRight` keyframe to `index.css`:

```css
@keyframes slideOutRight {
  from { transform: translateX(0); opacity: 1; }
  to { transform: translateX(120%); opacity: 0; }
}
```

- [ ] **Step 2: Verify**

Run: `pnpm build` — Expected: PASS

---

### Task 13: StatusPanel — error/empty animation

**Files:** Modify `src/components/ui/StatusPanel.tsx`

- [ ] **Step 1: Add fadeInUp animation to error/empty states**

Current (lines 14-32):
```tsx
<div style={{
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 32,
  gap: 8,
  minHeight: 80,
}}>
```

Target:
```tsx
<div style={{
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 32,
  gap: 8,
  minHeight: 80,
  animation: type !== 'loading' ? 'fadeInUp 0.35s ease-out' : undefined,
}}>
```

- [ ] **Step 2: Verify**

Run: `pnpm build` — Expected: PASS

---

### Task 14: CardCarousel — arrow centering fix

**Files:** Modify `src/components/ui/CardCarousel.tsx`

- [ ] **Step 1: Fix arrow vertical centering**

Current (line 84):
```tsx
<div style={{ display: 'flex', justifyContent: 'space-between', position: 'absolute', top: '50%', left: -8, right: -8, transform: 'translateY(-50%)', pointerEvents: 'none' }}>
```

The `transform: translateY(-50%)` centers on the entire container including dots. Fix by centering on just the card:

```tsx
<div style={{ display: 'flex', justifyContent: 'space-between', position: 'absolute', top: 'calc(50% - 10px)', left: -8, right: -8, transform: 'translateY(-50%)', pointerEvents: 'none' }}>
```

(Adjusting `top` to `calc(50% - 10px)` compensates for the `~20px` space taken by dots + margin)

- [ ] **Step 2: Verify**

Run: `pnpm build` — Expected: PASS

---

### Task 15: Final verification

- [ ] **Step 1: Full build**

Run: `pnpm build` — Expected: PASS

- [ ] **Step 2: Run tests**

Run: `pnpm test` — Expected: PASS (all 35 tests)

- [ ] **Step 3: Visual check**

Run: `pnpm dev` then open `http://localhost:3000`. Verify:
- Font sizes scale with viewport
- Panels have consistent spacing
- NumberFlip digits roll on value change
- Modal/VideoWindow have smooth enter/exit
- CardCarousel arrows centered on card
- Alert colors use CSS variables
- Scene works normally (no regression from panel refactoring)
