# Tron-Style 3D Scene Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace building/road materials with custom WebGL shaders (lit windows + flowing road lights), add dual-layer grid, unify UI colors to cyan (#00e5ff).

**Architecture:** `THREE.ShaderMaterial` created via React `useMemo`/`useRef`, attached via `<primitive object={mat} attach="material" />`. Shader source in `.vert`/`.frag` files loaded with Vite `?raw` import. `useFrame` drives `uTime` uniform for animation. Edges component and Bloom post-processing unchanged.

**Tech Stack:** React 18 + TS + Vite, @react-three/fiber v8, @react-three/drei v9, three.js v0.169

**Files affected:**
- Create: `src/shaders/roadFlow.vert`, `src/shaders/roadFlow.frag`
- Create: `src/shaders/buildingWindow.vert`, `src/shaders/buildingWindow.frag`
- Modify: `src/components/scene/CampusBase.tsx`
- Modify: `src/components/scene/SceneCanvas.tsx` (Bloom tuning only)

---

### Task 1: Create Shader Source Files

**Files:**
- Create: `src/shaders/roadFlow.vert`
- Create: `src/shaders/roadFlow.frag`
- Create: `src/shaders/buildingWindow.vert`
- Create: `src/shaders/buildingWindow.frag`

- [ ] **Step 1: Create `src/shaders/roadFlow.vert`**

```glsl
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
```

- [ ] **Step 2: Create `src/shaders/roadFlow.frag`**

```glsl
varying vec2 vUv;
uniform float uTime;
uniform vec3 uColor;
uniform float uSpeed;
uniform float uStripeCount;
uniform float uFlowAxis;

void main() {
  float coord = uFlowAxis < 0.5 ? vUv.x : vUv.y;
  float stripe = fract(coord * uStripeCount - uTime * uSpeed);
  float core = smoothstep(0.0, 0.06, stripe) * (1.0 - smoothstep(0.22, 0.45, stripe));
  float glow = smoothstep(0.0, 0.15, stripe) * (1.0 - smoothstep(0.65, 1.0, stripe));
  vec3 base = vec3(0.02, 0.02, 0.06);
  vec3 color = mix(base, uColor, core * 0.9);
  color = mix(color, uColor, glow * 0.2);
  float edgeDist = min(min(vUv.x, 1.0 - vUv.x), min(vUv.y, 1.0 - vUv.y));
  float edgeFade = smoothstep(0.0, 0.2, edgeDist);
  gl_FragColor = vec4(color * (0.3 + 0.7 * edgeFade), 1.0);
}
```

- [ ] **Step 3: Create `src/shaders/buildingWindow.vert`**

```glsl
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
```

- [ ] **Step 4: Create `src/shaders/buildingWindow.frag`**

```glsl
varying vec2 vUv;
uniform float uWindowDensity;
uniform float uLitChance;
uniform vec3 uBaseColor;
uniform vec3 uWindowColor;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {
  vec2 gridUv = fract(vUv * uWindowDensity);
  vec2 cellId = floor(vUv * uWindowDensity);
  float margin = 0.12;
  float wx = step(margin, gridUv.x) * step(margin, 1.0 - gridUv.x);
  float wy = step(margin, gridUv.y) * step(margin, 1.0 - gridUv.y);
  float windowMask = wx * wy;
  float lit = step(1.0 - uLitChance, hash(cellId));
  vec3 color = mix(uBaseColor, uWindowColor, windowMask * lit * 0.85);
  gl_FragColor = vec4(color, 1.0);
}
```

- [ ] **Step 5: Commit**

```bash
git add src/shaders/
git commit -m "feat: add road flow and building window shader source files"
```

---

### Task 2: Replace Roads with GlowRoads Shader

**Files:**
- Modify: `src/components/scene/CampusBase.tsx`

- [ ] **Step 1: Add shader imports at top of file**

After the drei import line, add:

```tsx
import roadFlowVert from '@/shaders/roadFlow.vert?raw'
import roadFlowFrag from '@/shaders/roadFlow.frag?raw'
import buildingWindowVert from '@/shaders/buildingWindow.vert?raw'
import buildingWindowFrag from '@/shaders/buildingWindow.frag?raw'
```

- [ ] **Step 2: Replace the `Roads` function completely**

Locate `function Roads()` and replace the entire function body with:

