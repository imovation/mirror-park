# Building Model Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 重构 3D 校园建筑模型，添加楼板带、外走廊、女儿墙、连廊、崇智楼中央拱门等学校建筑特征。

**Architecture:** 保持 BUILDINGS 数组中心点位置不变，但调整尺寸。将 BuildingMesh 渲染从单一 Box 改为"主体+楼板带+外走廊+女儿墙"4 层结构。崇智楼中央添加拱门 Box。教学三栋楼通过新增的 ConnectingCorridors 组件连接。

**Tech Stack:** React 18 + TypeScript, Three.js (R3F + drei)

---

### Task 1: 添加 `building.facadeColor` 字段到 dayNightTheme

**Files:**
- Modify: `src/config/dayNightTheme.ts`

- [ ] **Step 1: 在 `DayNightTheme` 接口的 `building` 中添加 `facadeColor` 字段**

在 `src/config/dayNightTheme.ts` 中，修改 `building` 字段定义（找到 `export interface DayNightTheme` 中的 `building: {` 块）：

```typescript
  building: {
    baseColor: string
    windowColor: string
    litChance: number
    facadeColor: string    // 新增：楼板带/外走廊/女儿墙/连廊/拱门装饰
  },
```

- [ ] **Step 2: 在 `DAY_NIGHT` 对象的 `day` 和 `night` 中添加 `facadeColor` 值**

在 `day` 配置的 `building` 块中添加（紧跟 `litChance: 0.6,` 之后）：

```typescript
    building: {
      baseColor: '#a0522d',
      windowColor: '#f5f0e8',
      litChance: 0.6,
      facadeColor: '#f0f4f8',  // 混凝土白
    },
```

在 `night` 配置的 `building` 块中添加：

```typescript
    building: {
      baseColor: '#06101e',
      windowColor: '#00e5ff',
      litChance: 0.6,
      facadeColor: '#1a2a3a',  // 暗蓝灰
    },
```

- [ ] **Step 3: 验证编译**

```bash
pnpm build 2>&1 | tail -20
```
期望：构建成功

- [ ] **Step 4: 提交**

```bash
git add src/config/dayNightTheme.ts
git commit -m "feat(theme): add building.facadeColor for facade elements"
```

---

### Task 2: 调整 BUILDINGS 数组几何

**Files:**
- Modify: `src/components/scene/CampusBase.tsx`

- [ ] **Step 1: 替换 BUILDINGS 数组**

在 `src/components/scene/CampusBase.tsx` 中，找到 `export const BUILDINGS: BuildingData[] = [` 并替换为：

```typescript
export const BUILDINGS: BuildingData[] = [
  // 教学复合体：崇德/崇智/崇信 三栋楼 + 钟楼置于崇智楼顶部
  { id: 'chongde', label: '崇德楼', position: [-13, 3, 6], size: [8, 6, 6], info: '初一年级教学楼 · 4层副楼' },
  { id: 'chongzhi', label: '崇智楼', position: [0, 4.5, 10], size: [14, 9, 7], info: '初二年级教学楼 · 6层主楼 · 正对校门 · 含中央拱门' },
  { id: 'chongxin', label: '崇信楼', position: [13, 3, 6], size: [8, 6, 6], info: '初三年级教学楼 · 4层副楼' },
  { id: 'bell-tower', label: '钟楼', position: [0, 9.5, 10], size: [2, 4, 2], info: '镇远中学标志性钟楼 · 雅典学派风格 · 置于崇智楼顶部' },

  // 独立中型楼
  { id: 'chongwen', label: '崇文楼', position: [-10, 2, -7], size: [12, 4, 7], info: '开放式图书馆 · 2层 · 藏书10万余册' },
  { id: 'canteen', label: '食堂', position: [-10, 2, -13], size: [10, 4, 8], info: '16个窗口 · 370+张餐桌 · 1500人同时就餐' },

  // 高层建筑
  { id: 'chongya', label: '崇雅楼', position: [-22, 8, -14], size: [7, 16, 7], info: '师生宿舍 · 22层 · 校园最高建筑' },
  { id: 'chongsi', label: '崇思楼', position: [2, 6, -14], size: [7, 12, 7], info: '师生宿舍 · 15层' },

  // 体育馆
  { id: 'gymnasium', label: '体育馆', position: [-24, 5.1, 0], size: [14, 10, 18], info: '多功能体育馆 · 楼顶400m跑道+真草球场' },
]
```

