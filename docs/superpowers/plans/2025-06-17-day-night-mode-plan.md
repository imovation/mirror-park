# Day/Night Mode 统一实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 合并 CampusBaseClassic 和 CampusBaseTron 为统一 CampusBase，通过 `timeMode: 'day' | 'night'` 切换视觉模式。

**Architecture:** 新建 `dayNightTheme.ts` 配置对象集中管理所有视觉参数；`useStyleStore` 改为 `useTimeModeStore`；`CampusBase.tsx` 统一几何结构，各子组件从配置读取颜色/材质/光照。

**Tech Stack:** React 18 + TypeScript, Three.js (R3F + drei), Zustand

---

### Task 1: 创建视觉主题配置文件

**Files:**
- Create: `src/config/dayNightTheme.ts`

- [ ] **Step 1: 创建配置文件**

```typescript
// src/config/dayNightTheme.ts

export type TimeMode = 'day' | 'night'

export interface DayNightTheme {
  building: {
    baseColor: string
    windowColor: string
    litChance: number
  }
  road: {
    staticColor: string
    flowEnabled: boolean
    flowPrimaryColor: string
    flowSecondaryColor: string
  }
  ground: { color: string }
  ambientLight: { intensity: number }
  directionalLight: { intensity: number }
  fog: { color: string }
  canvas: { background: string }
  archway: {
    bodyColor: string
    topColor: string
    showEdges: boolean
    edgeColor: string
  }
  courtyard: {
    color: string
    emissive: string
    emissiveIntensity: number
  }
  reservoir: {
    useMirror: boolean
    standardColor: string
    mirrorColor: string
  }
  cityContext: { color: string }
  landscape: {
    hedgeColor: string
    treeTrunkColor: string
    treeLeafColor: string
    treeLeafEmissive: string
    treeLeafEmissiveIntensity: number
  }
  flowerBeds: {
    colors: string[]
    emissiveIntensity: number
  }
  poi: {
    ringColor: string
    dotColor: string
    pillarColor: string
    lineColor: string
  }
  bloom: { intensity: number }
  particle: { color: string; opacity: number }
  track: {
    baseColor: string
    laneColor: string
  }
  environment: { preset: string | null }
}

export const DAY_NIGHT: Record<TimeMode, DayNightTheme> = {
  day: {
    building: {
      baseColor: '#a0522d',
      windowColor: '#f5f0e8',
      litChance: 0.6,
    },
    road: {
      staticColor: '#3a3a3a',
      flowEnabled: false,
      flowPrimaryColor: '#ff6b35',
      flowSecondaryColor: '#00e5ff',
    },
    ground: { color: '#1a5c2a' },
    ambientLight: { intensity: 0.8 },
    directionalLight: { intensity: 1.2 },
    fog: { color: '#dce8f5' },
    canvas: { background: 'linear-gradient(180deg, #e8f0fe 0%, #f0f4f8 100%)' },
    archway: {
      bodyColor: '#f0f4f8',
      topColor: '#a0522d',
      showEdges: false,
      edgeColor: '#a0522d',
    },
    courtyard: {
      color: '#2a4a2a',
      emissive: '#000000',
      emissiveIntensity: 0,
    },
    reservoir: {
      useMirror: false,
      standardColor: '#4a8ac4',
      mirrorColor: '#0d1a2d',
    },
    cityContext: { color: '#3a404a' },
    landscape: {
      hedgeColor: '#3a6b3a',
      treeTrunkColor: '#5c3a1e',
      treeLeafColor: '#2d5a1e',
      treeLeafEmissive: '#000000',
      treeLeafEmissiveIntensity: 0,
    },
    flowerBeds: {
      colors: ['#ff6b9d', '#ffd93d', '#6bcf7f', '#4d96ff'],
      emissiveIntensity: 0,
    },
    poi: {
      ringColor: '#a0522d',
      dotColor: '#ffffff',
      pillarColor: '#a0522d',
      lineColor: '#888888',
    },
    bloom: { intensity: 0.3 },
    particle: { color: '#888888', opacity: 0.2 },
    track: { baseColor: '#c44', laneColor: '#c44' },
    environment: { preset: 'sunset' },
  },
  night: {
    building: {
      baseColor: '#06101e',
      windowColor: '#00e5ff',
      litChance: 0.6,
    },
    road: {
      staticColor: '#3a3a3a',
      flowEnabled: true,
      flowPrimaryColor: '#ff6b35',
      flowSecondaryColor: '#00e5ff',
    },
    ground: { color: '#050a14' },
    ambientLight: { intensity: 0.4 },
    directionalLight: { intensity: 0.8 },
    fog: { color: '#0a1628' },
    canvas: { background: 'linear-gradient(180deg, #0a1628 0%, #16213e 100%)' },
    archway: {
      bodyColor: '#06101e',
      topColor: '#06101e',
      showEdges: true,
      edgeColor: '#00e5ff',
    },
    courtyard: {
      color: '#0e2a1a',
      emissive: '#00ff88',
      emissiveIntensity: 0.35,
    },
    reservoir: {
      useMirror: true,
      standardColor: '#4a8ac4',
      mirrorColor: '#0d1a2d',
    },
    cityContext: { color: '#080c14' },
    landscape: {
      hedgeColor: '#2d5a3d',
      treeTrunkColor: '#3a2518',
      treeLeafColor: '#1a5a30',
      treeLeafEmissive: '#0a3a1a',
      treeLeafEmissiveIntensity: 0.3,
    },
    flowerBeds: {
      colors: ['#ff6b9d', '#ffd93d', '#6bcf7f', '#4d96ff'],
      emissiveIntensity: 0.2,
    },
    poi: {
      ringColor: '#00e5ff',
      dotColor: '#ffffff',
      pillarColor: '#00e5ff',
      lineColor: '#00e5ff',
    },
    bloom: { intensity: 0.6 },
    particle: { color: '#4a9eff', opacity: 0.4 },
    track: { baseColor: '#1a2535', laneColor: '#00e5ff' },
    environment: { preset: 'city' },
  },
}
```

- [ ] **Step 2: 验证 TypeScript 类型无错误**

```bash
pnpm exec tsc --noEmit src/config/dayNightTheme.ts
```

- [ ] **Step 3: 提交**

```bash
git add src/config/dayNightTheme.ts
git commit -m "feat: add dayNightTheme config for visual mode parameters"
```

---

### Task 2: 修改 useStyleStore → useTimeModeStore

**Files:**
- Modify: `src/stores/useStyleStore.ts`

- [ ] **Step 1: 重写 store 文件**

```typescript
// src/stores/useStyleStore.ts

import { create } from 'zustand'
import type { TimeMode } from '@/config/dayNightTheme'

interface TimeModeState {
  timeMode: TimeMode
  toggleMode: () => void
  setMode: (mode: TimeMode) => void
}

export const useTimeModeStore = create<TimeModeState>((set) => ({
  timeMode: 'day',
  toggleMode: () =>
    set((s) => ({ timeMode: s.timeMode === 'day' ? 'night' : 'day' })),
  setMode: (mode) => set({ timeMode: mode }),
}))
```

