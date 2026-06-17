# UI Theme Switch Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add dark/light theme switching for the 2D dashboard UI via CSS Custom Properties + Zustand store + `data-ui-theme` attribute.

**Architecture:** Define CSS variables in `:root` and `[data-ui-theme="light"]` in `index.css`. Create `useUIThemeStore` with `uiTheme: 'dark' | 'light'`. TopBar gets a toggle button that sets the store and applies `data-ui-theme` to `<html>`. All layout + shared UI components replace hardcoded colors with `var(--xxx)`.

**Tech Stack:** React 18, CSS Custom Properties, Zustand

---

### Task 1: Create useUIThemeStore + CSS Variables

**Files:**
- Create: `src/stores/useUIThemeStore.ts`
- Modify: `src/index.css` (add CSS variable blocks)
- Modify: `src/App.tsx` (apply `data-ui-theme` to `<html>`)

- [ ] **Step 1: Create the store**

Write `src/stores/useUIThemeStore.ts`:

```ts
import { create } from 'zustand'

export type UITheme = 'dark' | 'light'

interface UIThemeState {
  uiTheme: UITheme
  toggleUITheme: () => void
  setUITheme: (theme: UITheme) => void
}

export const useUIThemeStore = create<UIThemeState>((set) => ({
  uiTheme: 'dark',
  toggleUITheme: () =>
    set((s) => ({ uiTheme: s.uiTheme === 'dark' ? 'light' : 'dark' })),
  setUITheme: (theme) => set({ uiTheme: theme }),
}))
```

- [ ] **Step 2: Add CSS variables to index.css**

Read `src/index.css`, then update it to add CSS variable blocks BEFORE the existing reset rules. The full updated file:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --page-bg: #0a1628;
  --panel-bg: rgba(0, 0, 0, 0.35);
  --panel-bg-solid: rgba(10, 22, 40, 0.95);
  --topbar-bg: linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 100%);
  --bottombar-bg: rgba(0, 0, 0, 0.4);
  --overlay-bg: rgba(0, 0, 0, 0.6);
  --text-primary: rgba(255, 255, 255, 0.85);
  --text-secondary: rgba(255, 255, 255, 0.7);
  --text-tertiary: rgba(255, 255, 255, 0.5);
  --text-muted: rgba(255, 255, 255, 0.3);
  --border: rgba(74, 158, 255, 0.12);
  --border-light: rgba(74, 158, 255, 0.06);
  --border-strong: rgba(74, 158, 255, 0.3);
  --accent: #4a9eff;
  --color-success: #00c853;
  --color-warning: #ff6d00;
  --color-danger: #ff1744;
  --color-pending: #ffc107;
  --scrollbar-thumb: rgba(74, 158, 255, 0.3);
  --nav-arrow-bg: rgba(0, 0, 0, 0.5);
  --card-carousel-bg: rgba(74, 158, 255, 0.08);
  --card-carousel-border: rgba(74, 158, 255, 0.15);
  --card-carousel-dot-inactive: rgba(255, 255, 255, 0.15);
}

[data-ui-theme="light"] {
  --page-bg: #eef1f5;
  --panel-bg: rgba(255, 255, 255, 0.85);
  --panel-bg-solid: rgba(255, 255, 255, 0.98);
  --topbar-bg: rgba(255, 255, 255, 0.9);
  --bottombar-bg: rgba(0, 0, 0, 0.05);
  --overlay-bg: rgba(0, 0, 0, 0.3);
  --text-primary: rgba(0, 0, 0, 0.85);
  --text-secondary: rgba(0, 0, 0, 0.7);
  --text-tertiary: rgba(0, 0, 0, 0.5);
  --text-muted: rgba(0, 0, 0, 0.3);
  --border: rgba(0, 0, 0, 0.08);
  --border-light: rgba(0, 0, 0, 0.04);
  --border-strong: rgba(0, 0, 0, 0.15);
  --scrollbar-thumb: rgba(0, 0, 0, 0.15);
  --nav-arrow-bg: rgba(0, 0, 0, 0.15);
  --card-carousel-bg: rgba(255, 255, 255, 0.8);
  --card-carousel-border: rgba(0, 0, 0, 0.08);
  --card-carousel-dot-inactive: rgba(0, 0, 0, 0.15);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, #root {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  font-family: 'Microsoft YaHei', 'PingFang SC', sans-serif;
  background: var(--page-bg);
  font-size: calc(12px + 0.25vw);
}

/* ... rest of existing styles unchanged except replace hardcoded colors with vars ... */
```

Then update the scrollbar styles using CSS vars:

```css
::-webkit-scrollbar-thumb {
  background: var(--scrollbar-thumb);
  border-radius: 2px;
}
```

- [ ] **Step 3: Apply data-ui-theme in App.tsx**

Read `src/App.tsx`, add import and effect. The key changes:

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useThemeStore } from '@/stores/useThemeStore'
import { useUIThemeStore } from '@/stores/useUIThemeStore'
import { useEffect } from 'react'
// ... rest of imports

function App() {
  const currentTheme = useThemeStore((s) => s.currentTheme)
  const uiTheme = useUIThemeStore((s) => s.uiTheme)
  const entry = getThemeEntry(currentTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-ui-theme', uiTheme)
  }, [uiTheme])

  return (
    // ... rest unchanged
  )
}
```