- [ ] **Step 2: 验证编译**

```bash
pnpm build 2>&1 | tail -10
```
期望：构建成功

- [ ] **Step 3: 提交**

```bash
git add src/components/scene/CampusBase.tsx
git commit -m "refactor(scene): adjust BUILDINGS geometry for new school-style layout"
```

---

### Task 3: 重构 BuildingMesh 渲染为 4 层结构

**Files:**
- Modify: `src/components/scene/CampusBase.tsx`

这是最大的一次改动。需要替换整个 `BuildingMesh` 函数组件。

- [ ] **Step 1: 找到 BuildingMesh 的当前 return 语句**

BuildingMesh 的 return 在文件中大约 line 97-180。整个 return 块包裹在 `<group position={building.position} ...>` 内。

- [ ] **Step 2: 替换 BuildingMesh 的 return 内容**

找到 `return (` 在 BuildingMesh 内部（紧跟 `const edgeColor = timeMode === 'night' ? '#00e5ff' : '#8B7355'` 之后），并将整个 return 块（从 `return (` 到匹配的 `)}`）替换为：

```typescript
  const edgeColor = timeMode === 'night' ? '#00e5ff' : '#8B7355'
  const [w, h, d] = building.size

  // 楼板带数量规则
  const floorBandCount = h >= 14 ? 7 : h >= 8 ? 5 : h >= 5 ? 3 : 1

  // 外走廊数量（与楼板带对齐）
  const balconyCount = floorBandCount

  // 楼板带 Y 坐标（从下到上均匀分布）
  const floorBandYs = Array.from({ length: floorBandCount }, (_, i) =>
    -h / 2 + (i + 1) * (h / (floorBandCount + 1))
  )

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
      {/* 1. 主体（红砖+窗户shader） */}
      <Box args={building.size} castShadow receiveShadow>
        <primitive object={mat} attach="material" />
        <Edges
          linewidth={isSelected ? 3 : 2}
          threshold={15}
          color={isSelected ? '#ffffff' : edgeColor}
        />
      </Box>

      {/* 2. 楼板带（白色水平条带） */}
      {floorBandYs.map((y, i) => (
        <Box
          key={`band-${i}`}
          args={[w + 0.3, 0.3, d + 0.3]}
          position={[0, y, 0]}
          castShadow
        >
          <meshStandardMaterial color={cfg.building.facadeColor} />
        </Box>
      ))}

      {/* 3. 外走廊（正面凸出条带） */}
      {floorBandYs.map((y, i) => (
        <Box
          key={`balcony-${i}`}
          args={[w * 0.8, 0.5, 0.6]}
          position={[0, y - 0.4, d / 2 + 0.3]}
          castShadow
        >
          <meshStandardMaterial color={cfg.building.facadeColor} />
        </Box>
      ))}

      {/* 4. 顶部女儿墙 */}
      <Box
        args={[w + 0.4, 0.6, d + 0.4]}
        position={[0, h / 2 + 0.3, 0]}
        castShadow
      >
        <meshStandardMaterial color={cfg.building.facadeColor} />
      </Box>

      <Html
        position={[0, building.size[1] / 2 + (isSelected ? 3 : 2), 0]}
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
```

- [ ] **Step 3: 验证编译**

```bash
pnpm build 2>&1 | tail -20
```
期望：构建成功（无编译错误）

- [ ] **Step 4: 启动 dev server 并视觉检查**

```bash
pnpm dev &
sleep 5
# 打开浏览器查看 http://localhost:3000
```
期望：3D 场景渲染正常，建筑有楼板带、外走廊、女儿墙