- [ ] **Step 2: 验证编译**

```bash
pnpm exec tsc --noEmit --pretty src/stores/useStyleStore.ts 2>&1 | head -20
```

- [ ] **Step 3: 提交**

```bash
git add src/stores/useStyleStore.ts
git commit -m "refactor: change useStyleStore to useTimeModeStore with day/night modes"
```

---

### Task 3: 更新 constants.ts 添加白天雾色

**Files:**
- Modify: `src/utils/constants.ts`

- [ ] **Step 1: 添加 SCENE.FOG_NIGHT 常量**

```typescript
// src/utils/constants.ts — 末尾 SCENE 对象中添加

export const SCENE = {
  FOG_NIGHT: '#0a1628',
  // ... 其余不变
} as const
```

略过，实际上 `SCENE.FOG_COLOR` 当前存在且值为 `'#0a1628'`。由于 SceneCanvas 不再需要硬编码雾色（改为动态读取 store），这一步取消——constants.ts 无需修改。

---

### Task 3: 更新 TopBar 切换按钮

**Files:**
- Modify: `src/components/layout/TopBar.tsx`

- [ ] **Step 1: 修改 import 和按钮逻辑**

将 `TopBar.tsx` 中的：
```typescript
import { useStyleStore } from '@/stores/useStyleStore'
// ...
const visualStyle = useStyleStore((s) => s.visualStyle)
const toggleStyle = useStyleStore((s) => s.toggleStyle)
```
替换为：
```typescript
import { useTimeModeStore } from '@/stores/useStyleStore'
// ...
const timeMode = useTimeModeStore((s) => s.timeMode)
const toggleMode = useTimeModeStore((s) => s.toggleMode)
```

将按钮部分：
```tsx
<button
  onClick={toggleStyle}
  style={{
    background: visualStyle === 'tron' ? 'rgba(0,229,255,0.15)' : 'rgba(160,82,45,0.15)',
    border: visualStyle === 'tron' ? '1px solid rgba(0,229,255,0.4)' : '1px solid rgba(160,82,45,0.4)',
    borderRadius: 4,
    color: visualStyle === 'tron' ? '#00e5ff' : '#a0522d',
    cursor: 'pointer',
    fontSize: 12,
    padding: '4px 12px',
    fontWeight: 600,
  }}
>
  {visualStyle === 'classic' ? '🧱 经典' : '💠 Tron'}
</button>
```
替换为：
```tsx
<button
  onClick={toggleMode}
  style={{
    background: timeMode === 'night' ? 'rgba(0,229,255,0.15)' : 'rgba(255,180,60,0.15)',
    border: timeMode === 'night' ? '1px solid rgba(0,229,255,0.4)' : '1px solid rgba(255,180,60,0.4)',
    borderRadius: 4,
    color: timeMode === 'night' ? '#00e5ff' : '#ffb83c',
    cursor: 'pointer',
    fontSize: 12,
    padding: '4px 12px',
    fontWeight: 600,
  }}
>
  {timeMode === 'day' ? '☀️ 白天' : '🌙 夜间'}
</button>
```

- [ ] **Step 2: 验证编译**

```bash
pnpm exec tsc --noEmit --pretty src/components/layout/TopBar.tsx 2>&1 | head -20
```

- [ ] **Step 3: 提交**

```bash
git add src/components/layout/TopBar.tsx
git commit -m "feat: update TopBar to use day/night time mode toggle"
```

---

### Task 4: 更新 SceneCanvas fog 和背景联动

**Files:**
- Modify: `src/components/scene/SceneCanvas.tsx`

- [ ] **Step 1: 让 fog 颜色和 Canvas 背景动态跟随 timeMode**

```tsx
// src/components/scene/SceneCanvas.tsx

import type { ReactNode } from 'react'
import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import ParticleBg from './ParticleBg'
import CameraController from './CameraController'
import SceneInfo from './SceneInfo'
import { useTimeModeStore } from '@/stores/useStyleStore'
import { DAY_NIGHT } from '@/config/dayNightTheme'
import { SCENE } from '@/utils/constants'

interface SceneCanvasProps {
  children: ReactNode
}

function SceneContent() {
  const timeMode = useTimeModeStore((s) => s.timeMode)
  const cfg = DAY_NIGHT[timeMode]
  return (
    <>
      <fog attach="fog" args={[cfg.fog.color, SCENE.FOG_NEAR, SCENE.FOG_FAR]} />
      <Suspense fallback={null}>
        <ParticleBg />
        <CameraController />
      </Suspense>
      <EffectComposer>
        <Bloom luminanceThreshold={0.5} luminanceSmoothing={0.9} mipmapBlur intensity={cfg.bloom.intensity} />
      </EffectComposer>
    </>
  )
}

export default function SceneCanvas({ children }: SceneCanvasProps) {
  const timeMode = useTimeModeStore((s) => s.timeMode)
  const cfg = DAY_NIGHT[timeMode]
  return (
    <div className="scene-loading" style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas
        camera={{ fov: 50, near: 0.1, far: 1000 }}
        style={{ background: cfg.canvas.background }}
      >
        {children}
        <Suspense fallback={null}>
          <SceneContent />
        </Suspense>
      </Canvas>
      <SceneInfo />
    </div>
  )
}
```

注意：移除了旧的 `<fog>` 和固定的 `<ParticleBg>`/`<CameraController>`（它们移入 `SceneContent` 内），因为 `useTimeModeStore` hooks 调用需要在子组件内（不能和 `<Canvas>` 同级直接调用 R3F 无关的 store hook 在顶层是可以的，但 `<fog>` 等 R3F 元素需要放在 Canvas 内部）。

**[更正]**：`useTimeModeStore` 是纯 Zustand store，可以在任何地方调用，不限于 Canvas 内部。但 `<fog>` 必须放在 Canvas 内部。上面的 `SceneContent` 分离是正确的做法——因为 `useTimeModeStore` 调用在 `<Canvas>` 外部没问题，但 `<fog>` 在 Canvas 内部才有效。

- [ ] **Step 2: 验证编译**

```bash
pnpm exec tsc --noEmit --pretty src/components/scene/SceneCanvas.tsx 2>&1 | head -20
```

- [ ] **Step 3: 提交**

```bash
git add src/components/scene/SceneCanvas.tsx
git commit -m "feat: make SceneCanvas fog/background/bloom follow timeMode"
```

---

### Task 5: 更新 ParticleBg 跟随 timeMode

**Files:**
- Modify: `src/components/scene/ParticleBg.tsx`

- [ ] **Step 1: 接收 timeMode 参数（从父组件传入）**

由于 ParticleBg 在 SceneCanvas 内部渲染，可以从 context 获取 store。但更简洁的方式是 ParticleBg 自己读取 store。

