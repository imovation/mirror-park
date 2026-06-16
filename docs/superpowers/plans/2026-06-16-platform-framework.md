# Platform Framework Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the smart campus visualization platform framework — CSS Grid layout, 3D scene base, theme navigation, UI component library, data layer skeleton, and error handling. All 6 themes get placeholder stubs.

**Architecture:** Monolithic React SPA with Vite. Central R3F Canvas for 3D, left/right panels for data, CSS Grid for layout. Zustand stores (3 global + 6 per-theme stubs). TanStack Query for data fetching with MSW mock layer. ECharts for charts. Zero real APIs — all data is mock.

**Tech Stack:** React 18, TypeScript, Vite 5, Three.js (@react-three/fiber + drei), ECharts 5, Zustand, TanStack Query v5, MSW + @faker-js/faker, TailwindCSS, vitest + @testing-library/react

---

## File Structure Map

```
mirror-park/
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── vitest.config.ts
├── public/
│   └── mockServiceWorker.js          # MSW generated
└── src/
    ├── main.tsx                       # Entry, MSW init, App render
    ├── App.tsx                        # QueryClientProvider + ScreenLayout
    ├── index.css                      # Tailwind directives + global resets
    ├── types/
    │   ├── theme.ts                   # Theme enum, ThemeConfig
    │   ├── panel.ts                   # PanelConfig, DashboardPanelProps
    │   └── api.ts                     # ApiResponse<T>, QueryKeys
    ├── utils/
    │   ├── constants.ts               # Layout sizes, refresh intervals
    │   └── format.ts                  # formatNumber, formatPercent, formatTime
    ├── stores/
    │   ├── useThemeStore.ts           # currentTheme, switchTheme
    │   ├── useSceneStore.ts           # cameraTarget, selectedObjectId
    │   ├── useUIStore.ts              # modalStack, alertQueue
    │   └── themes/
    │       ├── useOverviewStore.ts
    │       ├── useTeachingResearchStore.ts
    │       ├── useAdminStore.ts
    │       ├── useLibraryStore.ts
    │       ├── useAcademicsStore.ts
    │       └── useSecurityStore.ts
    ├── components/
    │   ├── layout/
    │   │   ├── ScreenLayout.tsx        # CSS Grid container
    │   │   ├── TopBar.tsx              # Title + Clock + ThemeNav
    │   │   ├── LeftPanel.tsx           # Left panel stack
    │   │   ├── RightPanel.tsx          # Right panel stack
    │   │   └── BottomBar.tsx           # Bottom info bar
    │   ├── ui/
    │   │   ├── DashboardPanel.tsx      # Generic panel wrapper
    │   │   ├── NumberFlip.tsx          # Animated number display
    │   │   ├── ScrollList.tsx          # Auto-scrolling list
    │   │   └── Modal.tsx               # Modal overlay system
    │   ├── charts/
    │   │   ├── BarChart.tsx
    │   │   ├── LineChart.tsx
    │   │   ├── PieChart.tsx
    │   │   ├── RingChart.tsx
    │   │   ├── GaugeChart.tsx
    │   │   └── HeatmapChart.tsx
    │   └── scene/
    │       ├── SceneCanvas.tsx          # R3F Canvas wrapper
    │       ├── CampusBase.tsx           # Base geometry scene
    │       └── CameraController.tsx     # Orbit + preset paths
    ├── hooks/
    │   ├── useSceneClick.ts
    │   └── useAutoScroll.ts
    ├── api/
    │   ├── client.ts                   # Fetch wrapper with base URL
    │   ├── queries/
    │   │   └── overview.ts             # Example query hook
    │   └── mocks/
    │       ├── server.ts               # MSW setup (imports all handlers)
    │       └── handlers/
    │           └── overview.ts
    ├── themes/
    │   ├── overview/
    │   │   ├── OverviewScene.tsx
    │   │   ├── panels/
    │   │   │   └── SchoolInfo.tsx
    │   │   └── index.ts
    │   ├── teaching-research/
    │   │   ├── TeachingResearchScene.tsx
    │   │   ├── panels/
    │   │   │   └── Placeholder.tsx
    │   │   └── index.ts
    │   ├── admin/
    │   │   ├── AdminScene.tsx
    │   │   ├── panels/Placeholder.tsx
    │   │   └── index.ts
    │   ├── library/
    │   │   ├── LibraryScene.tsx
    │   │   ├── panels/Placeholder.tsx
    │   │   └── index.ts
    │   ├── academics/
    │   │   ├── AcademicsScene.tsx
    │   │   ├── panels/Placeholder.tsx
    │   │   └── index.ts
    │   └── security/
    │       ├── SecurityScene.tsx
    │       ├── panels/Placeholder.tsx
    │       └── index.ts
    └── __tests__/
        ├── unit/
        │   ├── format.test.ts
        │   └── stores.test.ts
        └── component/
            ├── NumberFlip.test.tsx
            └── DashboardPanel.test.tsx
```

---

### Task 1: Project Scaffold with Vite + React + TypeScript

**Files:**
- Create: `package.json`, `tsconfig.json`, `tsconfig.node.json`, `vite.config.ts`, `index.html`, `src/main.tsx`, `src/App.tsx`, `src/index.css`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "smart-campus-viz",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite --port 3000",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest",
    "lint": "eslint src --ext .ts,.tsx"
  },
  "dependencies": {
    "@react-three/drei": "^9.114.0",
    "@react-three/fiber": "^8.17.0",
    "@tanstack/react-query": "^5.59.0",
    "echarts": "^5.5.1",
    "echarts-for-react": "^3.0.2",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "three": "^0.169.0",
    "zustand": "^5.0.0"
  },
  "devDependencies": {
    "@faker-js/faker": "^9.2.0",
    "@testing-library/jest-dom": "^6.6.0",
    "@testing-library/react": "^16.0.0",
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "@types/three": "^0.169.0",
    "@vitejs/plugin-react": "^4.3.4",
    "autoprefixer": "^10.4.20",
    "jsdom": "^25.0.1",
    "msw": "^2.6.0",
    "postcss": "^8.4.49",
    "tailwindcss": "^3.4.15",
    "typescript": "^5.6.3",
    "vite": "^5.4.11",
    "vitest": "^2.1.8"
  },
  "msw": {
    "workerDirectory": ["public"]
  }
}
```

- [ ] **Step 2: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noFallthroughCasesInSwitch": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src", "vite-env.d.ts"]
}
```

- [ ] **Step 3: Create tsconfig.node.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2023"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "strict": true
  },
  "include": ["vite.config.ts"]
}
```

- [ ] **Step 4: Create vite.config.ts**

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
})
```

- [ ] **Step 5: Create index.html**

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>智慧校园可视化平台</title>
  </head>
  <body class="bg-gray-950 text-white overflow-hidden">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 6: Create src/index.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

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
  background: #0a1628;
}

::-webkit-scrollbar {
  width: 4px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: rgba(74, 158, 255, 0.3);
  border-radius: 2px;
}
```

- [ ] **Step 7: Create src/main.tsx**

```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

async function bootstrap() {
  if (import.meta.env.DEV) {
    const { worker } = await import('./api/mocks/server')
    await worker.start({ onUnhandledRequest: 'bypass' })
  }
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
}

bootstrap()
```

- [ ] **Step 8: Create minimal src/App.tsx to verify setup**

```typescript
function App() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-950 text-blue-400 text-2xl">
      智慧校园可视化平台
    </div>
  )
}

export default App
```

- [ ] **Step 9: Create vite-env.d.ts**

```typescript
/// <reference types="vite/client" />
```

- [ ] **Step 10: Install dependencies and verify**

```bash
pnpm install
pnpm dev
```

Expected: Browser shows "智慧校园可视化平台" centered text on dark background.

- [ ] **Step 11: Commit**

```bash
git add -A
git commit -m "feat: initialize project scaffold with Vite + React + TypeScript"
```

---

### Task 2: Type Definitions

**Files:**
- Create: `src/types/theme.ts`, `src/types/panel.ts`, `src/types/api.ts`

- [ ] **Step 1: Create src/types/theme.ts**

```typescript
export enum ThemeId {
  OVERVIEW = 'overview',
  TEACHING_RESEARCH = 'teaching-research',
  ADMIN = 'admin',
  LIBRARY = 'library',
  ACADEMICS = 'academics',
  SECURITY = 'security',
}

export interface ThemeConfig {
  id: ThemeId
  label: string
  icon?: string
}