- [ ] **Step 5: 停止 dev server 并提交**

```bash
# 找到 dev server PID 并 kill
pkill -f "vite" 2>/dev/null || true
git add src/components/scene/CampusBase.tsx
git commit -m "feat(scene): refactor BuildingMesh to multi-layer school-style"
```

---

### Task 4: 添加崇智楼中央拱门

**Files:**
- Modify: `src/components/scene/CampusBase.tsx`

- [ ] **Step 1: 在 BuildingMesh 中添加 archway 渲染（仅 chongzhi）**

在 BuildingMesh 组件的 return 块内，紧跟顶部女儿墙 `<Box>` 之后、`{/* 4. */}` 注释之后（实际上是在 `4.顶部女儿墙` 之后），添加一个条件渲染：

找到：
```tsx
      {/* 4. 顶部女儿墙 */}
      <Box
        args={[w + 0.4, 0.6, d + 0.4]}
        position={[0, h / 2 + 0.3, 0]}
        castShadow
      >
        <meshStandardMaterial color={cfg.building.facadeColor} />
      </Box>

      <Html
```

在 `<Box ...>...</Box>` 后立即添加：
```tsx

      {/* 5. 中央拱门（仅 chongzhi） */}
      {building.id === 'chongzhi' && (
        <group position={[0, 0, d / 2]}>
          {/* 拱门洞（深色 Box 模拟） */}
          <Box args={[2.5, 3, 0.6]} position={[0, -h / 2 + 1.5, 0.3]}>
            <meshStandardMaterial
              color={timeMode === 'day' ? '#1a1a1a' : '#000000'}
            />
          </Box>
          {/* 拱门顶部装饰条 */}
          <Box args={[3, 0.4, 0.8]} position={[0, -h / 2 + 3.2, 0.3]}>
            <meshStandardMaterial color={cfg.building.facadeColor} />
          </Box>
        </group>
      )}
```

- [ ] **Step 2: 验证编译**

```bash
pnpm build 2>&1 | tail -10
```
期望：构建成功

- [ ] **Step 3: 提交**

```bash
git add src/components/scene/CampusBase.tsx
git commit -m "feat(scene): add central archway to chongzhi teaching building"
```

---

### Task 5: 添加 ConnectingCorridors 组件连接教学三栋楼

**Files:**
- Modify: `src/components/scene/CampusBase.tsx`

- [ ] **Step 1: 在文件顶部 BUILDINGS 数组之后、createWindowMaterial 之前，添加辅助函数**

找到 `function createWindowMaterial(` 这一行，在它之前添加：

```typescript
function ConnectingCorridors() {
  const timeMode = useTimeModeStore((s) => s.timeMode)
  const cfg = DAY_NIGHT[timeMode]

  // 崇德楼中心 (-13, 3, 6), size [8, 6, 6]
  // 崇智楼中心 (0, 4.5, 10), size [14, 9, 7]
  // 崇信楼中心 (13, 3, 6), size [8, 6, 6]

  const corridorColor = cfg.building.facadeColor

  // 连廊 1：崇德楼 → 崇智楼（连接左翼到主楼）
  // 起点：崇德楼右侧 (-13 + 4, 2.5, 6)  (崇德楼中心 + 宽度/2 = -13+4=-9)
  // 终点：崇智楼左侧 (0 - 7, 2.5, 10)    (崇智楼中心 - 宽度/2 = 0-7=-7)
  const c1Start: [number, number, number] = [-9, 2.5, 6]
  const c1End: [number, number, number] = [-7, 2.5, 10]
  const c1Mid: [number, number, number] = [
    (c1Start[0] + c1End[0]) / 2,
    (c1Start[1] + c1End[1]) / 2,
    (c1Start[2] + c1End[2]) / 2,
  ]
  const c1Dx = c1End[0] - c1Start[0]
  const c1Dz = c1End[2] - c1Start[2]
  const c1Length = Math.sqrt(c1Dx * c1Dx + c1Dz * c1Dz)
  const c1RotY = Math.atan2(c1Dx, c1Dz)

  // 连廊 2：崇智楼 → 崇信楼（连接主楼到右翼）
  const c2Start: [number, number, number] = [7, 2.5, 10]
  const c2End: [number, number, number] = [9, 2.5, 6]
  const c2Mid: [number, number, number] = [
    (c2Start[0] + c2End[0]) / 2,
    (c2Start[1] + c2End[1]) / 2,
    (c2Start[2] + c2End[2]) / 2,
  ]
  const c2Dx = c2End[0] - c2Start[0]
  const c2Dz = c2End[2] - c2Start[2]
  const c2Length = Math.sqrt(c2Dx * c2Dx + c2Dz * c2Dz)
  const c2RotY = Math.atan2(c2Dx, c2Dz)

  return (
    <group>
      <Box
        args={[c1Length, 1.5, 1.5]}
        position={c1Mid}
        rotation={[0, c1RotY, 0]}
        castShadow
      >
        <meshStandardMaterial color={corridorColor} />
      </Box>
      <Box
        args={[c2Length, 1.5, 1.5]}
        position={c2Mid}
        rotation={[0, c2RotY, 0]}
        castShadow
      >
        <meshStandardMaterial color={corridorColor} />
      </Box>
    </group>
  )
}
```