但因为 ParticleBg 在 R3F Canvas 内部，直接调用 Zustand store 是允许的。

```tsx
// src/components/scene/ParticleBg.tsx

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useTimeModeStore } from '@/stores/useStyleStore'
import { DAY_NIGHT } from '@/config/dayNightTheme'

export default function ParticleBg({ count = 200 }: { count?: number }) {
  const mesh = useRef<THREE.Points>(null)
  const timeMode = useTimeModeStore((s) => s.timeMode)
  const particleCfg = DAY_NIGHT[timeMode].particle

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 80
      pos[i * 3 + 1] = Math.random() * 40 + 2
      pos[i * 3 + 2] = (Math.random() - 0.5) * 80
    }
    return pos
  }, [count])

  useFrame((_, delta) => {
    if (!mesh.current) return
    mesh.current.rotation.y += delta * 0.02
  })

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        color={particleCfg.color}
        transparent
        opacity={particleCfg.opacity}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}
```

- [ ] **Step 2: 验证编译**

```bash
pnpm exec tsc --noEmit --pretty src/components/scene/ParticleBg.tsx 2>&1 | head -20
```

- [ ] **Step 3: 提交**

```bash
git add src/components/scene/ParticleBg.tsx
git commit -m "feat: make ParticleBg color/opacity follow timeMode"
```

---

### Task 6: 重写 CampusBase.tsx（合并版）

**Files:**
- Modify: `src/components/scene/CampusBase.tsx`
- Will later delete: `src/components/scene/CampusBaseTron.tsx`, `src/components/scene/CampusBaseClassic.tsx`

这是最大的任务。下面是完整的合并后 CampusBase 代码：

- [ ] **Step 1: 写入合并版 CampusBase.tsx**