export const THEMES: ThemeConfig[] = [
  { id: ThemeId.OVERVIEW, label: '综合态势' },
  { id: ThemeId.TEACHING_RESEARCH, label: '教学研究' },
  { id: ThemeId.ADMIN, label: '行政办公' },
  { id: ThemeId.LIBRARY, label: '智慧图书' },
  { id: ThemeId.ACADEMICS, label: '智慧教学' },
  { id: ThemeId.SECURITY, label: '智慧安防' },
]
```

- [ ] **Step 2: Create src/types/panel.ts**

```typescript
import type { ReactNode } from 'react'

export interface PanelConfig {
  id: string
  title: string
  height?: 'auto' | 'flex-1' | 'flex-2'
}

export interface DashboardPanelProps {
  config: PanelConfig
  children: ReactNode
}
```

- [ ] **Step 3: Create src/types/api.ts**

```typescript
export type UpdateLevel = 'realtime' | 'near-realtime' | 'periodic' | 'base'

export interface ApiQueryConfig {
  level: UpdateLevel
  key: string
}

export const QUERY_KEYS = {
  overview: {
    schoolInfo: ['overview', 'schoolInfo'],
    personnel: ['overview', 'personnel'],
    teacherDist: ['overview', 'teacherDist'],
    studentInfo: ['overview', 'studentInfo'],
    activity: ['overview', 'activity'],
  },
} as const
```

- [ ] **Step 4: Commit**

```bash
git add src/types/
git commit -m "feat: add TypeScript type definitions for themes, panels, and API"
```

---

### Task 3: Utility Functions

**Files:**
- Create: `src/utils/constants.ts`, `src/utils/format.ts`, `src/__tests__/unit/format.test.ts`

- [ ] **Step 1: Write failing test for format utilities**

Create `src/__tests__/unit/format.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { formatNumber, formatPercent, formatTime } from '@/utils/format'

describe('formatNumber', () => {
  it('formats numbers with commas', () => {
    expect(formatNumber(12345)).toBe('12,345')
    expect(formatNumber(1000000)).toBe('1,000,000')
  })

  it('handles zero', () => {
    expect(formatNumber(0)).toBe('0')
  })

  it('handles negative numbers', () => {
    expect(formatNumber(-1234)).toBe('-1,234')
  })
})

describe('formatPercent', () => {
  it('formats decimal as percentage', () => {
    expect(formatPercent(0.856)).toBe('85.6%')
    expect(formatPercent(1)).toBe('100.0%')
  })

  it('handles zero', () => {
    expect(formatPercent(0)).toBe('0.0%')
  })
})