- [ ] **Step 2: 在 `export default function CampusBase()` 中渲染 ConnectingCorridors**

找到 `export default function CampusBase() {`，在它的 return 块内部，紧跟 `<GroundDecorations />` 之后添加：

```tsx
      <GroundDecorations />
      <ConnectingCorridors />
```

修改后该部分应该是：
```tsx
      <GroundDecorations />
      <ConnectingCorridors />

      {BUILDINGS.map((b) => (
        <BuildingMesh key={b.id} building={b} />
      ))}
```

- [ ] **Step 3: 验证编译**

```bash
pnpm build 2>&1 | tail -10
```
期望：构建成功

- [ ] **Step 4: 提交**

```bash
git add src/components/scene/CampusBase.tsx
git commit -m "feat(scene): add connecting corridors between teaching buildings"
```

---

### Task 6: 视觉验证和最终调整

- [ ] **Step 1: 启动 dev server**

```bash
pnpm dev &
sleep 5
```

- [ ] **Step 2: 浏览器打开 http://localhost:3000 检查**

确认以下视觉特征：
- [ ] 所有建筑有楼板带（白色横向条带）
- [ ] 教学楼有外走廊（正面凸出条带）
- [ ] 建筑顶部有女儿墙
- [ ] 崇德楼和崇智楼之间有连廊
- [ ] 崇智楼和崇信楼之间有连廊
- [ ] 崇智楼正面中央有拱门（深色矩形）
- [ ] 白天和夜间模式都正常切换
- [ ] 建筑点击交互正常（点击建筑弹出信息卡）

- [ ] **Step 3: 视觉细节调整（如有需要）**

如果需要微调（楼板带数量、外走廊长度、连廊位置、拱门大小等），直接编辑 `src/components/scene/CampusBase.tsx`，然后再次 build 验证。

- [ ] **Step 4: 停止 dev server**

```bash
pkill -f "vite" 2>/dev/null || true
```

- [ ] **Step 5: 运行完整测试套件**

```bash
pnpm test 2>&1
```
期望：35/35 测试通过

- [ ] **Step 6: 提交最终调整（如有）**

```bash
git status
# 如果有未提交的调整
git add -A
git commit -m "style(scene): visual adjustments to building refactor"
```

---

## 执行顺序依赖

```
Task 1 (facadeColor) ──┐
Task 2 (BUILDINGS) ────┤
                       ├── Task 3 (BuildingMesh 重构) 依赖 1+2
Task 3 ────────────────┤
                       ├── Task 4 (拱门) 依赖 3
Task 4 ────────────────┤
                       └── Task 5 (连廊) 依赖 3

Task 6 (验证) 依赖全部
```