```typescript
// src/components/scene/CampusBase.tsx

import { useState, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Box, Plane, Html, Cylinder, Sphere, MeshReflectorMaterial, Edges, Environment, ContactShadows } from '@react-three/drei'
import roadFlowVert from '@/shaders/roadFlow.vert?raw'
import roadFlowFrag from '@/shaders/roadFlow.frag?raw'
import buildingWindowVert from '@/shaders/buildingWindow.vert?raw'
import buildingWindowFrag from '@/shaders/buildingWindow.frag?raw'
import { useSceneStore } from '@/stores/useSceneStore'
import { useThemeStore } from '@/stores/useThemeStore'
import { useTimeModeStore } from '@/stores/useStyleStore'
import { DAY_NIGHT, type DayNightTheme } from '@/config/dayNightTheme'
import { ThemeId } from '@/types/theme'

interface BuildingData {
  id: string
  label: string
  position: [number, number, number]
  size: [number, number, number]
  info: string
}

export const BUILDINGS: BuildingData[] = [
  { id: 'chongde', label: '崇德楼', position: [-12, 5.6, 6], size: [10, 11, 7], info: '初一年级教学楼' },
  { id: 'chongzhi', label: '崇智楼', position: [0, 5.6, 10], size: [14, 11, 7], info: '初二年级教学楼 · 正对校门' },
  { id: 'chongxin', label: '崇信楼', position: [12, 5.6, 6], size: [10, 11, 7], info: '初三年级教学楼' },
  { id: 'bell-tower', label: '钟楼', position: [0, 14.1, 8], size: [3, 8, 3], info: '镇远中学标志性钟楼 · 雅典学派风格' },
  { id: 'gymnasium', label: '体育馆', position: [-24, 5.1, 0], size: [14, 10, 18], info: '多功能体育馆 · 楼顶400m跑道+真草球场' },
  { id: 'chongwen', label: '崇文楼', position: [-10, 4.6, -7], size: [12, 9, 7], info: '开放式图书馆 · 2层 · 藏书10万余册' },
  { id: 'canteen', label: '食堂', position: [-10, 3.6, -13], size: [10, 7, 8], info: '16个窗口 · 370+张餐桌 · 1500人同时就餐' },
  { id: 'chongya', label: '崇雅楼', position: [-22, 11.1, -14], size: [7, 22, 7], info: '师生宿舍 · 22层 · 校园最高建筑' },
  { id: 'chongsi', label: '崇思楼', position: [2, 7.6, -14], size: [7, 15, 7], info: '师生宿舍 · 15层' },
]

function createWindowMaterial(
  cfg: DayNightTheme['building'],
  windowDensity: number,
) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uWindowDensity: { value: windowDensity },
      uLitChance: { value: cfg.litChance },
      uBaseColor: { value: new THREE.Color(cfg.baseColor) },
      uWindowColor: { value: new THREE.Color(cfg.windowColor) },
    },
    vertexShader: buildingWindowVert,
    fragmentShader: buildingWindowFrag,
    transparent: false,
  })
}

const WINDOW_DENSITY: Record<string, number> = {
  teaching: 8,
  dorm: 10,
  gym: 4,
  tower: 6,
}

function getWindowDensity(buildingId: string): number {
  if (buildingId === 'chongde' || buildingId === 'chongzhi' || buildingId === 'chongxin') return WINDOW_DENSITY.teaching
  if (buildingId === 'chongya' || buildingId === 'chongsi') return WINDOW_DENSITY.dorm
  if (buildingId === 'gymnasium' || buildingId === 'canteen') return WINDOW_DENSITY.gym
  return WINDOW_DENSITY.tower
}

function BuildingMesh({ building }: { building: BuildingData }) {
  const [hovered, setHovered] = useState(false)
  const selectedId = useSceneStore((s) => s.selectedObjectId)
  const selectObject = useSceneStore((s) => s.selectObject)
  const requestFlyTo = useSceneStore((s) => s.requestFlyTo)
  const currentTheme = useThemeStore((s) => s.currentTheme)
  const timeMode = useTimeModeStore((s) => s.timeMode)
  const cfg = DAY_NIGHT[timeMode]
  const isSelected = selectedId === building.id
  const isOverview = currentTheme === ThemeId.OVERVIEW

  const mat = useMemo(() => {
    return createWindowMaterial(cfg.building, getWindowDensity(building.id))
  }, [cfg.building, building.id])

  const handleClick = () => {
    const id = building.id
    const centerY = building.size[1] / 2
    const lookAt: [number, number, number] = [building.position[0], centerY, building.position[2]]
    const dist = 25 + Math.max(building.size[0], building.size[2]) * 0.5
    if (isOverview) {
      if (isSelected) {
        selectObject(null)
      } else {
        selectObject(id)
        requestFlyTo([lookAt[0] + dist * 0.5, centerY + dist * 0.4, lookAt[2] + dist * 0.6], lookAt)
      }
    }
  }

  const edgeColor = timeMode === 'night' ? '#00e5ff' : '#8B7355'
  return (
    <group
      position={building.position}
      onClick={(e) => {
        e.stopPropagation()
        handleClick()
      }}
      onPointerOver={(e) => {
        e.stopPropagation()
        if (isOverview) { setHovered(true); document.body.style.cursor = 'pointer' }
      }}
      onPointerOut={(e) => {
        e.stopPropagation()
        if (isOverview) { setHovered(false); document.body.style.cursor = 'default' }
      }}
    >
      <Box args={building.size} castShadow receiveShadow>
        <primitive object={mat} attach="material" />
        <Edges
          linewidth={isSelected ? 3 : 2}
          threshold={15}
          color={isSelected ? '#ffffff' : edgeColor}
        />
      </Box>

      <Html
        position={[0, building.size[1] / 2 + (isSelected ? 2.5 : 1.5), 0]}
        center distanceFactor={40} style={{ pointerEvents: 'none', zIndex: isSelected ? 10 : 1 }}
      >
        <div style={{
          position: 'relative',
          background: isSelected
            ? (timeMode === 'night' ? 'rgba(6, 16, 30, 0.95)' : 'rgba(160, 82, 45, 0.95)')
            : 'rgba(0,0,0,0.7)',
          color: '#fff',
          padding: isSelected ? '8px 12px' : '3px 10px',
          borderRadius: 6,
          fontSize: 12,
          fontWeight: 'bold',
          whiteSpace: isSelected ? 'normal' : 'nowrap',
          width: isSelected ? '170px' : 'auto',
          border: isSelected
            ? (timeMode === 'night' ? '2px solid #00e5ff' : '2px solid #ffb83c')
            : (timeMode === 'night' ? '1px solid rgba(0, 229, 255, 0.3)' : '1px solid rgba(255, 184, 60, 0.3)'),
          transition: 'all 0.3s',
          boxShadow: isSelected
            ? (timeMode === 'night' ? '0 0 20px rgba(0, 229, 255, 0.4)' : '0 0 20px rgba(255, 184, 60, 0.4)')
            : 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: isSelected ? '4px' : '0',
          backdropFilter: isSelected ? 'blur(8px)' : 'none'
        }}>
          {isSelected && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                selectObject(null)
              }}
              style={{
                position: 'absolute', top: 4, right: 6, background: 'none', border: 'none',
                color: timeMode === 'night' ? 'rgba(0,229,255,0.6)' : 'rgba(255,184,60,0.6)',
                fontSize: 14, cursor: 'pointer', padding: 0,
                lineHeight: 1, pointerEvents: 'auto',
              }}
              onPointerOver={(e) => e.stopPropagation()}
              onPointerOut={(e) => e.stopPropagation()}
            >
              ✕
            </button>
          )}
          <div style={{ fontSize: isSelected ? 14 : 12, color: isSelected ? (timeMode === 'night' ? '#00e5ff' : '#ffb83c') : '#fff', paddingRight: isSelected ? 16 : 0 }}>
            {building.label}
          </div>
          {isSelected && (
            <div style={{ fontSize: 11, fontWeight: 'normal', textAlign: 'center', opacity: 0.85, lineHeight: 1.4 }}>
              {building.info}
            </div>
          )}
        </div>
      </Html>
    </group>
  )
}

function Archways() {
  const timeMode = useTimeModeStore((s) => s.timeMode)
  const cfg = DAY_NIGHT[timeMode]
  const archMat = <meshStandardMaterial color={cfg.archway.bodyColor} transparent={false} />
  const edgeComp = cfg.archway.showEdges
    ? <Edges linewidth={2} threshold={15} color={cfg.archway.edgeColor} />
    : null
  const topMat = <meshStandardMaterial color={cfg.archway.topColor} transparent={false} />

  return (
    <group>
      <Box args={[6, 6, 2]} position={[0, 3, 16]}>{archMat}{edgeComp}</Box>
      <Box args={[7, 0.6, 3]} position={[0, 6.3, 16]}>{topMat}{edgeComp}</Box>
      <Box args={[2, 5, 2]} position={[-7, 2.5, 8]}>{archMat}{edgeComp}</Box>
      <Box args={[2.5, 0.5, 3]} position={[-7, 5.2, 8]}>{topMat}{edgeComp}</Box>
      <Box args={[2, 5, 2]} position={[7, 2.5, 8]}>{archMat}{edgeComp}</Box>
      <Box args={[2.5, 0.5, 3]} position={[7, 5.2, 8]}>{topMat}{edgeComp}</Box>
    </group>
  )
}

function Roads() {
  const timeMode = useTimeModeStore((s) => s.timeMode)
  const cfg = DAY_NIGHT[timeMode]
  const matRefs = useRef<THREE.ShaderMaterial[]>([])

  const X_FLOW = 0
  const Z_FLOW = 1

  const flowMaterials = useMemo(() => {
    if (!cfg.road.flowEnabled) return null
    const mk = (color: string, speed: number, stripes: number, axis: number) =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uColor: { value: new THREE.Color(color) },
          uSpeed: { value: speed },
          uStripeCount: { value: stripes },
          uFlowAxis: { value: axis },
        },
        vertexShader: roadFlowVert,
        fragmentShader: roadFlowFrag,
        transparent: true,
        depthWrite: false,
      })

    const result = {
      orangeX: mk('#ff6b35', 0.3, 3.5, X_FLOW),
      orangeZ: mk('#ff6b35', 0.3, 3.5, Z_FLOW),
      cyanX: mk('#00e5ff', 0.15, 2.0, X_FLOW),
      cyanZ: mk('#00e5ff', 0.15, 2.0, Z_FLOW),
    }
    matRefs.current = Object.values(result)
    return result
  }, [cfg.road.flowEnabled])

  useFrame((_, delta) => {
    if (!cfg.road.flowEnabled) return
    for (const m of matRefs.current) m.uniforms.uTime.value += delta
  })

  const staticMat = useMemo(
    () => <meshStandardMaterial color={cfg.road.staticColor} />,
    [cfg.road.staticColor]
  )

  const roadSegments: { pos: [number, number, number]; size: [number, number, number]; flowIndex: 'orangeZ' | 'cyanX' | 'cyanZ' | 'orangeX' }[] = [
    { pos: [0, 0.06, 19], size: [6, 0.04, 6], flowIndex: 'orangeZ' },
    { pos: [0, 0.06, 14], size: [6, 0.04, 4], flowIndex: 'orangeZ' },
    { pos: [0, 0.06, 6], size: [14, 0.04, 6], flowIndex: 'cyanX' },
    { pos: [0, 0.06, -1], size: [5, 0.04, 8], flowIndex: 'orangeZ' },
    { pos: [-10, 0.06, -3], size: [5, 0.04, 10], flowIndex: 'cyanZ' },
    { pos: [-10, 0.06, -11], size: [5, 0.04, 8], flowIndex: 'cyanZ' },
    { pos: [-20, 0.06, 4], size: [8, 0.04, 4], flowIndex: 'orangeX' },
    { pos: [-6, 0.06, -10], size: [2, 0.04, 10], flowIndex: 'cyanZ' },
    { pos: [4, 0.06, -10], size: [2, 0.04, 10], flowIndex: 'cyanZ' },
    { pos: [0, 0.06, 29], size: [6, 0.04, 25], flowIndex: 'orangeZ' },
    { pos: [0, 0.06, 18], size: [10, 0.04, 4], flowIndex: 'orangeX' },
  ]

  if (cfg.road.flowEnabled && flowMaterials) {
    return (
      <group position={[0, 0, 0]}>
        {roadSegments.map((seg, i) => (
          <mesh key={`road-${i}`} position={seg.pos}>
            <boxGeometry args={seg.size} />
            <primitive object={flowMaterials[seg.flowIndex]} attach="material" />
          </mesh>
        ))}
      </group>
    )
  }

  return (
    <group position={[0, 0, 0]}>
      {roadSegments.map((seg, i) => (
        <mesh key={`road-${i}`} position={seg.pos}>
          <boxGeometry args={seg.size} />
          {staticMat}
        </mesh>
      ))}
    </group>
  )
}

function Courtyards() {
  const timeMode = useTimeModeStore((s) => s.timeMode)
  const cfg = DAY_NIGHT[timeMode]
  const yardMat = <meshStandardMaterial color={cfg.courtyard.color} emissive={cfg.courtyard.emissive} emissiveIntensity={cfg.courtyard.emissiveIntensity} roughness={0.85} />
  const edgeComp = timeMode === 'night'
    ? <Edges linewidth={1.5} threshold={15} color="#00ffaa" />
    : null

  return (
    <group position={[0, 0.15, 0]}>
      <Box args={[20, 0.05, 15]} position={[0, 0, 10]}>{yardMat}{edgeComp}</Box>
      <Box args={[15, 0.05, 12]} position={[-12, 0, 0]}>{yardMat}{edgeComp}</Box>
      <Box args={[15, 0.05, 12]} position={[12, 0, 0]}>{yardMat}{edgeComp}</Box>
      <Box args={[18, 0.05, 10]} position={[0, 0, -15]}>{yardMat}{edgeComp}</Box>
      <Box args={[12, 0.05, 15]} position={[-20, 0, -20]}>{yardMat}{edgeComp}</Box>
      <Box args={[12, 0.05, 15]} position={[20, 0, -20]}>{yardMat}{edgeComp}</Box>
      <Box args={[25, 0.05, 8]} position={[0, 0, -28]}>{yardMat}{edgeComp}</Box>
    </group>
  )
}

function RunningTrack() {
  const timeMode = useTimeModeStore((s) => s.timeMode)
  const cfg = DAY_NIGHT[timeMode]
  const laneCount = 6
  return (
    <group position={[-24, 12.1, 0]}>
      <Box args={[13, 0.1, 17]}>
        <meshStandardMaterial color={cfg.track.baseColor} depthWrite />
      </Box>
      {Array.from({ length: laneCount }, (_, i) => {
        const w = 12.2 - i * 0.8
        const d = 16.2 - i * 0.8
        const halfW = w / 2
        const halfD = d / 2
        const thickness = 0.06
        const stripH = 0.015
        const y = 0.06 + i * 0.001
        const opacity = 0.5 + i * 0.08
        const mat = timeMode === 'night'
          ? <meshBasicMaterial color={cfg.track.laneColor} transparent opacity={opacity} depthWrite={false} />
          : <meshStandardMaterial color={cfg.track.laneColor} transparent opacity={opacity} depthWrite={false} />
        return (
          <group key={`lane-${i}`}>
            <Box args={[w, stripH, thickness]} position={[-0, y, -halfD]}>{mat}</Box>
            <Box args={[w, stripH, thickness]} position={[-0, y, halfD]}>{mat}</Box>
            <Box args={[thickness, stripH, d]} position={[-halfW, y, 0]}>{mat}</Box>
            <Box args={[thickness, stripH, d]} position={[halfW, y, 0]}>{mat}</Box>
          </group>
        )
      })}
      <Box args={[6, 0.15, 10]} position={[0, 0.1, 0]}>
        <meshBasicMaterial color={timeMode === 'night' ? '#0e4a35' : '#2d5a1e'} depthWrite />
      </Box>
    </group>
  )
}

function Landscape() {
  const timeMode = useTimeModeStore((s) => s.timeMode)
  const cfg = DAY_NIGHT[timeMode]

  const hedges: { pos: [number, number, number]; size: [number, number, number] }[] = [
    { pos: [-3, 0.4, 18], size: [0.8, 0.8, 8] },
    { pos: [3, 0.4, 18], size: [0.8, 0.8, 8] },
    { pos: [-8, 0.4, 6], size: [0.8, 0.8, 12] },
    { pos: [8, 0.4, 6], size: [0.8, 0.8, 12] },
    { pos: [-15, 0.4, -15], size: [0.8, 0.8, 10] },
    { pos: [15, 0.4, -15], size: [0.8, 0.8, 10] },
    { pos: [-25, 0.4, -20], size: [0.8, 0.8, 15] },
    { pos: [25, 0.4, -20], size: [0.8, 0.8, 15] },
  ]

  const flowerBeds: { pos: [number, number, number]; size: [number, number, number]; color: string }[] = [
    { pos: [0, 0.15, 20], size: [6, 0.3, 4], color: cfg.flowerBeds.colors[0] },
    { pos: [-12, 0.15, 10], size: [4, 0.3, 3], color: cfg.flowerBeds.colors[1] },
    { pos: [12, 0.15, 10], size: [4, 0.3, 3], color: cfg.flowerBeds.colors[2] },
    { pos: [0, 0.15, -10], size: [5, 0.3, 3], color: cfg.flowerBeds.colors[3] },
    { pos: [-20, 0.15, -10], size: [3, 0.3, 4], color: cfg.flowerBeds.colors[0] },
    { pos: [20, 0.15, -10], size: [3, 0.3, 4], color: cfg.flowerBeds.colors[1] },
  ]

  const largeTrees: { pos: [number, number, number]; scale: number }[] = [
    { pos: [-10, 0, 22], scale: 1.2 },
    { pos: [10, 0, 22], scale: 1.2 },
    { pos: [-18, 0, 15], scale: 1.0 },
    { pos: [18, 0, 15], scale: 1.0 },
    { pos: [-25, 0, 5], scale: 1.3 },
    { pos: [25, 0, 5], scale: 1.3 },
    { pos: [-30, 0, -15], scale: 1.1 },
    { pos: [30, 0, -15], scale: 1.1 },
    { pos: [0, 0, -25], scale: 1.4 },
    { pos: [-15, 0, -28], scale: 1.0 },
    { pos: [15, 0, -28], scale: 1.0 },
  ]

  const smallTrees: { pos: [number, number, number]; scale: number }[] = [
    { pos: [-6, 0, 14], scale: 0.6 },
    { pos: [6, 0, 14], scale: 0.6 },
    { pos: [-14, 0, 8], scale: 0.7 },
    { pos: [14, 0, 8], scale: 0.7 },
    { pos: [-22, 0, -5], scale: 0.65 },
    { pos: [22, 0, -5], scale: 0.65 },
    { pos: [-8, 0, -18], scale: 0.7 },
    { pos: [8, 0, -18], scale: 0.7 },
    { pos: [-18, 0, -25], scale: 0.6 },
    { pos: [18, 0, -25], scale: 0.6 },
  ]

  return (
    <group>
      {hedges.map((h, i) => (
        <mesh key={`hedge-${i}`} position={h.pos}>
          <boxGeometry args={h.size} />
          <meshStandardMaterial color={cfg.landscape.hedgeColor} roughness={0.8} />
        </mesh>
      ))}

      {flowerBeds.map((f, i) => (
        <mesh key={`flower-${i}`} position={f.pos}>
          <boxGeometry args={f.size} />
          <meshStandardMaterial color={f.color} emissive={f.color} emissiveIntensity={cfg.flowerBeds.emissiveIntensity} />
        </mesh>
      ))}

      {largeTrees.map((t, i) => (
        <group key={`large-tree-${i}`} position={t.pos} scale={t.scale}>
          <Cylinder args={[0.15, 0.2, 3, 8]} position={[0, 1.5, 0]}>
            <meshStandardMaterial color={cfg.landscape.treeTrunkColor} />
          </Cylinder>
          <Sphere args={[1.2, 8, 6]} position={[0, 3.5, 0]}>
            <meshStandardMaterial color={cfg.landscape.treeLeafColor} emissive={cfg.landscape.treeLeafEmissive} emissiveIntensity={cfg.landscape.treeLeafEmissiveIntensity} />
          </Sphere>
          <Sphere args={[0.9, 8, 6]} position={[0.6, 3.2, 0.4]}>
            <meshStandardMaterial color={cfg.landscape.treeLeafColor} emissive={cfg.landscape.treeLeafEmissive} emissiveIntensity={cfg.landscape.treeLeafEmissiveIntensity} />
          </Sphere>
          <Sphere args={[0.9, 8, 6]} position={[-0.5, 3.3, -0.3]}>
            <meshStandardMaterial color={cfg.landscape.treeLeafColor} emissive={cfg.landscape.treeLeafEmissive} emissiveIntensity={cfg.landscape.treeLeafEmissiveIntensity} />
          </Sphere>
        </group>
      ))}

      {smallTrees.map((t, i) => (
        <group key={`small-tree-${i}`} position={t.pos} scale={t.scale}>
          <Cylinder args={[0.1, 0.15, 2, 6]} position={[0, 1, 0]}>
            <meshStandardMaterial color={cfg.landscape.treeTrunkColor} />
          </Cylinder>
          <Sphere args={[0.8, 8, 6]} position={[0, 2.3, 0]}>
            <meshStandardMaterial color={cfg.landscape.treeLeafColor} emissive={cfg.landscape.treeLeafEmissive} emissiveIntensity={cfg.landscape.treeLeafEmissiveIntensity} />
          </Sphere>
          <Sphere args={[0.6, 8, 6]} position={[0.4, 2.1, 0.3]}>
            <meshStandardMaterial color={cfg.landscape.treeLeafColor} emissive={cfg.landscape.treeLeafEmissive} emissiveIntensity={cfg.landscape.treeLeafEmissiveIntensity} />
          </Sphere>
        </group>
      ))}
    </group>
  )
}

function Reservoir() {
  const timeMode = useTimeModeStore((s) => s.timeMode)
  const cfg = DAY_NIGHT[timeMode]

  return (
    <group position={[0, -0.4, -50]} rotation={[-Math.PI / 2, 0, 0]}>
      <mesh>
        <planeGeometry args={[80, 30]} />
        {cfg.reservoir.useMirror ? (
          <MeshReflectorMaterial
            blur={[400, 100]} resolution={1024} mixBlur={1} mixStrength={60}
            roughness={0.1} color={cfg.reservoir.mirrorColor} metalness={0.5} mirror={0.8}
          />
        ) : (
          <meshStandardMaterial color={cfg.reservoir.standardColor} transparent opacity={0.7} />
        )}
      </mesh>
    </group>
  )
}

function CityContext() {
  const timeMode = useTimeModeStore((s) => s.timeMode)
  const cfg = DAY_NIGHT[timeMode]

  const blocks = useMemo(() => {
    const data = []
    for (let x = -200; x <= 200; x += 45) {
      for (let z = -200; z <= 200; z += 45) {
        if (Math.abs(x) < 80 && Math.abs(z) < 80) continue
        if (z < -30 && Math.abs(x) < 40) continue
        if (z > 20 && Math.abs(x) < 20) continue
        const h = 2 + Math.abs(Math.sin(x * 12.3 + z * 4.5)) * 6
        const w = 20 + Math.abs(Math.cos(x * 3.2)) * 15
        const d = 20 + Math.abs(Math.sin(z * 8.1)) * 15
        const offsetX = Math.sin(x * z) * 8
        const offsetZ = Math.cos(x * z) * 8
        data.push({ position: [x + offsetX, h / 2, z + offsetZ] as [number, number, number], size: [w, h, d] as [number, number, number] })
      }
    }
    return data
  }, [])

  return (
    <group>
      {blocks.map((block, i) => (
        <Box key={`city-block-${i}`} args={block.size} position={block.position}>
          <meshStandardMaterial color={cfg.cityContext.color} transparent={false} roughness={0.9} />
        </Box>
      ))}
    </group>
  )
}

function GroundDecorations() {
  const timeMode = useTimeModeStore((s) => s.timeMode)
  const cfg = DAY_NIGHT[timeMode]

  const poiPoints: [number, number, number][] = [
    [0, 0.5, 20],
    [0, 0.5, 0],
    [-12, 0.5, -8],
    [12, 0.5, -8],
    [0, 0.5, -15],
    [-20, 0.5, -20],
    [20, 0.5, -20],
    [0, 0.5, -28],
  ]

  const connections: [[number, number, number], [number, number, number]][] = [
    [[0, 0.3, 0], [-12, 0.3, -8]],
    [[0, 0.3, 0], [12, 0.3, -8]],
    [[0, 0.3, 0], [0, 0.3, -15]],
    [[-12, 0.3, -8], [-20, 0.3, -20]],
    [[12, 0.3, -8], [20, 0.3, -20]],
    [[0, 0.3, -15], [0, 0.3, -28]],
  ]

  return (
    <group>
      {poiPoints.map((pos, i) => (
        <group key={`poi-${i}`} position={pos}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.8, 1.2, 32]} />
            <meshBasicMaterial color={cfg.poi.ringColor} transparent opacity={0.6} side={THREE.DoubleSide} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.5, 32]} />
            <meshBasicMaterial color={cfg.poi.dotColor} transparent opacity={0.8} side={THREE.DoubleSide} />
          </mesh>
          <Cylinder args={[0.05, 0.05, 2, 8]} position={[0, 1, 0]}>
            <meshBasicMaterial color={cfg.poi.pillarColor} transparent opacity={0.4} />
          </Cylinder>
        </group>
      ))}

      {connections.map(([start, end], i) => {
        const dx = end[0] - start[0]
        const dy = end[1] - start[1]
        const dz = end[2] - start[2]
        const length = Math.sqrt(dx * dx + dy * dy + dz * dz)
        const midX = (start[0] + end[0]) / 2
        const midY = (start[1] + end[1]) / 2
        const midZ = (start[2] + end[2]) / 2

        return (
          <group key={`conn-${i}`} position={[midX, midY, midZ]}>
            <mesh rotation={[0, Math.atan2(dx, dz), 0]}>
              <boxGeometry args={[0.08, 0.08, length]} />
              <meshBasicMaterial color={cfg.poi.lineColor} transparent opacity={0.5} />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}

export default function CampusBase() {
  const timeMode = useTimeModeStore((s) => s.timeMode)
  const cfg = DAY_NIGHT[timeMode]

  return (
    <group>
      <Plane args={[400, 400]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <meshStandardMaterial color={cfg.ground.color} polygonOffset polygonOffsetFactor={1} polygonOffsetUnits={1} />
      </Plane>

      <CityContext />
      <Roads />
      <Archways />
      <Courtyards />
      {BUILDINGS.filter(b => b.id === 'gymnasium').map((b) => (
        <RunningTrack key={`roof-${b.id}`} />
      ))}
      <Landscape />
      <Reservoir />
      <GroundDecorations />

      {BUILDINGS.map((b) => (
        <BuildingMesh key={b.id} building={b} />
      ))}

      <Environment preset={cfg.environment.preset as any} />
      <ContactShadows position={[0, 0.05, 0]} scale={80} resolution={1024} far={20} blur={2.5} opacity={0.6} color="#000000" />

      <ambientLight intensity={cfg.ambientLight.intensity} />
      <directionalLight position={[20, 30, 10]} intensity={cfg.directionalLight.intensity} castShadow />
      {timeMode === 'night' && <pointLight position={[0, 20, 0]} intensity={0.3} />}
    </group>
  )
}
```