```tsx
function Roads() {
  const matRefs = useRef<THREE.ShaderMaterial[]>([])

  const X_FLOW = 0  // uFlowAxis=0 → UV.x (road extends in X)
  const Z_FLOW = 1  // uFlowAxis=1 → UV.y (road extends in Z)

  const materials = useMemo(() => {
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
  }, [])

  useFrame((_, delta) => {
    for (const m of matRefs.current) m.uniforms.uTime.value += delta
  })

  // X-aligned roads (longest dimension is X): use orangeX or cyanX
  // Z-aligned roads (longest dimension is Z): use orangeZ or cyanZ
  // Road: args = [widthX, heightY, depthZ]
  //   X-aligned: widthX > depthZ → uFlowAxis=0 (UV.x)
  //   Z-aligned: widthX < depthZ → uFlowAxis=1 (UV.y)

  return (
    <group position={[0, 0.02, 0]}>
      {/* Main entrance approach — Z-aligned (6x6, flow in Z) */}
      <mesh position={[0, 0, 19]}><boxGeometry args={[6, 0.04, 6]} /><primitive object={materials.orangeZ} attach="material" /></mesh>
      {/* Steps through archway — Z-aligned */}
      <mesh><boxGeometry args={[6, 0.04, 4]} /><primitive object={materials.orangeZ} attach="material" position={[0, 0, 14]} /></mesh>
      {/* Teaching courtyard — X-aligned (14x6, flow in X) */}
      <mesh><boxGeometry args={[14, 0.04, 6]} /><primitive object={materials.cyanX} attach="material" position={[0, 0, 6]} /></mesh>
      {/* Main axis north — Z-aligned */}
      <mesh><boxGeometry args={[5, 0.04, 8]} /><primitive object={materials.orangeZ} attach="material" position={[0, 0, -1]} /></mesh>
      {/* Path to library — Z-aligned */}
      <mesh><boxGeometry args={[5, 0.04, 10]} /><primitive object={materials.cyanZ} attach="material" position={[-10, 0, -3]} /></mesh>
      {/* Library to cafeteria — Z-aligned */}
      <mesh><boxGeometry args={[5, 0.04, 8]} /><primitive object={materials.cyanZ} attach="material" position={[-10, 0, -11]} /></mesh>
      {/* West connector to gym — X-aligned */}
      <mesh><boxGeometry args={[8, 0.04, 4]} /><primitive object={materials.orangeX} attach="material" position={[-20, 0, 4]} /></mesh>
      {/* Garden path west — Z-aligned */}
      <mesh><boxGeometry args={[2, 0.04, 10]} /><primitive object={materials.cyanZ} attach="material" position={[-6, 0, -10]} /></mesh>
      {/* Garden path east — Z-aligned */}
      <mesh><boxGeometry args={[2, 0.04, 10]} /><primitive object={materials.cyanZ} attach="material" position={[4, 0, -10]} /></mesh>
      {/* South boulevard extension — Z-aligned */}
      <mesh><boxGeometry args={[6, 0.04, 25]} /><primitive object={materials.orangeZ} attach="material" position={[0, 0, 29]} /></mesh>
      {/* Entrance plaza widening — X-aligned */}
      <mesh><boxGeometry args={[10, 0.04, 4]} /><primitive object={materials.orangeX} attach="material" position={[0, 0, 18]} /></mesh>
    </group>
  )
}
```

- [ ] **Step 3: Remove `SouthBoulevard` function**

Delete the entire `function SouthBoulevard()` block (its roads are now in Roads above).

- [ ] **Step 4: Remove `<SouthBoulevard />` from render**

In the `CampusBase` return block, delete the `<SouthBoulevard />` line.

- [ ] **Step 5: Commit**

```bash
git add src/components/scene/CampusBase.tsx
git commit -m "feat: replace Roads with GlowRoads shader, remove SouthBoulevard"
```

---

### Task 3: Replace BuildingMesh Material with Window Shader

**Files:**
- Modify: `src/components/scene/CampusBase.tsx`

- [ ] **Step 1: Create building window materials outside component**

Add this helper above the `BUILDINGS` array:

```tsx
function createWindowMaterial(
  windowDensity: number,
  litChance: number,
  baseColor: string,
  windowColor: string = '#00e5ff',
) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uWindowDensity: { value: windowDensity },
      uLitChance: { value: litChance },
      uBaseColor: { value: new THREE.Color(baseColor) },
      uWindowColor: { value: new THREE.Color(windowColor) },
    },
    vertexShader: buildingWindowVert,
    fragmentShader: buildingWindowFrag,
    transparent: false,
  })
}

// Pre-allocate shared materials per building type
const WINDOW_MATS = {
  teaching: createWindowMaterial(5, 0.45, '#06101e'),
  dorm:      createWindowMaterial(6, 0.55, '#06101e'),
  gym:       createWindowMaterial(3, 0.35, '#06101e'),
  tower:     createWindowMaterial(4, 0.40, '#06101e'),
}
```