- [ ] **Step 4: Verify build**

Run: `pnpm build`
Expected: Build succeeds

- [ ] **Step 5: Commit**

```bash
git add src/stores/useUIThemeStore.ts src/index.css src/App.tsx
git commit -m "feat(theme): add UI theme store and CSS variables for dark/light switching"
```

---

### Task 2: Migrate DashboardPanel + Modal + VideoWindow

**Files:**
- Modify: `src/components/ui/DashboardPanel.tsx`
- Modify: `src/components/ui/Modal.tsx`
- Modify: `src/components/ui/VideoWindow.tsx`

- [ ] **Step 1: Migrate DashboardPanel**

Replace inline color values with CSS variables:

```tsx
import type { ReactNode } from 'react'

interface DashboardPanelProps {
  title: string
  children: ReactNode
}

export default function DashboardPanel({ title, children }: DashboardPanelProps) {
  return (
    <div
      className="panel-enter"
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
    >
      <div
        style={{
          padding: '8px 14px',
          fontSize: 13,
          fontWeight: 600,
          color: 'var(--accent)',
          borderBottom: '1px solid var(--border-light)',
          flexShrink: 0,
        }}
      >
        {title}
      </div>
      <div style={{ padding: 10, flex: 1, display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Migrate Modal**

Replace hardcoded colors:

```tsx
import type { ReactNode } from 'react'

interface ModalProps {
  visible: boolean
  title: string
  onClose: () => void
  children: ReactNode
  width?: number
}