- [ ] **Step 2: 验证编译**

```bash
pnpm exec tsc --noEmit --pretty src/components/scene/CampusBase.tsx 2>&1 | head -30
```

- [ ] **Step 3: 提交**

```bash
git add src/components/scene/CampusBase.tsx
git commit -m "feat: merge Classic and Tron into unified CampusBase with day/night mode"
```

---

### Task 7: 简化 6 个主题 Scene 文件

**Files:**
- Modify: `src/themes/overview/OverviewScene.tsx`
- Modify: `src/themes/teaching-research/TeachingResearchScene.tsx`
- Modify: `src/themes/admin/AdminScene.tsx`
- Modify: `src/themes/library/LibraryScene.tsx`
- Modify: `src/themes/academics/AcademicsScene.tsx`
- Modify: `src/themes/security/SecurityScene.tsx`

- [ ] **Step 1: 更新 OverviewScene.tsx**

```tsx
// src/themes/overview/OverviewScene.tsx

import CampusBase from '@/components/scene/CampusBase'

export default function OverviewScene() {
  return <CampusBase />
}
```

- [ ] **Step 2: 更新 TeachingResearchScene.tsx**

```tsx
// src/themes/teaching-research/TeachingResearchScene.tsx

import CampusBase from '@/components/scene/CampusBase'

export default function TeachingResearchScene() {
  return <CampusBase />
}
```

