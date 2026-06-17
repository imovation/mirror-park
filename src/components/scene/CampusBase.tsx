import { useState, useMemo, useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Box, Plane, Html, Cylinder, Sphere, MeshReflectorMaterial, Edges, Environment, ContactShadows } from '@react-three/drei'
import roadFlowVert from '@/shaders/roadFlow.vert?raw'
import roadFlowFrag from '@/shaders/roadFlow.frag?raw'
import buildingWindowVert from '@/shaders/buildingWindow.vert?raw'
import buildingWindowFrag from '@/shaders/buildingWindow.frag?raw'
import { useSceneStore } from '@/stores/useSceneStore'
import { useThemeStore } from '@/stores/useThemeStore'
import { useTimeModeStore } from '@/stores/useTimeModeStore'
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
  // 教学复合体：崇德/崇智/崇信 三栋楼 + 钟楼置于崇智楼顶部
  { id: 'chongde', label: '崇德楼', position: [-13, 3, 6], size: [8, 6, 6], info: '初一年级教学楼 · 4层副楼' },
  { id: 'chongzhi', label: '崇智楼', position: [0, 4.5, 10], size: [14, 9, 7], info: '初二年级教学楼 · 6层主楼 · 正对校门' },
  { id: 'chongxin', label: '崇信楼', position: [13, 3, 6], size: [8, 6, 6], info: '初三年级教学楼 · 4层副楼' },
  { id: 'bell-tower', label: '钟楼', position: [-8, 5, 14], size: [2.5, 10, 2.5], info: '镇远中学标志性钟楼 · 展示校名 · 拱门左前方' },

  // 独立中型楼
  { id: 'chongwen', label: '崇文楼', position: [-10, 2, -7], size: [12, 4, 7], info: '开放式图书馆 · 2层 · 藏书10万余册' },
  { id: 'canteen', label: '食堂', position: [-10, 2, -13], size: [10, 4, 8], info: '16个窗口 · 370+张餐桌 · 1500人同时就餐' },

  // 高层建筑
  { id: 'chongya', label: '崇雅楼', position: [-22, 8, -14], size: [7, 16, 7], info: '师生宿舍 · 22层 · 校园最高建筑' },
  { id: 'chongsi', label: '崇思楼', position: [2, 6, -14], size: [7, 12, 7], info: '师生宿舍 · 15层' },

  // 体育馆
  { id: 'gymnasium', label: '体育馆', position: [-24, 5.1, 0], size: [14, 10, 18], info: '多功能体育馆 · 楼顶400m跑道+真草球场' },
]