export default function Modal({ visible, title, onClose, children, width = 600 }: ModalProps) {
  if (!visible) return null

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
      }}
      onClick={onClose}
    >
      <div
        style={{
          width,
          maxHeight: '80vh',
          background: 'var(--panel-bg-solid)',
          border: '1px solid var(--border-strong)',
          borderRadius: 8,
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
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
            fontSize: 15,
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
        <div style={{ padding: 20, color: 'var(--text-secondary)', fontSize: 13 }}>
          {children}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Migrate VideoWindow**

```tsx
interface VideoWindowProps {
  visible: boolean
  title: string
  onClose: () => void
}

export default function VideoWindow({ visible, title, onClose }: VideoWindowProps) {
  if (!visible) return null

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
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
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
          fontSize: 13,
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
          background: '#000',
          color: 'var(--text-muted)',
          fontSize: 13,
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

- [ ] **Step 4: Verify build**

Run: `pnpm build`
Expected: Build succeeds

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/DashboardPanel.tsx src/components/ui/Modal.tsx src/components/ui/VideoWindow.tsx
git commit -m "feat(theme): migrate DashboardPanel, Modal, VideoWindow to CSS variables"
```

---

### Task 3: Migrate TopBar + BottomBar + ErrorBoundary

**Files:**
- Modify: `src/components/layout/TopBar.tsx`
- Modify: `src/components/layout/BottomBar.tsx`
- Modify: `src/components/layout/ErrorBoundary.tsx`

- [ ] **Step 1: Migrate BottomBar**

```tsx
import { useState, useEffect } from 'react'

export default function BottomBar() {
  const [currentTime, setCurrentTime] = useState('--:--')

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString('zh-CN', { hour12: false }))
    }, 30000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '100%',
        padding: '0 16px',
        background: 'var(--bottombar-bg)',
        borderTop: '1px solid var(--border-light)',
        fontSize: '0.7em',
        color: 'var(--text-muted)',
      }}
    >
      <span>智慧校园可视化平台 v0.2.0 | 数据更新: {currentTime}</span>
    </div>
  )
}
```

- [ ] **Step 2: Migrate ErrorBoundary**

Replace hardcoded colors with CSS variables. Key changes:
- `color: 'rgba(255,255,255,0.4)'` → `color: 'var(--text-tertiary)'`
- `color: '#ff6d00'` → `color: 'var(--color-warning)'`
- `color: 'rgba(255,255,255,0.25)'` → `color: 'var(--text-muted)'`
- `border: '1px solid rgba(74,158,255,0.3)'` → `border: '1px solid var(--border-strong)'`
- `color: '#4a9eff'` → `color: 'var(--accent)'`

Full file after changes:

```tsx
import { Component, type ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  name: string
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    console.error(`[ErrorBoundary:${this.props.name}]`, error.message, error.stack?.split('\n').slice(0, 5).join('\n'))
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: 'var(--text-tertiary)',
              fontSize: 13,
              gap: 8,
              padding: 20,
            }}
          >
            <span style={{ color: 'var(--color-warning)', fontSize: 24 }}>⚠</span>
            <span>{this.props.name} 加载异常</span>
            <span style={{ fontSize: 10, color: 'var(--text-muted)', maxWidth: 300, textAlign: 'center', wordBreak: 'break-all' }}>
              {this.state.error?.message}
            </span>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              style={{
                padding: '4px 16px',
                border: '1px solid var(--border-strong)',
                borderRadius: 4,
                background: 'transparent',
                color: 'var(--accent)',
                cursor: 'pointer',
                fontSize: 12,
              }}
            >
              重试
            </button>
          </div>
        )
      )
    }
    return this.props.children
  }
}
```

- [ ] **Step 3: Migrate TopBar**

READ the full current file first. Then make these changes:

1. Add import: `import { useUIThemeStore } from '@/stores/useUIThemeStore'`
2. Add hook: `const uiTheme = useUIThemeStore((s) => s.uiTheme)` and `const toggleUITheme = useUIThemeStore((s) => s.toggleUITheme)`
3. Replace `background: 'linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 100%)'` with `background: 'var(--topbar-bg)'`
4. Replace `borderBottom: '1px solid rgba(74, 158, 255, 0.15)'` with `borderBottom: '1px solid var(--border-light)'`
5. Replace `color: 'rgba(255,255,255,0.5)'` → `color: 'var(--text-tertiary)'`
6. Replace `color: currentTheme === t.id ? '#4a9eff' : 'rgba(255,255,255,0.5)'` → `color: currentTheme === t.id ? 'var(--accent)' : 'var(--text-tertiary)'`
7. Add a UI theme toggle button next to the 3D day/night toggle:

```tsx
<button
  onClick={toggleUITheme}
  style={{
    background: uiTheme === 'light' ? 'rgba(74,158,255,0.15)' : 'transparent',
    border: '1px solid var(--border-light)',
    borderRadius: 4,
    color: 'var(--accent)',
    cursor: 'pointer',
    fontSize: 12,
    padding: '4px 10px',
    fontWeight: 600,
  }}
>
  {uiTheme === 'dark' ? '☀️ 亮色' : '🌙 暗色'}
</button>
```

- [ ] **Step 4: Verify build**

Run: `pnpm build`
Expected: Build succeeds

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/BottomBar.tsx src/components/layout/ErrorBoundary.tsx src/components/layout/TopBar.tsx
git commit -m "feat(theme): migrate layout components to CSS variables, add UI theme toggle"
```

---

### Task 4: Migrate CardCarousel + ScrollList + StatusPanel

**Files:**
- Modify: `src/components/ui/CardCarousel.tsx`
- Modify: `src/components/ui/ScrollList.tsx`
- Modify: `src/components/ui/StatusPanel.tsx`

- [ ] **Step 1: Migrate CardCarousel**

Replace:
- `background: 'rgba(74,158,255,0.08)'` → `background: 'var(--card-carousel-bg)'`
- `border: '1px solid rgba(74,158,255,0.15)'` → `border: '1px solid var(--card-carousel-border)'`
- `color: '#4a9eff'` → `color: 'var(--accent)'`
- `color: 'rgba(255,255,255,0.5)'` → `color: 'var(--text-tertiary)'`
- `background: 'rgba(0,0,0,0.5)'` → `background: 'var(--nav-arrow-bg)'`
- `background: i === current ? '#4a9eff' : 'rgba(255,255,255,0.15)'` → `background: i === current ? 'var(--accent)' : 'var(--card-carousel-dot-inactive)'`
- Empty state `color: '#6b7280'` → `color: 'var(--text-tertiary)'`
- Nav button `color: '#fff'` → `color: 'var(--text-primary)'`

- [ ] **Step 2: Migrate ScrollList**

Replace:
- `borderBottom: '1px solid rgba(74,158,255,0.06)'` → `borderBottom: '1px solid var(--border-light)'`
- `color: 'rgba(255,255,255,0.7)'` → `color: 'var(--text-secondary)'`

- [ ] **Step 3: Migrate StatusPanel**

Replace:
- `color: '#4a9eff'` → `color: 'var(--accent)'`
- `color: '#ff6d00'` → `color: 'var(--color-warning)'`
- `color: 'rgba(255,255,255,0.3)'` → `color: 'var(--text-muted)'`

- [ ] **Step 4: Verify build**

Run: `pnpm build`
Expected: Build succeeds

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/CardCarousel.tsx src/components/ui/ScrollList.tsx src/components/ui/StatusPanel.tsx
git commit -m "feat(theme): migrate remaining shared UI components to CSS variables"
```

---

### Task 5: Final verification

- [ ] **Step 1: Run full test suite**

Run: `pnpm test --run`
Expected: All 35 tests pass

- [ ] **Step 2: Run final build**

Run: `pnpm build`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "chore: verify all tests and build after UI theme switch"
```