- [ ] **Step 3: 更新 AdminScene.tsx**

```tsx
// src/themes/admin/AdminScene.tsx

import CampusBase from '@/components/scene/CampusBase'

export default function AdminScene() {
  return <CampusBase />
}
```

- [ ] **Step 4: 更新 LibraryScene.tsx**

```tsx
// src/themes/library/LibraryScene.tsx

import CampusBase from '@/components/scene/CampusBase'

export default function LibraryScene() {
  return <CampusBase />
}
```

- [ ] **Step 5: 更新 AcademicsScene.tsx**

```tsx
// src/themes/academics/AcademicsScene.tsx

import CampusBase from '@/components/scene/CampusBase'
import { Box } from '@react-three/drei'

const FLOOR_HEAT = [
  [0.92, 0.85, 0.78, 0.65, 0.45],
  [0.88, 0.82, 0.75, 0.60, 0.42],
  [0.90, 0.87, 0.80, 0.68, 0.50],
]

const HEAT_COLORS = ['#00c853', '#76ff03', '#ffc107', '#ff6d00', '#ff1744']

function ClassroomHeatmap() {
  const buildings = [
    { pos: [-18, 0.5, 4], floors: FLOOR_HEAT[0] },
    { pos: [-6, 0.5, 4], floors: FLOOR_HEAT[1] },
    { pos: [6, 0.5, 4], floors: FLOOR_HEAT[2] },
  ]

  return (
    <group>
      {buildings.map((b, bi) =>
        b.floors.map((usage, fi) => {
          const colorIdx = Math.floor(usage * (HEAT_COLORS.length - 1))
          const color = HEAT_COLORS[Math.min(colorIdx, HEAT_COLORS.length - 1)]
          return (
            <Box
              key={`${bi}-${fi}`}
              args={[9.5, 1.8, 0.2]}
              position={[b.pos[0], fi * 2.2 + 1.5, b.pos[2] + 3.6]}
            >
              <meshStandardMaterial
                color={color}
                transparent
                opacity={0.85}
                emissive={color}
                emissiveIntensity={0.3}
              />
            </Box>
          )
        })
      )}
    </group>
  )
}

export default function AcademicsScene() {
  return (
    <>
      <CampusBase />
      <ClassroomHeatmap />
    </>
  )
}
```