function ConnectingCorridors() {
  const timeMode = useTimeModeStore((s) => s.timeMode)
  const cfg = DAY_NIGHT[timeMode]

  // 崇德楼中心 (-13, 3, 6), size [8, 6, 6]
  // 崇智楼中心 (0, 4.5, 10), size [14, 9, 7]
  // 崇信楼中心 (13, 3, 6), size [8, 6, 6]

  const corridorColor = cfg.building.facadeColor

  // 连廊 1：崇德楼 → 崇智楼（连接左翼到主楼）
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
  const [w, h, d] = building.size

  const floorBandCount = h >= 14 ? 7 : h >= 8 ? 5 : h >= 5 ? 3 : 1
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

      {/* 2. 楼板带（白色水平条带，钟楼是独立塔楼不画） */}
      {building.id !== 'bell-tower' && floorBandYs.map((y, i) => (
        <Box
          key={`band-${i}`}
          args={[w + 0.3, 0.3, d + 0.3]}
          position={[0, y, 0]}
          castShadow
        >
          <meshStandardMaterial color={cfg.building.facadeColor} />
        </Box>
      ))}

      {/* 3. 外走廊（正面凸出条带，钟楼不画） */}
      {building.id !== 'bell-tower' && floorBandYs.map((y, i) => (
        <Box
          key={`balcony-${i}`}
          args={[w * 0.8, 0.5, 0.6]}
          position={[0, y - 0.4, d / 2 + 0.3]}
          castShadow
        >
          <meshStandardMaterial color={cfg.building.facadeColor} />
        </Box>
      ))}

      {/* 4. 顶部女儿墙（gymnasium 有楼顶体育场，不画女儿墙） */}
      {building.id !== 'gymnasium' && (
        <Box
          args={[w + 0.4, 0.6, d + 0.4]}
          position={[0, h / 2 + 0.3, 0]}
          castShadow
        >
          <meshStandardMaterial color={cfg.building.facadeColor} />
        </Box>
      )}

      {/* 钟楼装饰：钟面 + 金字塔顶 + 校名 */}
      {building.id === 'bell-tower' && (
        <group>
          <mesh position={[0, 3, d / 2 + 0.05]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.8, 0.8, 0.05, 32]} />
            <meshStandardMaterial color="#f0e6c8" />
          </mesh>
          <mesh position={[0, 3, d / 2 + 0.06]} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.8, 0.95, 32]} />
            <meshStandardMaterial color="#8B7355" side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0, h / 2 + 0.6, 0]}>
            <coneGeometry args={[1.2, 1.2, 4]} />
            <meshStandardMaterial color={cfg.building.facadeColor} />
          </mesh>
          <Html
            position={[0, 0.5, d / 2 + 0.1]}
            center distanceFactor={40} style={{ pointerEvents: 'none' }}
          >
            <div style={{
              writingMode: 'vertical-rl',
              color: '#000000',
              fontSize: 16,
              fontWeight: 'bold',
              letterSpacing: 4,
              textOrientation: 'upright',
              fontFamily: '"Noto Serif SC", "SimSun", serif',
            }}>
              镇远中学
            </div>
          </Html>
        </group>
      )}

      {/* 崇智楼中央校门（拱门结构） */}
      {building.id === 'chongzhi' && (
        <group position={[0, 0, d / 2]}>
          <Box args={[2.0, 3.0, 0.1]} position={[0, -h / 2 + 1.5, 0.05]}>
            <meshStandardMaterial color={timeMode === 'day' ? '#1a1a1a' : '#000000'} />
          </Box>
          <Box args={[0.4, 3.0, 0.2]} position={[-1.2, -h / 2 + 1.5, 0.1]}>
            <meshStandardMaterial color={cfg.building.facadeColor} />
          </Box>
          <Box args={[0.4, 3.0, 0.2]} position={[1.2, -h / 2 + 1.5, 0.1]}>
            <meshStandardMaterial color={cfg.building.facadeColor} />
          </Box>
          <Box args={[2.8, 0.4, 0.2]} position={[0, -h / 2 + 3.2, 0.1]}>
            <meshStandardMaterial color={cfg.building.facadeColor} />
          </Box>
        </group>
      )}

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
}

function Archways() {
  const timeMode = useTimeModeStore((s) => s.timeMode)
  const cfg = DAY_NIGHT[timeMode]
  const pillarMat = <meshStandardMaterial color={cfg.archway.bodyColor} transparent={false} />
  const archMat = <meshStandardMaterial color={cfg.archway.topColor} transparent={false} />
  const edgeComp = cfg.archway.showEdges
    ? <Edges linewidth={2} threshold={15} color={cfg.archway.edgeColor} />
    : null

  return (
    <group>
      {/* 两侧连廊拱门（崇德楼↔崇智楼、崇智楼↔崇信楼） */}
      <Box args={[2, 5, 2]} position={[-7, 2.5, 8]}>{pillarMat}{edgeComp}</Box>
      <Box args={[2.5, 0.5, 3]} position={[-7, 5.2, 8]}>{archMat}{edgeComp}</Box>
      <Box args={[2, 5, 2]} position={[7, 2.5, 8]}>{pillarMat}{edgeComp}</Box>
      <Box args={[2.5, 0.5, 3]} position={[7, 5.2, 8]}>{archMat}{edgeComp}</Box>
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

  useEffect(() => {
    return () => {
      for (const m of matRefs.current) m.dispose()
      matRefs.current = []
    }
  }, [cfg.road.flowEnabled])

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
    <group position={[-24, 10.2, 0]}>
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
        // 多层正弦叠加，形成错落有致的山际线
        const h1 = Math.abs(Math.sin(x * 0.07 + z * 0.05)) * 12
        const h2 = Math.abs(Math.cos(x * 0.03 - z * 0.06)) * 6
        const h3 = Math.sin(x * 0.12) * Math.cos(z * 0.09) > 0.3 ? 6 : 0
        const h = 2 + h1 + h2 + h3
        const w = 15 + Math.abs(Math.cos(x * 0.04 + z * 0.03)) * 22
        const d = 15 + Math.abs(Math.sin(z * 0.04 - x * 0.03)) * 22
        const offsetX = Math.sin(x * 0.015 + z * 0.01) * 14
        const offsetZ = Math.cos(x * 0.01 - z * 0.015) * 14
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
      <ConnectingCorridors />

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