describe('formatTime', () => {
  it('formats date to HH:mm', () => {
    const date = new Date('2025-06-16T14:30:00')
    expect(formatTime(date)).toBe('14:30')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
pnpm test -- src/__tests__/unit/format.test.ts
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement format utilities**

Create `src/utils/format.ts`:

```typescript
export function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export function formatPercent(value: number, decimals: number = 1): string {
  return (value * 100).toFixed(decimals) + '%'
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false })
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' })
}
```

- [ ] **Step 4: Create src/utils/constants.ts**

```typescript
export const LAYOUT = {
  LEFT_PANEL_WIDTH: '20%',
  RIGHT_PANEL_WIDTH: '20%',
  TOP_BAR_HEIGHT: '56px',
  BOTTOM_BAR_HEIGHT: '32px',
} as const

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
    position: [0, 80, 40] as [number, number, number],
    target: [0, 0, 0] as [number, number, number],
  },
} as const
```

- [ ] **Step 5: Run tests**

```bash
pnpm test -- src/__tests__/unit/format.test.ts
```

Expected: All 5 tests PASS.

- [ ] **Step 6: Commit**

```bash
git add src/utils/ src/__tests__/
git commit -m "feat: add utility functions and constants"
```

---

### Task 4: Zustand Stores (Global + Theme Stubs)

**Files:**
- Create: `src/stores/useThemeStore.ts`, `src/stores/useSceneStore.ts`, `src/stores/useUIStore.ts`, `src/stores/themes/useOverviewStore.ts`, `src/stores/themes/useTeachingResearchStore.ts`, `src/stores/themes/useAdminStore.ts`, `src/stores/themes/useLibraryStore.ts`, `src/stores/themes/useAcademicsStore.ts`, `src/stores/themes/useSecurityStore.ts`

- [ ] **Step 1: Write failing test for theme store**

Create `src/__tests__/unit/stores.test.ts`:

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { useThemeStore } from '@/stores/useThemeStore'
import { ThemeId } from '@/types/theme'

describe('useThemeStore', () => {
  beforeEach(() => {
    useThemeStore.setState({ currentTheme: ThemeId.OVERVIEW, isTransitioning: false })
  })

  it('starts with overview theme', () => {
    expect(useThemeStore.getState().currentTheme).toBe(ThemeId.OVERVIEW)
  })

  it('switches theme', () => {
    useThemeStore.getState().switchTheme(ThemeId.LIBRARY)
    expect(useThemeStore.getState().currentTheme).toBe(ThemeId.LIBRARY)
  })

  it('sets transitioning flag during switch', () => {
    useThemeStore.getState().switchTheme(ThemeId.SECURITY)
    expect(useThemeStore.getState().isTransitioning).toBe(true)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
pnpm test -- src/__tests__/unit/stores.test.ts
```

Expected: FAIL.

- [ ] **Step 3: Create useThemeStore**

Create `src/stores/useThemeStore.ts`:

```typescript
import { create } from 'zustand'
import { ThemeId, THEMES } from '@/types/theme'

interface ThemeState {
  currentTheme: ThemeId
  isTransitioning: boolean
  allThemes: typeof THEMES
  switchTheme: (theme: ThemeId) => void
  finishTransition: () => void
}

export const useThemeStore = create<ThemeState>((set) => ({
  currentTheme: ThemeId.OVERVIEW,
  isTransitioning: false,
  allThemes: THEMES,
  switchTheme: (theme: ThemeId) => {
    set({ currentTheme: theme, isTransitioning: true })
  },
  finishTransition: () => {
    set({ isTransitioning: false })
  },
}))
```

- [ ] **Step 4: Create useSceneStore**

Create `src/stores/useSceneStore.ts`:

```typescript
import { create } from 'zustand'

interface SceneState {
  cameraTarget: [number, number, number]
  selectedObjectId: string | null
  isSceneLoaded: boolean
  setCameraTarget: (target: [number, number, number]) => void
  selectObject: (id: string | null) => void
  setSceneLoaded: (loaded: boolean) => void
}

export const useSceneStore = create<SceneState>((set) => ({
  cameraTarget: [0, 0, 0],
  selectedObjectId: null,
  isSceneLoaded: false,
  setCameraTarget: (target) => set({ cameraTarget: target }),
  selectObject: (id) => set({ selectedObjectId: id }),
  setSceneLoaded: (loaded) => set({ isSceneLoaded: loaded }),
}))
```

- [ ] **Step 5: Create useUIStore**

Create `src/stores/useUIStore.ts`:

```typescript
import { create } from 'zustand'

interface Alert {
  id: string
  type: 'warning' | 'error' | 'info'
  message: string
  timestamp: Date
}

interface UIState {
  modalStack: string[]
  alertQueue: Alert[]
  pushModal: (id: string) => void
  popModal: () => void
  clearModals: () => void
  addAlert: (alert: Omit<Alert, 'id' | 'timestamp'>) => void
  dismissAlert: (id: string) => void
}

export const useUIStore = create<UIState>((set) => ({
  modalStack: [],
  alertQueue: [],
  pushModal: (id) => set((s) => ({ modalStack: [...s.modalStack, id] })),
  popModal: () => set((s) => ({ modalStack: s.modalStack.slice(0, -1) })),
  clearModals: () => set({ modalStack: [] }),
  addAlert: (alert) =>
    set((s) => ({
      alertQueue: [
        ...s.alertQueue,
        { ...alert, id: crypto.randomUUID(), timestamp: new Date() },
      ],
    })),
  dismissAlert: (id) =>
    set((s) => ({ alertQueue: s.alertQueue.filter((a) => a.id !== id) })),
}))
```

- [ ] **Step 6: Create 6 theme store stubs**

Create `src/stores/themes/useOverviewStore.ts`:

```typescript
import { create } from 'zustand'

interface OverviewState {
  selectedBuildingId: string | null
  setSelectedBuilding: (id: string | null) => void
}

export const useOverviewStore = create<OverviewState>((set) => ({
  selectedBuildingId: null,
  setSelectedBuilding: (id) => set({ selectedBuildingId: id }),
}))
```

Create `src/stores/themes/useTeachingResearchStore.ts`:

```typescript
import { create } from 'zustand'

interface TeachingResearchState {
  _initialized: boolean
}

export const useTeachingResearchStore = create<TeachingResearchState>(() => ({
  _initialized: false,
}))
```

Create `src/stores/themes/useAdminStore.ts`:

```typescript
import { create } from 'zustand'

interface AdminState {
  _initialized: boolean
}

export const useAdminStore = create<AdminState>(() => ({
  _initialized: false,
}))
```

Create `src/stores/themes/useLibraryStore.ts`:

```typescript
import { create } from 'zustand'

interface LibraryState {
  _initialized: boolean
}

export const useLibraryStore = create<LibraryState>(() => ({
  _initialized: false,
}))
```

Create `src/stores/themes/useAcademicsStore.ts`:

```typescript
import { create } from 'zustand'

interface AcademicsState {
  _initialized: boolean
}

export const useAcademicsStore = create<AcademicsState>(() => ({
  _initialized: false,
}))
```

Create `src/stores/themes/useSecurityStore.ts`:

```typescript
import { create } from 'zustand'

interface SecurityState {
  _initialized: boolean
}

export const useSecurityStore = create<SecurityState>(() => ({
  _initialized: false,
}))
```

- [ ] **Step 7: Run tests**

```bash
pnpm test -- src/__tests__/unit/stores.test.ts
```

Expected: 3 tests PASS.

- [ ] **Step 8: Run all tests**

```bash
pnpm test
```

Expected: All 8 tests PASS.

- [ ] **Step 9: Commit**

```bash
git add src/stores/ src/__tests__/
git commit -m "feat: add Zustand stores (global + theme stubs)"
```

---

### Task 5: CSS Grid Screen Layout

**Files:**
- Create: `src/components/layout/ScreenLayout.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Create ScreenLayout**

Create `src/components/layout/ScreenLayout.tsx`:

```typescript
import type { ReactNode } from 'react'

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
        gridTemplateRows: '56px 1fr 32px',
        gridTemplateColumns: '260px 1fr 260px',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      <div style={{ gridArea: 'topbar' }}>{topBar}</div>
      <div style={{ gridArea: 'left', overflow: 'auto' }}>{leftPanel}</div>
      <div style={{ gridArea: 'scene', position: 'relative', overflow: 'hidden' }}>{scene}</div>
      <div style={{ gridArea: 'right', overflow: 'auto' }}>{rightPanel}</div>
      <div style={{ gridArea: 'bottombar' }}>{bottomBar}</div>
    </div>
  )
}
```

- [ ] **Step 2: Update App.tsx with placeholder layout**

Replace `src/App.tsx`:

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import ScreenLayout from '@/components/layout/ScreenLayout'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ScreenLayout
        topBar={<PlaceholderChild name="TopBar" />}
        leftPanel={<PlaceholderChild name="LeftPanel" />}
        scene={<PlaceholderChild name="3D Scene" />}
        rightPanel={<PlaceholderChild name="RightPanel" />}
        bottomBar={<PlaceholderChild name="BottomBar" />}
      />
    </QueryClientProvider>
  )
}

function PlaceholderChild({ name }: { name: string }) {
  return (
    <div className="w-full h-full flex items-center justify-center border border-blue-900/50 bg-black/30 text-blue-400 text-sm">
      {name}
    </div>
  )
}

export default App
```

- [ ] **Step 3: Verify**

```bash
pnpm dev
```

Expected: Browser shows 5-zone grid layout with labeled placeholders in each zone.

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/ScreenLayout.tsx src/App.tsx
git commit -m "feat: add CSS Grid screen layout with 5 zones"
```

---

### Task 6: TopBar — Title, Clock, and Theme Navigation

**Files:**
- Create: `src/components/layout/TopBar.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Create TopBar**

Create `src/components/layout/TopBar.tsx`:

```typescript
import { useState, useEffect } from 'react'
import { useThemeStore } from '@/stores/useThemeStore'
import { ThemeId, THEMES } from '@/types/theme'

export default function TopBar() {
  const currentTheme = useThemeStore((s) => s.currentTheme)
  const switchTheme = useThemeStore((s) => s.switchTheme)
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const timeStr = time.toLocaleTimeString('zh-CN', { hour12: false })
  const dateStr = time.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
  })

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '100%',
        padding: '0 24px',
        background: 'linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 100%)',
        borderBottom: '1px solid rgba(74, 158, 255, 0.15)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 20, fontWeight: 'bold', color: '#4a9eff', letterSpacing: 2 }}>
          智慧校园可视化平台
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {THEMES.map((t) => (
          <button
            key={t.id}
            onClick={() => switchTheme(t.id)}
            style={{
              padding: '6px 16px',
              border: 'none',
              borderRadius: 4,
              background: currentTheme === t.id ? 'rgba(74,158,255,0.2)' : 'transparent',
              color: currentTheme === t.id ? '#4a9eff' : 'rgba(255,255,255,0.5)',
              fontSize: 13,
              cursor: 'pointer',
              transition: 'all 0.3s',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
        <span>{dateStr}</span>
        <span style={{ fontSize: 16, color: '#4a9eff', fontFamily: 'monospace' }}>{timeStr}</span>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Update App.tsx to use TopBar**

Replace the `topBar` prop in `App.tsx`:

```typescript
import TopBar from '@/components/layout/TopBar'
// ... existing imports

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ScreenLayout
        topBar={<TopBar />}
        leftPanel={<PlaceholderChild name="LeftPanel" />}
        // ... rest remains
      />
    </QueryClientProvider>
  )
}
```

- [ ] **Step 3: Verify**

```bash
pnpm dev
```

Expected: TopBar shows title, 6 theme nav buttons, date, and live clock. Clicking nav buttons updates the highlighted tab.

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/TopBar.tsx src/App.tsx
git commit -m "feat: add TopBar with title, clock, and theme navigation"
```

---

### Task 7: LeftPanel, RightPanel, and DashboardPanel

**Files:**
- Create: `src/components/layout/LeftPanel.tsx`, `src/components/layout/RightPanel.tsx`, `src/components/ui/DashboardPanel.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Create DashboardPanel**

Create `src/components/ui/DashboardPanel.tsx`:

```typescript
import type { ReactNode } from 'react'

interface DashboardPanelProps {
  title: string
  children: ReactNode
}

export default function DashboardPanel({ title, children }: DashboardPanelProps) {
  return (
    <div
      style={{
        margin: '6px 8px',
        background: 'rgba(0, 0, 0, 0.35)',
        border: '1px solid rgba(74, 158, 255, 0.12)',
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
          color: '#4a9eff',
          borderBottom: '1px solid rgba(74, 158, 255, 0.1)',
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

- [ ] **Step 2: Create LeftPanel**

Create `src/components/layout/LeftPanel.tsx`:

```typescript
import type { ReactNode } from 'react'

interface LeftPanelProps {
  children: ReactNode
}

export default function LeftPanel({ children }: LeftPanelProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', paddingTop: 4 }}>
      {children}
    </div>
  )
}
```

- [ ] **Step 3: Create RightPanel**

Create `src/components/layout/RightPanel.tsx`:

```typescript
import type { ReactNode } from 'react'

interface RightPanelProps {
  children: ReactNode
}

export default function RightPanel({ children }: RightPanelProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', paddingTop: 4 }}>
      {children}
    </div>
  )
}
```

- [ ] **Step 4: Update App.tsx with panels**

Replace `src/App.tsx`:

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import ScreenLayout from '@/components/layout/ScreenLayout'
import TopBar from '@/components/layout/TopBar'
import LeftPanel from '@/components/layout/LeftPanel'
import RightPanel from '@/components/layout/RightPanel'
import DashboardPanel from '@/components/ui/DashboardPanel'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ScreenLayout
        topBar={<TopBar />}
        leftPanel={
          <LeftPanel>
            <DashboardPanel title="面板左-1">
              <span className="text-gray-500 text-xs">数据面板内容</span>
            </DashboardPanel>
            <DashboardPanel title="面板左-2">
              <span className="text-gray-500 text-xs">数据面板内容</span>
            </DashboardPanel>
            <DashboardPanel title="面板左-3">
              <span className="text-gray-500 text-xs">数据面板内容</span>
            </DashboardPanel>
          </LeftPanel>
        }
        scene={<PlaceholderChild name="3D Scene" />}
        rightPanel={
          <RightPanel>
            <DashboardPanel title="面板右-1">
              <span className="text-gray-500 text-xs">数据面板内容</span>
            </DashboardPanel>
            <DashboardPanel title="面板右-2">
              <span className="text-gray-500 text-xs">数据面板内容</span>
            </DashboardPanel>
            <DashboardPanel title="面板右-3">
              <span className="text-gray-500 text-xs">数据面板内容</span>
            </DashboardPanel>
          </RightPanel>
        }
        bottomBar={<PlaceholderChild name="BottomBar" />}
      />
    </QueryClientProvider>
  )
}

function PlaceholderChild({ name }: { name: string }) {
  return (
    <div className="w-full h-full flex items-center justify-center border border-blue-900/50 bg-black/30 text-blue-400 text-sm">
      {name}
    </div>
  )
}

export default App
```

- [ ] **Step 5: Write component test for DashboardPanel**

Create `src/__tests__/component/DashboardPanel.test.tsx`:

```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import DashboardPanel from '@/components/ui/DashboardPanel'

describe('DashboardPanel', () => {
  it('renders title and children', () => {
    render(
      <DashboardPanel title="Test Panel">
        <span>Content here</span>
      </DashboardPanel>,
    )
    expect(screen.getByText('Test Panel')).toBeDefined()
    expect(screen.getByText('Content here')).toBeDefined()
  })
})
```

- [ ] **Step 6: Configure vitest for React components**

Create `vitest.config.ts`:

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/__tests__/setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

Create `src/__tests__/setup.ts`:

```typescript
import '@testing-library/jest-dom'
```

- [ ] **Step 7: Run tests**

```bash
pnpm test
```

Expected: All tests PASS.

- [ ] **Step 8: Verify visually**

```bash
pnpm dev
```

Expected: Left and right panels show 3 stacked DashboardPanels each. 3D scene placeholder in center.

- [ ] **Step 9: Commit**

```bash
git add src/components/layout/LeftPanel.tsx src/components/layout/RightPanel.tsx src/components/ui/DashboardPanel.tsx src/App.tsx vitest.config.ts src/__tests__/setup.ts src/__tests__/component/
git commit -m "feat: add LeftPanel, RightPanel, DashboardPanel with tests"
```

---

### Task 8: BottomBar

**Files:**
- Create: `src/components/layout/BottomBar.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Create BottomBar**

Create `src/components/layout/BottomBar.tsx`:

```typescript
export default function BottomBar() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        padding: '0 24px',
        background: 'rgba(0,0,0,0.4)',
        borderTop: '1px solid rgba(74, 158, 255, 0.1)',
        fontSize: 11,
        color: 'rgba(255,255,255,0.3)',
      }}
    >
      <span>智慧校园可视化平台 v0.1.0 | 数据更新时间: --</span>
    </div>
  )
}
```

- [ ] **Step 2: Update App.tsx to use BottomBar**

Replace the bottomBar prop in `App.tsx`:

```typescript
import BottomBar from '@/components/layout/BottomBar'

// In App, replace:
bottomBar={<BottomBar />}
```

- [ ] **Step 3: Verify**

```bash
pnpm dev
```

Expected: Bottom bar shows version and placeholder update time.

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/BottomBar.tsx src/App.tsx
git commit -m "feat: add BottomBar component"
```

---

### Task 9: Three.js R3F Scene Canvas + Camera

**Files:**
- Create: `src/components/scene/SceneCanvas.tsx`, `src/components/scene/CameraController.tsx`, `src/components/scene/CampusBase.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Create CampusBase — simple ground plane and placeholder buildings**

Create `src/components/scene/CampusBase.tsx`:

```typescript
import { Box, Plane } from '@react-three/drei'

interface BuildingData {
  id: string
  position: [number, number, number]
  size: [number, number, number]
  color: string
}

const BUILDINGS: BuildingData[] = [
  { id: 'b1', position: [-15, 5, 0], size: [8, 10, 6], color: '#1a3a5c' },
  { id: 'b2', position: [-5, 6, -8], size: [10, 12, 8], color: '#1e3a5f' },
  { id: 'b3', position: [10, 4, -5], size: [6, 8, 5], color: '#1c3558' },
  { id: 'b4', position: [0, 7, 10], size: [14, 14, 10], color: '#1b3a5e' },
  { id: 'b5', position: [18, 3, 8], size: [5, 6, 4], color: '#223a60' },
]

export default function CampusBase() {
  return (
    <group>
      <Plane
        args={[80, 80]}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.01, 0]}
        receiveShadow
      >
        <meshStandardMaterial color="#0d2137" />
      </Plane>

      {BUILDINGS.map((b) => (
        <Box key={b.id} args={b.size} position={b.position} castShadow receiveShadow>
          <meshStandardMaterial color={b.color} transparent opacity={0.85} />
        </Box>
      ))}

      <ambientLight intensity={0.4} />
      <directionalLight position={[20, 30, 10]} intensity={0.8} castShadow />
      <pointLight position={[0, 15, 0]} intensity={0.3} />
    </group>
  )
}
```

- [ ] **Step 2: Create CameraController**

Create `src/components/scene/CameraController.tsx`:

```typescript
import { useRef, useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { SCENE } from '@/utils/constants'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'

export default function CameraController() {
  const controlsRef = useRef<OrbitControlsImpl>(null)
  const { camera } = useThree()

  useEffect(() => {
    camera.position.set(...SCENE.DEFAULT_CAMERA.position)
    camera.lookAt(...SCENE.DEFAULT_CAMERA.target)
  }, [camera])

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.08}
      autoRotate
      autoRotateSpeed={0.3}
      minDistance={10}
      maxDistance={100}
      maxPolarAngle={Math.PI / 2.2}
      target={SCENE.DEFAULT_CAMERA.target}
    />
  )
}
```

- [ ] **Step 3: Create SceneCanvas**

Create `src/components/scene/SceneCanvas.tsx`:

```typescript
import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import CampusBase from './CampusBase'
import CameraController from './CameraController'

export default function SceneCanvas() {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Canvas
        camera={{ fov: 50, near: 0.1, far: 1000 }}
        style={{ background: 'linear-gradient(180deg, #0a1628 0%, #16213e 100%)' }}
      >
        <fog attach="fog" args={['#0a1628', 50, 300]} />
        <Suspense fallback={null}>
          <CampusBase />
          <CameraController />
        </Suspense>
      </Canvas>
    </div>
  )
}
```

- [ ] **Step 4: Update App.tsx to use SceneCanvas**

Replace scene prop in `App.tsx`:

```typescript
import SceneCanvas from '@/components/scene/SceneCanvas'