- [ ] **Step 6: 更新 SecurityScene.tsx**

```tsx
// src/themes/security/SecurityScene.tsx

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere, Html } from '@react-three/drei'
import CampusBase from '@/components/scene/CampusBase'
import { useUIStore } from '@/stores/useUIStore'

const DEVICES: { id: string; type: 'camera' | 'access'; position: [number, number, number]; label: string }[] = [
  { id: 'cam-1', type: 'camera' as const, position: [-18, 8, 7.5], label: '崇德楼摄像头' },
  { id: 'cam-2', type: 'camera' as const, position: [-6, 8, 7.5], label: '崇智楼摄像头' },
  { id: 'cam-3', type: 'camera' as const, position: [6, 8, 7.5], label: '崇信楼摄像头' },
  { id: 'cam-4', type: 'camera' as const, position: [0, 12, -10], label: '钟楼摄像头' },
  { id: 'cam-5', type: 'camera' as const, position: [-22, 6, -5], label: '体育馆摄像头' },
  { id: 'cam-6', type: 'camera' as const, position: [-14, 5, -13], label: '食堂摄像头' },
  { id: 'cam-7', type: 'camera' as const, position: [-10, 6, -7], label: '崇文楼摄像头' },
  { id: 'door-1', type: 'access' as const, position: [-8, 2, 9], label: '教学区门禁' },
  { id: 'door-2', type: 'access' as const, position: [0, 2, 9], label: '主入口门禁' },
  { id: 'door-3', type: 'access' as const, position: [-10, 2, -7], label: '图书馆门禁' },
  { id: 'door-4', type: 'access' as const, position: [-22, 2, -10], label: '体育馆门禁' },
]

const ALERT_LOCATIONS: { id: string; position: [number, number, number]; label: string }[] = [
  { id: 'alert-south', position: [0, 4, 15], label: '南围墙区域' },
  { id: 'alert-north', position: [0, 4, -20], label: '北围墙区域' },
  { id: 'alert-gym', position: [-22, 4, -8], label: '体育馆' },
  { id: 'alert-dorm', position: [19, 4, -5], label: '宿舍区' },
]

function BlinkingSphere({ position, color, size = 0.5 }: { position: [number, number, number]; color: string; size?: number }) {
  const ref = useRef<any>(null)
  const opacityRef = useRef(0.8)
  useFrame(() => {
    if (!ref.current?.material) return
    const t = Date.now() * 0.005
    const s = 1 + Math.sin(t) * 0.4
    ref.current.scale.setScalar(s)
    opacityRef.current = 0.5 + Math.sin(t) * 0.5
    ref.current.material.opacity = opacityRef.current
  })
  return (
    <Sphere ref={ref} args={[size, 16, 16]} position={position}>
      <meshStandardMaterial color={color} transparent emissive={color} emissiveIntensity={0.6} />
    </Sphere>
  )
}

function DeviceMarkers() {
  return (
    <group>
      {DEVICES.map((d) => (
        <group key={d.id}>
          <Sphere args={[0.3, 8, 8]} position={d.position}>
            <meshStandardMaterial
              color={d.type === 'camera' ? '#4a9eff' : '#00c853'}
              emissive={d.type === 'camera' ? '#4a9eff' : '#00c853'}
              emissiveIntensity={0.5}
            />
          </Sphere>
          <Html position={[d.position[0], d.position[1] + 0.6, d.position[2]]} center distanceFactor={40} style={{ pointerEvents: 'none' }}>
            <div style={{
              background: d.type === 'camera' ? 'rgba(74,158,255,0.8)' : 'rgba(0,200,83,0.8)',
              color: '#fff', padding: '1px 6px', borderRadius: 3, fontSize: 9, whiteSpace: 'nowrap',
            }}>
              {d.type === 'camera' ? '📹' : '🚪'} {d.label}
            </div>
          </Html>
        </group>
      ))}
    </group>
  )
}

function AlertMarkers() {
  const alertQueue = useUIStore((s) => s.alertQueue)

  const activeLocations = useMemo(() => {
    if (alertQueue.length === 0) return []
    const count = Math.min(alertQueue.length, ALERT_LOCATIONS.length)
    return ALERT_LOCATIONS.slice(0, count)
  }, [alertQueue.length])

  if (activeLocations.length === 0) return null

  return (
    <group>
      {activeLocations.map((loc) => (
        <group key={loc.id}>
          <BlinkingSphere position={loc.position as [number, number, number]} color="#ff1744" size={0.6} />
          <Html position={[loc.position[0], loc.position[1] + 1, loc.position[2]]} center distanceFactor={40} style={{ pointerEvents: 'none' }}>
            <div style={{
              background: 'rgba(255,23,68,0.9)', color: '#fff',
              padding: '2px 8px', borderRadius: 4, fontSize: 10, whiteSpace: 'nowrap',
              animation: 'pulse 1s ease-in-out infinite',
            }}>
              ⚠ {loc.label}
            </div>
          </Html>
        </group>
      ))}
    </group>
  )
}

export default function SecurityScene() {
  return (
    <>
      <CampusBase />
      <DeviceMarkers />
      <AlertMarkers />
    </>
  )
}
```