- [ ] **Step 2: Replace the `BuildingMesh` Box material**

In `BuildingMesh`, find the `Box` with `meshStandardMaterial`. Replace the entire `<meshStandardMaterial ... />` element with:

```tsx
{(() => {
  let mat: THREE.ShaderMaterial
  const id = building.id
  if (id === 'chongde' || id === 'chongzhi' || id === 'chongxin')
    mat = WINDOW_MATS.teaching
  else if (id === 'chongya' || id === 'chongsi')
    mat = WINDOW_MATS.dorm
  else if (id === 'gymnasium' || id === 'canteen')
    mat = WINDOW_MATS.gym
  else
    mat = WINDOW_MATS.tower
  return <primitive object={mat} attach="material" />
})()}
```

Also remove any `emissive` and `transparent` props from the old `meshStandardMaterial` — they are now handled by the shader.

- [ ] **Step 3: Commit**

```bash
git add src/components/scene/CampusBase.tsx
git commit -m "feat: replace BuildingMesh material with window light shader"
```

---

### Task 4: Add Dual-Layer 3D Grid

**Files:**
- Modify: `src/components/scene/CampusBase.tsx`

- [ ] **Step 1: Add second Grid layer**

In the `CampusBase` return block, immediately after the existing `<Grid>` element, add:

```tsx
{/* 悬浮全息投影网格 */}
<Grid args={[400, 400]} position={[0, 1.5, 0]} cellSize={2} cellThickness={0.3}
  cellColor="#00e5ff" sectionSize={10} sectionThickness={0.8} sectionColor="#0d2847"
  fadeDistance={200} fadeStrength={1} infiniteGrid />
```

- [ ] **Step 2: Commit**

```bash
git add src/components/scene/CampusBase.tsx
git commit -m "feat: add suspended holographic grid layer"
```

---

### Task 5: Color Unification (All → #00e5ff)

**Files:**
- Modify: `src/components/scene/CampusBase.tsx`

- [ ] **Step 1: Unify DataRings colors**

In `DataRings`, change all `color="#4a9eff"` → `color="#00e5ff"`.

- [ ] **Step 2: Unify LightPillar color**

In `LightPillar`, change `color="#4a9eff"` → `color="#00e5ff"`.

- [ ] **Step 3: Unify RunningTrack lane colors**

In `RunningTrack`, change the lane `meshStandardMaterial` color from `"#4a9eff"` → `"#00e5ff"`.

- [ ] **Step 4: Unify Html card border colors**

In `BuildingMesh`'s Html card styles, change:
- `'1px solid rgba(0, 229, 255, 0.3)'` (this line is already correct from the earlier rewrite)
- Any remaining `#4a9eff` references in the card → `#00e5ff`

- [ ] **Step 5: Commit**

```bash
git add src/components/scene/CampusBase.tsx
git commit -m "style: unify all tech accents to cyan #00e5ff"
```

---

### Task 6: Bloom Tuning

**Files:**
- Modify: `src/components/scene/SceneCanvas.tsx`

- [ ] **Step 1: Adjust Bloom parameters for new shader materials**

The new window shader and road flow shader produce different luminance values than the old red-brick materials. Reduce Bloom slightly to avoid overexposure:

In the `<Bloom>` element, change:
```tsx
luminanceThreshold={0.6} → luminanceThreshold={0.5}
mipmapBlur intensity={0.8} → mipmapBlur intensity={0.6}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/scene/SceneCanvas.tsx
git commit -m "tweak: reduce Bloom intensity for new shader materials"
```

---

### Task 7: Build and Visual Verification

- [ ] **Step 1: Build check**

```bash
pnpm run build
```
Expected: `✓ built in X.XXs` (chunk size warnings acceptable)

- [ ] **Step 2: Dev server visual check**

```bash
pnpm dev
```

Open browser at `http://localhost:3000` and verify:
1. Roads show animated orange/cyan light stripes flowing
2. Building faces show pseudo-random lit cyan window grids
3. Two grid layers visible — base grid at ground, holographic grid floating above
4. DataRings, LightPillar, lane markings all cyan (#00e5ff)
5. Clicking buildings shows expanded card with cyan border
6. Reservoir reflections still working
7. CityContext dark blocks present
8. No console errors in browser

- [ ] **Step 3: Commit (if any final tweaks)**

```bash
git add -A
git commit -m "chore: final build verification after shader migration"
```