// In App:
scene={<SceneCanvas />}
```

- [ ] **Step 5: Verify**

```bash
pnpm dev
```

Expected: 3D scene renders with dark ground plane, 5 building boxes, auto-rotating camera. Mouse drag/scroll rotates and zooms.

- [ ] **Step 6: Commit**

```bash
git add src/components/scene/CampusBase.tsx src/components/scene/CameraController.tsx src/components/scene/SceneCanvas.tsx src/App.tsx
git commit -m "feat: add Three.js scene canvas with camera controls and placeholder campus"
```

---

### Task 10: UI Components — NumberFlip, ScrollList, Modal

**Files:**
- Create: `src/components/ui/NumberFlip.tsx`, `src/components/ui/ScrollList.tsx`, `src/components/ui/Modal.tsx`
- Create: `src/__tests__/component/NumberFlip.test.tsx`

- [ ] **Step 1: Write failing test for NumberFlip**

Create `src/__tests__/component/NumberFlip.test.tsx`:

```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import NumberFlip from '@/components/ui/NumberFlip'

describe('NumberFlip', () => {
  it('renders a number with unit', () => {
    render(<NumberFlip value={12345} unit="人" />)
    expect(screen.getByText('人')).toBeDefined()
  })

  it('renders zero', () => {
    render(<NumberFlip value={0} />)
    expect(screen.getByText('0')).toBeDefined()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
pnpm test -- src/__tests__/component/NumberFlip.test.tsx
```

Expected: FAIL.

- [ ] **Step 3: Create NumberFlip**

Create `src/components/ui/NumberFlip.tsx`:

```typescript
import { formatNumber } from '@/utils/format'

interface NumberFlipProps {
  value: number
  unit?: string
  label?: string
  color?: string
}

export default function NumberFlip({ value, unit, label, color = '#4a9eff' }: NumberFlipProps) {
  return (
    <div style={{ textAlign: 'center' }}>
      {label && (
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>
          {label}
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 4 }}>
        <span style={{ fontSize: 28, fontWeight: 'bold', color, fontFamily: 'monospace' }}>
          {formatNumber(value)}
        </span>
        {unit && (
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{unit}</span>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Create ScrollList**

Create `src/components/ui/ScrollList.tsx`:

```typescript
import { useEffect, useRef, useState } from 'react'

interface ScrollItem {
  id: string
  content: React.ReactNode
}

interface ScrollListProps {
  items: ScrollItem[]
  speed?: number
  maxHeight?: number
}

export default function ScrollList({ items, speed = 2000, maxHeight = 150 }: ScrollListProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)
  const scrollRef = useRef<number>(0)

  useEffect(() => {
    if (isPaused || items.length <= 3) return
    const interval = setInterval(() => {
      if (!containerRef.current) return
      scrollRef.current += 1
      containerRef.current.scrollTop = scrollRef.current
      if (scrollRef.current >= containerRef.current.scrollHeight - containerRef.current.clientHeight) {
        scrollRef.current = 0
      }
    }, 50)
    return () => clearInterval(interval)
  }, [isPaused, items.length])

  return (
    <div
      ref={containerRef}
      style={{ maxHeight, overflow: 'hidden' }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {items.map((item) => (
        <div key={item.id} style={{ padding: '4px 0', borderBottom: '1px solid rgba(74,158,255,0.06)', fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>
          {item.content}
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 5: Create Modal**

Create `src/components/ui/Modal.tsx`:

```typescript
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
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(4px)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width,
          maxHeight: '80vh',
          background: 'rgba(10, 22, 40, 0.95)',
          border: '1px solid rgba(74, 158, 255, 0.3)',
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
            borderBottom: '1px solid rgba(74,158,255,0.15)',
            color: '#4a9eff',
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
              color: 'rgba(255,255,255,0.5)',
              cursor: 'pointer',
              fontSize: 18,
            }}
          >
            ✕
          </button>
        </div>
        <div style={{ padding: 20, color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>
          {children}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 6: Run tests**

```bash
pnpm test
```

Expected: All tests PASS (format + stores + DashboardPanel + NumberFlip).

- [ ] **Step 7: Commit**

```bash
git add src/components/ui/NumberFlip.tsx src/components/ui/ScrollList.tsx src/components/ui/Modal.tsx src/__tests__/component/NumberFlip.test.tsx
git commit -m "feat: add NumberFlip, ScrollList, and Modal UI components"
```

---

### Task 11: ECharts Chart Wrapper Components

**Files:**
- Create: `src/components/charts/BarChart.tsx`, `src/components/charts/LineChart.tsx`, `src/components/charts/PieChart.tsx`, `src/components/charts/RingChart.tsx`, `src/components/charts/GaugeChart.tsx`, `src/components/charts/HeatmapChart.tsx`

- [ ] **Step 1: Create BarChart**

Create `src/components/charts/BarChart.tsx`:

```typescript
import ReactECharts from 'echarts-for-react'
import type { EChartsOption } from 'echarts'

interface BarChartProps {
  data: { name: string; value: number }[]
  height?: number
  horizontal?: boolean
  color?: string
}

export default function BarChart({ data, height = 200, horizontal = true, color = '#4a9eff' }: BarChartProps) {
  const option: EChartsOption = {
    tooltip: { trigger: 'axis' },
    grid: { left: 10, right: 20, top: 5, bottom: 5, containLabel: true },
    [horizontal ? 'yAxis' : 'xAxis']: {
      type: 'category',
      data: data.map((d) => d.name),
      axisLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 11 },
      axisLine: { show: false },
      axisTick: { show: false },
    },
    [horizontal ? 'xAxis' : 'yAxis']: {
      type: 'value',
      splitLine: { lineStyle: { color: 'rgba(74,158,255,0.08)' } },
      axisLabel: { color: 'rgba(255,255,255,0.4)', fontSize: 10 },
    },
    series: [
      {
        type: 'bar',
        data: data.map((d) => d.value),
        itemStyle: {
          color,
          borderRadius: horizontal ? [0, 3, 3, 0] : [3, 3, 0, 0],
          opacity: 0.85,
        },
        barWidth: '50%',
      },
    ],
  }

  return <ReactECharts option={option} style={{ height, width: '100%' }} notMerge />
}
```

- [ ] **Step 2: Create LineChart**

Create `src/components/charts/LineChart.tsx`:

```typescript
import ReactECharts from 'echarts-for-react'
import type { EChartsOption } from 'echarts'

interface LineChartProps {
  xData: string[]
  series: { name: string; data: number[]; color?: string }[]
  height?: number
  smooth?: boolean
  area?: boolean
}

export default function LineChart({ xData, series, height = 200, smooth = true, area = true }: LineChartProps) {
  const option: EChartsOption = {
    tooltip: { trigger: 'axis' },
    legend: {
      bottom: 0,
      textStyle: { color: 'rgba(255,255,255,0.5)', fontSize: 10 },
    },
    grid: { left: 10, right: 20, top: 5, bottom: 30, containLabel: true },
    xAxis: {
      type: 'category',
      data: xData,
      axisLabel: { color: 'rgba(255,255,255,0.4)', fontSize: 10 },
      axisLine: { lineStyle: { color: 'rgba(74,158,255,0.15)' } },
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: 'rgba(74,158,255,0.08)' } },
      axisLabel: { color: 'rgba(255,255,255,0.4)', fontSize: 10 },
    },
    series: series.map((s) => ({
      name: s.name,
      type: 'line',
      data: s.data,
      smooth,
      areaStyle: area ? { color: (s.color || '#4a9eff') + '20' } : undefined,
      lineStyle: { color: s.color || '#4a9eff', width: 2 },
      itemStyle: { color: s.color || '#4a9eff' },
    })),
  }

  return <ReactECharts option={option} style={{ height, width: '100%' }} notMerge />
}
```

- [ ] **Step 3: Create PieChart**

Create `src/components/charts/PieChart.tsx`:

```typescript
import ReactECharts from 'echarts-for-react'
import type { EChartsOption } from 'echarts'

interface PieChartProps {
  data: { name: string; value: number }[]
  height?: number
  colors?: string[]
}

const DEFAULT_COLORS = ['#4a9eff', '#00c853', '#ff6d00', '#aa00ff', '#ffc107', '#00bcd4']

export default function PieChart({ data, height = 200, colors = DEFAULT_COLORS }: PieChartProps) {
  const option: EChartsOption = {
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    color: colors,
    series: [
      {
        type: 'pie',
        radius: ['0', '65%'],
        center: ['50%', '50%'],
        data,
        label: {
          color: 'rgba(255,255,255,0.6)',
          fontSize: 10,
        },
        emphasis: {
          itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.5)' },
        },
      },
    ],
  }

  return <ReactECharts option={option} style={{ height, width: '100%' }} notMerge />
}
```

- [ ] **Step 4: Create RingChart**

Create `src/components/charts/RingChart.tsx`:

```typescript
import ReactECharts from 'echarts-for-react'
import type { EChartsOption } from 'echarts'

interface RingChartProps {
  data: { name: string; value: number }[]
  height?: number
  colors?: string[]
  centerLabel?: string
}

const DEFAULT_COLORS = ['#4a9eff', '#ff6d00', '#00c853', '#aa00ff', '#ffc107']

export default function RingChart({ data, height = 200, colors = DEFAULT_COLORS, centerLabel }: RingChartProps) {
  const option: EChartsOption = {
    tooltip: { trigger: 'item' },
    color: colors,
    series: [
      {
        type: 'pie',
        radius: ['50%', '75%'],
        center: ['50%', '50%'],
        data,
        label: { show: false },
        emphasis: { scale: false },
      },
    ],
    graphic: centerLabel
      ? [
          {
            type: 'text',
            left: 'center',
            top: 'center',
            style: {
              text: centerLabel,
              textAlign: 'center',
              fill: '#4a9eff',
              fontSize: 14,
              fontWeight: 'bold',
            },
          },
        ]
      : [],
  }

  return <ReactECharts option={option} style={{ height, width: '100%' }} notMerge />
}
```

- [ ] **Step 5: Create GaugeChart**

Create `src/components/charts/GaugeChart.tsx`:

```typescript
import ReactECharts from 'echarts-for-react'
import type { EChartsOption } from 'echarts'

interface GaugeChartProps {
  value: number
  max?: number
  name?: string
  height?: number
}

export default function GaugeChart({ value, max = 100, name = '', height = 180 }: GaugeChartProps) {
  const option: EChartsOption = {
    series: [
      {
        type: 'gauge',
        startAngle: 210,
        endAngle: -30,
        center: ['50%', '55%'],
        radius: '90%',
        min: 0,
        max,
        axisLine: {
          lineStyle: {
            width: 12,
            color: [
              [0.3, '#00c853'],
              [0.7, '#4a9eff'],
              [1, '#ff6d00'],
            ],
          },
        },
        pointer: { length: '60%', width: 4, itemStyle: { color: '#4a9eff' } },
        axisTick: { distance: -12, length: 6, lineStyle: { color: '#fff', width: 1 } },
        splitLine: { distance: -18, length: 14, lineStyle: { color: '#fff', width: 2 } },
        axisLabel: { color: 'rgba(255,255,255,0.4)', fontSize: 10, distance: 25 },
        detail: {
          valueAnimation: true,
          formatter: '{value}%',
          color: '#4a9eff',
          fontSize: 16,
          offsetCenter: [0, '60%'],
        },
        title: {
          offsetCenter: [0, '85%'],
          color: 'rgba(255,255,255,0.5)',
          fontSize: 11,
        },
        data: [{ value, name }],
      },
    ],
  }

  return <ReactECharts option={option} style={{ height, width: '100%' }} notMerge />
}
```

- [ ] **Step 6: Create HeatmapChart**

Create `src/components/charts/HeatmapChart.tsx`:

```typescript
import ReactECharts from 'echarts-for-react'
import type { EChartsOption } from 'echarts'

interface HeatmapChartProps {
  xLabels: string[]
  yLabels: string[]
  data: [number, number, number][]  // [xIndex, yIndex, value]
  height?: number
}

export default function HeatmapChart({ xLabels, yLabels, data, height = 200 }: HeatmapChartProps) {
  const option: EChartsOption = {
    tooltip: { position: 'top' },
    grid: { left: 60, right: 20, top: 5, bottom: 30 },
    xAxis: {
      type: 'category',
      data: xLabels,
      axisLabel: { color: 'rgba(255,255,255,0.4)', fontSize: 10 },
      splitArea: { show: true },
    },
    yAxis: {
      type: 'category',
      data: yLabels,
      axisLabel: { color: 'rgba(255,255,255,0.4)', fontSize: 10 },
      splitArea: { show: true },
    },
    visualMap: {
      min: 0,
      max: Math.max(...data.map((d) => d[2]), 10),
      calculable: false,
      orient: 'horizontal',
      left: 'center',
      bottom: 0,
      inRange: { color: ['#0a1628', '#1a3a5c', '#2a6090', '#4a9eff', '#7cb9ff'] },
    },
    series: [
      {
        type: 'heatmap',
        data,
        label: { show: false },
        emphasis: { itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.5)' } },
      },
    ],
  }

  return <ReactECharts option={option} style={{ height, width: '100%' }} notMerge />
}
```

- [ ] **Step 7: Verify charts compile**

```bash
pnpm build
```

Expected: Build succeeds.

- [ ] **Step 8: Commit**

```bash
git add src/components/charts/
git commit -m "feat: add ECharts wrapper components (bar, line, pie, ring, gauge, heatmap)"
```

---

### Task 12: Data Layer — TanStack Query + API Client + MSW Mock

**Files:**
- Create: `src/api/client.ts`, `src/api/queries/overview.ts`, `src/api/mocks/server.ts`, `src/api/mocks/handlers/overview.ts`

- [ ] **Step 1: Create API client**

Create `src/api/client.ts`:

```typescript
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

export async function fetchApi<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`)
  }
  return response.json()
}
```

- [ ] **Step 2: Create overview query hooks**

Create `src/api/queries/overview.ts`:

```typescript
import { useQuery } from '@tanstack/react-query'
import { fetchApi } from '../client'
import { REFRESH_INTERVALS } from '@/utils/constants'

export interface SchoolInfo {
  landArea: number
  buildingArea: number
  classCount: number
  buildingCount: number
}

export interface PersonnelComposition {
  totalTeachers: number
  maleRatio: number
  femaleRatio: number
  education: { name: string; value: number }[]
}

export const useSchoolInfo = () =>
  useQuery<SchoolInfo>({
    queryKey: ['overview', 'schoolInfo'],
    queryFn: () => fetchApi<SchoolInfo>('/overview/school-info'),
  })

export const usePersonnelComposition = () =>
  useQuery<PersonnelComposition>({
    queryKey: ['overview', 'personnel'],
    queryFn: () => fetchApi<PersonnelComposition>('/overview/personnel'),
    refetchInterval: REFRESH_INTERVALS.NEAR_REALTIME,
  })
```

- [ ] **Step 3: Create MSW mock handlers**

Create `src/api/mocks/handlers/overview.ts`:

```typescript
import { http, HttpResponse } from 'msw'
import { faker } from '@faker-js/faker'

const BASE = '/api'

export const overviewHandlers = [
  http.get(`${BASE}/overview/school-info`, () => {
    return HttpResponse.json({
      landArea: faker.number.int({ min: 50000, max: 200000 }),
      buildingArea: faker.number.int({ min: 30000, max: 100000 }),
      classCount: 62,
      buildingCount: 9,
    })
  }),

  http.get(`${BASE}/overview/personnel`, () => {
    const maleCount = faker.number.int({ min: 100, max: 200 })
    const femaleCount = faker.number.int({ min: 100, max: 200 })
    const total = maleCount + femaleCount

    return HttpResponse.json({
      totalTeachers: total,
      maleRatio: maleCount / total,
      femaleRatio: femaleCount / total,
      education: [
        { name: '博士', value: faker.number.int({ min: 5, max: 20 }) },
        { name: '硕士', value: faker.number.int({ min: 50, max: 100 }) },
        { name: '本科', value: faker.number.int({ min: 150, max: 250 }) },
        { name: '其他', value: faker.number.int({ min: 5, max: 30 }) },
      ],
    })
  }),
]
```

- [ ] **Step 4: Create MSW server setup**

Create `src/api/mocks/server.ts`:

```typescript
import { setupWorker } from 'msw/browser'
import { overviewHandlers } from './handlers/overview'

export const worker = setupWorker(...overviewHandlers)
```

- [ ] **Step 5: Generate MSW service worker**

```bash
npx msw init public/ --save
```

Expected: `public/mockServiceWorker.js` created. The `--save` option updates `package.json` msw.workerDirectory.

- [ ] **Step 6: Verify MSW works**

```bash
pnpm dev
```

Open browser, check DevTools console for `[MSW] Mocking enabled.`
Check Network tab — requests to `/api/overview/school-info` should return mock data.

- [ ] **Step 7: Commit**

```bash
git add src/api/ public/mockServiceWorker.js
git commit -m "feat: add data layer with TanStack Query, API client, and MSW mock"
```

---

### Task 13: Error Boundaries

**Files:**
- Create: `src/components/layout/ErrorBoundary.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Create ErrorBoundary**

Create `src/components/layout/ErrorBoundary.tsx`:

```typescript
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
    console.error(`[ErrorBoundary:${this.props.name}]`, error, info)
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
              color: 'rgba(255,255,255,0.4)',
              fontSize: 13,
              gap: 8,
            }}
          >
            <span style={{ color: '#ff6d00', fontSize: 24 }}>⚠</span>
            <span>{this.props.name} 加载异常</span>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              style={{
                padding: '4px 16px',
                border: '1px solid rgba(74,158,255,0.3)',
                borderRadius: 4,
                background: 'transparent',
                color: '#4a9eff',
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

- [ ] **Step 2: Wrap layout zones with ErrorBoundary in App.tsx**

Update `src/App.tsx`:

```typescript
import ErrorBoundary from '@/components/layout/ErrorBoundary'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ScreenLayout
        topBar={<ErrorBoundary name="顶部导航"><TopBar /></ErrorBoundary>}
        leftPanel={
          <ErrorBoundary name="左侧面板" fallback={<div className="text-gray-500 text-center p-4">左侧面板异常</div>}>
            <LeftPanel>
              <DashboardPanel title="面板左-1">
                <span className="text-gray-500 text-xs">数据面板内容</span>
              </DashboardPanel>
              <DashboardPanel title="面板左-2">
                <span className="text-gray-500 text-xs">数据面板内容</span>
              </DashboardPanel>
              <DashboardPanel title="面板左-3">
                <span className="text-gray-500 text-xs">数据面板内容</span>
              </DashboardPanel>
            </LeftPanel>
          </ErrorBoundary>
        }
        scene={
          <ErrorBoundary name="3D 场景" fallback={
            <div className="w-full h-full flex items-center justify-center bg-gray-950 text-gray-500 text-sm">
              3D 场景不可用
            </div>
          }>
            <SceneCanvas />
          </ErrorBoundary>
        }
        rightPanel={
          <ErrorBoundary name="右侧面板" fallback={<div className="text-gray-500 text-center p-4">右侧面板异常</div>}>
            <RightPanel>
              <DashboardPanel title="面板右-1">
                <span className="text-gray-500 text-xs">数据面板内容</span>
              </DashboardPanel>
              <DashboardPanel title="面板右-2">
                <span className="text-gray-500 text-xs">数据面板内容</span>
              </DashboardPanel>
              <DashboardPanel title="面板右-3">
                <span className="text-gray-500 text-xs">数据面板内容</span>
              </DashboardPanel>
            </RightPanel>
          </ErrorBoundary>
        }
        bottomBar={<BottomBar />}
      />
    </QueryClientProvider>
  )
}
```

- [ ] **Step 3: Verify**

```bash
pnpm dev
pnpm build
```

Expected: Build succeeds. Layout renders normally.

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/ErrorBoundary.tsx src/App.tsx
git commit -m "feat: add ErrorBoundary with per-zone isolation"
```

---

### Task 14: Theme Pages — Placeholder Scenes and Panels

**Files:**
- Create: All files under `src/themes/` (see file structure map)
- Modify: `src/App.tsx` (connect theme switching to scene/pane rendering)

- [ ] **Step 1: Create hook for scene click events**

Create `src/hooks/useSceneClick.ts`:

```typescript
import { useThree } from '@react-three/fiber'
import { useSceneStore } from '@/stores/useSceneStore'

export function useSceneClick() {
  const { camera } = useThree()
  const selectObject = useSceneStore((s) => s.selectObject)
  const setCameraTarget = useSceneStore((s) => s.setCameraTarget)

  return {
    onObjectClick: (objectId: string, position: [number, number, number]) => {
      selectObject(objectId)
      setCameraTarget(position)
    },
  }
}
```

- [ ] **Step 2: Create theme index files and placeholder scenes**

Create `src/themes/overview/OverviewScene.tsx`:

```typescript
import CampusBase from '@/components/scene/CampusBase'

export default function OverviewScene() {
  return <CampusBase />
}
```

Create `src/themes/overview/panels/SchoolInfo.tsx`:

```typescript
import { useSchoolInfo } from '@/api/queries/overview'
import NumberFlip from '@/components/ui/NumberFlip'

export default function SchoolInfo() {
  const { data, isLoading, error } = useSchoolInfo()

  if (isLoading) return <div className="text-gray-500 text-xs">加载中...</div>
  if (error) return <div className="text-red-400 text-xs">数据加载失败</div>
  if (!data) return null

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
      <NumberFlip label="占地面积" value={data.landArea} unit="m²" />
      <NumberFlip label="建筑面积" value={data.buildingArea} unit="m²" />
      <NumberFlip label="班级数量" value={data.classCount} unit="个" />
      <NumberFlip label="建筑数量" value={data.buildingCount} unit="栋" />
    </div>
  )
}
```

Create `src/themes/overview/index.ts`:

```typescript
import type { PanelConfig } from '@/types/panel'
import OverviewScene from './OverviewScene'
import SchoolInfo from './panels/SchoolInfo'

export const overviewScene = () => <OverviewScene />

export const overviewPanels: { left: PanelConfig[]; right: PanelConfig[] } = {
  left: [
    { id: 'overview-school-info', title: '学校概况' },
    { id: 'overview-personnel', title: '人员构成' },
    { id: 'overview-teacher-dist', title: '师资分布' },
    { id: 'overview-student-info', title: '学生基础信息' },
    { id: 'overview-activity', title: '活跃度统计' },
  ],
  right: [
    { id: 'overview-detail-1', title: '详情面板-1' },
    { id: 'overview-detail-2', title: '详情面板-2' },
  ],
}

export function renderOverviewPanel(panelId: string) {
  switch (panelId) {
    case 'overview-school-info':
      return <SchoolInfo />
    default:
      return <span className="text-gray-500 text-xs">待实现</span>
  }
}
```

- [ ] **Step 3: Create placeholder theme stubs for remaining 5 themes**

Create `src/themes/teaching-research/TeachingResearchScene.tsx`:

```typescript
import CampusBase from '@/components/scene/CampusBase'
export default function TeachingResearchScene() {
  return <CampusBase />
}
```

Create `src/themes/teaching-research/index.ts`:

```typescript
import type { PanelConfig } from '@/types/panel'
import TeachingResearchScene from './TeachingResearchScene'

export const teachingResearchScene = () => <TeachingResearchScene />

export const teachingResearchPanels: { left: PanelConfig[]; right: PanelConfig[] } = {
  left: [
    { id: 'tr-resources', title: '教学资源' },
    { id: 'tr-resource-stats', title: '资源统计' },
    { id: 'tr-updates', title: '资源更新动态' },
  ],
  right: [
    { id: 'tr-topics', title: '教师课题' },
    { id: 'tr-projects', title: '课题项目' },
    { id: 'tr-studios', title: '名师工作室' },
  ],
}

export function renderTeachingResearchPanel(_panelId: string) {
  return <span className="text-gray-500 text-xs">待实现</span>
}
```

Create `src/themes/admin/AdminScene.tsx`:

```typescript
import CampusBase from '@/components/scene/CampusBase'
export default function AdminScene() {
  return <CampusBase />
}
```

Create `src/themes/admin/index.ts`:

```typescript
import type { PanelConfig } from '@/types/panel'
import AdminScene from './AdminScene'

export const adminScene = () => <AdminScene />

export const adminPanels: { left: PanelConfig[]; right: PanelConfig[] } = {
  left: [
    { id: 'admin-overview', title: '办公概况' },
    { id: 'admin-notices', title: '通知公告' },
    { id: 'admin-duty', title: '值班安排' },
  ],
  right: [
    { id: 'admin-calendar', title: '校历日程' },
    { id: 'admin-attendance', title: '教职工考勤' },
    { id: 'admin-meetings', title: '会议管理' },
  ],
}

export function renderAdminPanel(_panelId: string) {
  return <span className="text-gray-500 text-xs">待实现</span>
}
```

Create `src/themes/library/LibraryScene.tsx`:

```typescript
import CampusBase from '@/components/scene/CampusBase'
export default function LibraryScene() {
  return <CampusBase />
}
```

Create `src/themes/library/index.ts`:

```typescript
import type { PanelConfig } from '@/types/panel'
import LibraryScene from './LibraryScene'

export const libraryScene = () => <LibraryScene />

export const libraryPanels: { left: PanelConfig[]; right: PanelConfig[] } = {
  left: [
    { id: 'lib-collection', title: '馆藏概况' },
    { id: 'lib-borrow', title: '借阅统计' },
    { id: 'lib-hot', title: '热门图书' },
  ],
  right: [
    { id: 'lib-class-rank', title: '班级借阅排行' },
    { id: 'lib-activities', title: '阅读活动' },
    { id: 'lib-visitors', title: '入馆统计' },
  ],
}

export function renderLibraryPanel(_panelId: string) {
  return <span className="text-gray-500 text-xs">待实现</span>
}
```

Create `src/themes/academics/AcademicsScene.tsx`:

```typescript
import CampusBase from '@/components/scene/CampusBase'
export default function AcademicsScene() {
  return <CampusBase />
}
```

Create `src/themes/academics/index.ts`:

```typescript
import type { PanelConfig } from '@/types/panel'
import AcademicsScene from './AcademicsScene'

export const academicsScene = () => <AcademicsScene />

export const academicsPanels: { left: PanelConfig[]; right: PanelConfig[] } = {
  left: [
    { id: 'acad-overview', title: '教学概况' },
    { id: 'acad-schedule', title: '课程安排' },
    { id: 'acad-classroom', title: '教室使用' },
  ],
  right: [
    { id: 'acad-attendance', title: '学生出勤' },
    { id: 'acad-exams', title: '考试管理' },
    { id: 'acad-classes', title: '班级管理' },
    { id: 'acad-devices', title: '教学设备' },
  ],
}

export function renderAcademicsPanel(_panelId: string) {
  return <span className="text-gray-500 text-xs">待实现</span>
}
```

Create `src/themes/security/SecurityScene.tsx`:

```typescript
import CampusBase from '@/components/scene/CampusBase'
export default function SecurityScene() {
  return <CampusBase />
}
```

Create `src/themes/security/index.ts`:

```typescript
import type { PanelConfig } from '@/types/panel'
import SecurityScene from './SecurityScene'

export const securityScene = () => <SecurityScene />

export const securityPanels: { left: PanelConfig[]; right: PanelConfig[] } = {
  left: [
    { id: 'sec-overview', title: '安防概况' },
    { id: 'sec-monitor', title: '监控状态' },
    { id: 'sec-access', title: '门禁管理' },
  ],
  right: [
    { id: 'sec-leave', title: '学生请假管理' },
    { id: 'sec-visitors', title: '访客管理' },
    { id: 'sec-alerts', title: '告警事件' },
    { id: 'sec-canteen', title: '食堂安全' },
  ],
}

export function renderSecurityPanel(_panelId: string) {
  return <span className="text-gray-500 text-xs">待实现</span>
}
```

- [ ] **Step 4: Create theme registry and update App.tsx**

Create `src/themes/registry.ts`:

```typescript
import { ThemeId } from '@/types/theme'
import type { PanelConfig } from '@/types/panel'
import type { ReactNode } from 'react'
import {
  overviewScene,
  overviewPanels,
  renderOverviewPanel,
} from './overview'
import {
  teachingResearchScene,
  teachingResearchPanels,
  renderTeachingResearchPanel,
} from './teaching-research'
import {
  adminScene,
  adminPanels,
  renderAdminPanel,
} from './admin'
import {
  libraryScene,
  libraryPanels,
  renderLibraryPanel,
} from './library'
import {
  academicsScene,
  academicsPanels,
  renderAcademicsPanel,
} from './academics'
import {
  securityScene,
  securityPanels,
  renderSecurityPanel,
} from './security'

type SceneRenderer = () => ReactNode
type PanelRenderer = (panelId: string) => ReactNode

interface ThemeEntry {
  scene: SceneRenderer
  panels: { left: PanelConfig[]; right: PanelConfig[] }
  renderPanel: PanelRenderer
}

const registry: Record<ThemeId, ThemeEntry> = {
  [ThemeId.OVERVIEW]: {
    scene: overviewScene,
    panels: overviewPanels,
    renderPanel: renderOverviewPanel,
  },
  [ThemeId.TEACHING_RESEARCH]: {
    scene: teachingResearchScene,
    panels: teachingResearchPanels,
    renderPanel: renderTeachingResearchPanel,
  },
  [ThemeId.ADMIN]: {
    scene: adminScene,
    panels: adminPanels,
    renderPanel: renderAdminPanel,
  },
  [ThemeId.LIBRARY]: {
    scene: libraryScene,
    panels: libraryPanels,
    renderPanel: renderLibraryPanel,
  },
  [ThemeId.ACADEMICS]: {
    scene: academicsScene,
    panels: academicsPanels,
    renderPanel: renderAcademicsPanel,
  },
  [ThemeId.SECURITY]: {
    scene: securityScene,
    panels: securityPanels,
    renderPanel: renderSecurityPanel,
  },
}

export function getThemeEntry(theme: ThemeId): ThemeEntry {
  return registry[theme]
}
```

- [ ] **Step 5: Update App.tsx with theme-driven scene and panels**

Replace `src/App.tsx`:

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useThemeStore } from '@/stores/useThemeStore'
import ScreenLayout from '@/components/layout/ScreenLayout'
import TopBar from '@/components/layout/TopBar'
import LeftPanel from '@/components/layout/LeftPanel'
import RightPanel from '@/components/layout/RightPanel'
import BottomBar from '@/components/layout/BottomBar'
import DashboardPanel from '@/components/ui/DashboardPanel'
import ErrorBoundary from '@/components/layout/ErrorBoundary'
import { getThemeEntry } from '@/themes/registry'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

function App() {
  const currentTheme = useThemeStore((s) => s.currentTheme)
  const entry = getThemeEntry(currentTheme)

  return (
    <QueryClientProvider client={queryClient}>
      <ScreenLayout
        topBar={<ErrorBoundary name="顶部导航"><TopBar /></ErrorBoundary>}
        leftPanel={
          <ErrorBoundary name="左侧面板" fallback={<div className="text-gray-500 text-center p-4">左侧面板异常</div>}>
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
        scene={
          <ErrorBoundary name="3D 场景" fallback={
            <div className="w-full h-full flex items-center justify-center bg-gray-950 text-gray-500 text-sm">
              3D 场景不可用
            </div>
          }>
            {entry.scene()}
          </ErrorBoundary>
        }
        rightPanel={
          <ErrorBoundary name="右侧面板" fallback={<div className="text-gray-500 text-center p-4">右侧面板异常</div>}>
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
        bottomBar={<BottomBar />}
      />
    </QueryClientProvider>
  )
}

export default App
```

- [ ] **Step 6: Verify**

```bash
pnpm dev
```

Expected: 
- Default theme shows overview with SchoolInfo panel displaying mock data from MSW
- Clicking different theme tabs switches left/right panel layout (different panel counts per theme)
- All non-overview panels show "待实现" placeholder
- 3D scene stays as campus base for all themes

- [ ] **Step 7: Commit**

```bash
git add src/themes/ src/hooks/ src/App.tsx
git commit -m "feat: add 6 theme pages with registry, overview demo, and placeholder stubs"
```

---

### Task 15: TailwindCSS Setup and Dark Theme Polish

**Files:**
- Create: `tailwind.config.js`, `postcss.config.js`
- Modify: `src/index.css` (already has tailwind directives)

- [ ] **Step 1: Create tailwind.config.js**

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        campus: {
          bg: '#0a1628',
          panel: 'rgba(0, 0, 0, 0.35)',
          accent: '#4a9eff',
          warning: '#ff6d00',
          success: '#00c853',
          danger: '#ff1744',
        },
      },
    },
  },
  plugins: [],
}
```

- [ ] **Step 2: Create postcss.config.js**

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

- [ ] **Step 3: Verify build**

```bash
pnpm build
```

Expected: Build succeeds with Tailwind CSS processing.

- [ ] **Step 4: Commit**

```bash
git add tailwind.config.js postcss.config.js
git commit -m "feat: add TailwindCSS configuration with campus theme colors"
```

---

### Task 16: Final Integration and Verification

**Files:**
- Modify: none (verification only)

- [ ] **Step 1: Run full test suite**

```bash
pnpm test
```

Expected: All tests PASS.

- [ ] **Step 2: Run production build**

```bash
pnpm build
```

Expected: Build succeeds. Output in `dist/`.

- [ ] **Step 3: Run dev server and manually verify**

```bash
pnpm dev
```

Manual checks:
- [ ] 5-zone layout renders correctly (top, left, scene, right, bottom)
- [ ] 6 theme nav tabs switch panels and update highlight
- [ ] Overview theme shows SchoolInfo with mock numbers (4 NumberFlip cards)
- [ ] Other 5 themes show "待实现" placeholder panels
- [ ] Clicking 3D scene — orbit controls work (rotate, zoom, pan)
- [ ] Camera auto-rotates slowly
- [ ] Theme switching does not cause page reload
- [ ] Browser DevTools shows "[MSW] Mocking enabled" in console
- [ ] Console has no errors or warnings (except expected Three.js info)

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "feat: complete platform framework delivery"
```

---

## Self-Review Checklist

### 1. Spec Coverage

| Spec Requirement | Covered By |
|-----------------|------------|
| CSS Grid 5-zone layout | Task 5 (ScreenLayout) |
| TopBar: title, clock, date | Task 6 (TopBar) |
| 6-theme navigation tabs | Task 6 (TopBar) + Task 14 (theme registry) |
| R3F Canvas + base scene | Task 9 (SceneCanvas, CampusBase) |
| Camera auto-rotate + orbit | Task 9 (CameraController) |
| Left/Right panels | Task 7 (LeftPanel, RightPanel) |
| DashboardPanel container | Task 7 (DashboardPanel) |
| NumberFlip component | Task 10 (NumberFlip) |
| ScrollList component | Task 10 (ScrollList) |
| Modal component | Task 10 (Modal) |
| ECharts bar/line/pie/ring/gauge/heatmap | Task 11 |
| Zustand global stores (3) | Task 4 |
| Zustand theme stores (6 stubs) | Task 4 |
| TanStack Query + API client | Task 12 |
| MSW + faker mock layer | Task 12 |
| ErrorBoundary per-zone isolation | Task 13 |
| 6 theme pages with registry | Task 14 |
| Overview: SchoolInfo with mock data demo | Task 14 (overview/panels/SchoolInfo.tsx) |
| TailwindCSS | Task 15 |
| Unit tests (format, stores, components) | Tasks 3, 4, 7, 10 |

### 2. Placeholder Scan

- No "TBD", "TODO", or "implement later" found
- Every step has actual code or exact commands

### 3. Type Consistency

- `ThemeId` enum used consistently across all files
- `PanelConfig` interface used in theme index files and registry
- Store types match their use in components
- API response types match mock handlers

---

### Notes for Implementation

1. Run `pnpm install` once in Task 1 and never again — all deps are in package.json
2. The MSW service worker generation (`npx msw init`) must run after `pnpm install`
3. Three.js types need `skipLibCheck: true` in tsconfig due to type complexities
4. Each task can be implemented independently after its dependencies are met
5. Task 14 is the largest — consider splitting into 6 sub-steps (one per theme) but they're mechanical repetitions