- [ ] **Step 7: 验证所有 6 个文件编译**

```bash
pnpm exec tsc --noEmit --pretty 2>&1 | head -40
```

- [ ] **Step 8: 提交**

```bash
git add src/themes/overview/OverviewScene.tsx \
        src/themes/teaching-research/TeachingResearchScene.tsx \
        src/themes/admin/AdminScene.tsx \
        src/themes/library/LibraryScene.tsx \
        src/themes/academics/AcademicsScene.tsx \
        src/themes/security/SecurityScene.tsx
git commit -m "refactor: simplify theme scenes to use unified CampusBase"
```

---

### Task 8: 删除旧 CampusBase 文件并验证最终构建

**Files:**
- Delete: `src/components/scene/CampusBaseClassic.tsx`
- Delete: `src/components/scene/CampusBaseTron.tsx`
- Verify: `src/components/scene/CampusBase.tsx` (new merge, no longer just a re-export)

- [ ] **Step 1: 删除旧文件**

```bash
rm src/components/scene/CampusBaseClassic.tsx src/components/scene/CampusBaseTron.tsx
```

- [ ] **Step 2: 提交**

```bash
git add src/components/scene/CampusBaseClassic.tsx src/components/scene/CampusBaseTron.tsx
git commit -m "refactor: remove old Classic and Tron CampusBase files"
```

---

### Task 9: 全量构建和测试验证

- [ ] **Step 1: 运行 TypeScript 全面检查**

```bash
pnpm exec tsc --noEmit 2>&1
```
期望：零错误

- [ ] **Step 2: 运行构建**

```bash
pnpm build 2>&1
```
期望：`pnpm build` 成功通过

- [ ] **Step 3: 运行测试**

```bash
pnpm test 2>&1
```
期望：31/31 测试通过（或保持现有通过数）

- [ ] **Step 4: 提交（如有修复）**

```bash
git add -A && git diff --cached --stat
# 仅当有修复时提交
```

---

## 执行顺序依赖

```
Task 1 (config) ──┐
Task 2 (store) ───┼── 无依赖，可并行
                  │
Task 3 (TopBar) ──┤ 依赖 Task 2
Task 4 (Canvas) ──┤ 依赖 Task 1, 2
Task 5 (Particle)─┤ 依赖 Task 1, 2
Task 6 (Base) ────┤ 依赖 Task 1, 2 (最大的任务)
Task 7 (Themes) ──┤ 依赖 Task 6
Task 8 (Delete) ──┤ 依赖 Task 7
Task 9 (Verify) ──┘ 依赖全部
```

推荐执行顺序：1 → 2 → 3,4,5,6 可并行 → 7 → 8 → 9
