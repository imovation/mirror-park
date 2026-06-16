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
import { ThemeId } from '@/types/theme'

interface BuildingData {
  id: string
  label: string
  position: [number, number, number]
  size: [number, number, number]
  color: string
  info: string
  imageUrl?: string
}

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

const WINDOW_MATS = {
  teaching: createWindowMaterial(8, 0.6, '#06101e'),
  dorm:      createWindowMaterial(10, 0.7, '#06101e'),
  gym:       createWindowMaterial(4, 0.4, '#06101e'),
  tower:     createWindowMaterial(6, 0.55, '#06101e'),
}

export const BUILDINGS: BuildingData[] = [
  { id: 'chongde', label: '崇德楼', position: [-12, 5.5, 6], size: [10, 11, 7], color: '#06101e', info: '初一年级教学楼' },
  { id: 'chongzhi', label: '崇智楼', position: [0, 5.5, 10], size: [14, 11, 7], color: '#06101e', info: '初二年级教学楼 · 正对校门' },
  { id: 'chongxin', label: '崇信楼', position: [12, 5.5, 6], size: [10, 11, 7], color: '#06101e', info: '初三年级教学楼' },
  { id: 'bell-tower', label: '钟楼', position: [0, 14, 8], size: [3, 8, 3], color: '#06101e', info: '镇远中学标志性钟楼 · 雅典学派风格' },
  { id: 'gymnasium', label: '体育馆', position: [-24, 5, 0], size: [14, 10, 18], color: '#06101e', info: '多功能体育馆 · 楼顶400m跑道+真草球场' },
  { id: 'chongwen', label: '崇文楼', position: [-10, 4.5, -7], size: [12, 9, 7], color: '#06101e', info: '开放式图书馆 · 2层 · 藏书10万余册' },
  { id: 'canteen', label: '食堂', position: [-10, 3.5, -13], size: [10, 7, 8], color: '#06101e', info: '16个窗口 · 370+张餐桌 · 1500人同时就餐' },
  { id: 'chongya', label: '崇雅楼', position: [-22, 11, -14], size: [7, 22, 7], color: '#06101e', info: '师生宿舍 · 22层 · 校园最高建筑' },
  { id: 'chongsi', label: '崇思楼', position: [2, 7.5, -14], size: [7, 15, 7], color: '#06101e', info: '师生宿舍 · 15层' },
]

function BuildingMesh({ building }: { building: BuildingData }) {
  const [hovered, setHovered] = useState(false)
  const selectedId = useSceneStore((s) => s.selectedObjectId)
  const selectObject = useSceneStore((s) => s.selectObject)
  const currentTheme = useThemeStore((s) => s.currentTheme)
  const isSelected = selectedId === building.id
  const isOverview = currentTheme === ThemeId.OVERVIEW

  return (
    <group
      position={building.position}
      onClick={(e) => {
        e.stopPropagation()
        if (isOverview) selectObject(isSelected ? null : building.id)
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
        <Edges
          linewidth={isSelected ? 3 : 2}
          threshold={15}
          color={isSelected ? "#ffffff" : "#00e5ff"}
        />
      </Box>

      <Html
        position={[0, building.size[1] / 2 + (isSelected ? 2.5 : 1.5), 0]}
        center distanceFactor={40} style={{ pointerEvents: 'none', zIndex: isSelected ? 10 : 1 }}
      >
        <div style={{
          position: 'relative',
          background: isSelected ? 'rgba(6, 16, 30, 0.95)' : 'rgba(0,0,0,0.7)',
          color: '#fff', 
          padding: isSelected ? '8px 12px' : '3px 10px', 
          borderRadius: 6, 
          fontSize: 12,
          fontWeight: 'bold', 
          whiteSpace: isSelected ? 'normal' : 'nowrap',
          width: isSelected ? '170px' : 'auto',
          border: isSelected ? '2px solid #00e5ff' : '1px solid rgba(0, 229, 255, 0.3)',
          transition: 'all 0.3s',
          boxShadow: isSelected ? '0 0 20px rgba(0, 229, 255, 0.4)' : 'none',
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
                color: 'rgba(0,229,255,0.6)', fontSize: 14, cursor: 'pointer', padding: 0,
                lineHeight: 1, pointerEvents: 'auto',
              }}
              onPointerOver={(e) => e.stopPropagation()}
              onPointerOut={(e) => e.stopPropagation()}
            >
              ✕
            </button>
          )}
          <div style={{ fontSize: isSelected ? 14 : 12, color: isSelected ? '#00e5ff' : '#fff', paddingRight: isSelected ? 16 : 0 }}>
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
  const archMat = <meshStandardMaterial color="#06101e" transparent={false} />
  const edgeMat = <Edges linewidth={2} threshold={15} color="#00e5ff" />
  return (
    <group>
      <Box args={[6, 6, 2]} position={[0, 3, 16]}>{archMat}{edgeMat}</Box>
      <Box args={[7, 0.6, 3]} position={[0, 6.3, 16]}>{archMat}{edgeMat}</Box>
      <Box args={[2, 5, 2]} position={[-7, 2.5, 8]}>{archMat}{edgeMat}</Box>
      <Box args={[2.5, 0.5, 3]} position={[-7, 5.2, 8]}>{archMat}{edgeMat}</Box>
      <Box args={[2, 5, 2]} position={[7, 2.5, 8]}>{archMat}{edgeMat}</Box>
      <Box args={[2.5, 0.5, 3]} position={[7, 5.2, 8]}>{archMat}{edgeMat}</Box>
    </group>
  )
}

function Roads() {
  const matRefs = useRef<THREE.ShaderMaterial[]>([])

  const X_FLOW = 0
  const Z_FLOW = 1

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

  return (
    <group position={[0, 0.02, 0]}>
      <mesh position={[0, 0, 19]}><boxGeometry args={[6, 0.04, 6]} /><primitive object={materials.orangeZ} attach="material" /></mesh>
      <mesh position={[0, 0, 14]}><boxGeometry args={[6, 0.04, 4]} /><primitive object={materials.orangeZ} attach="material" /></mesh>
      <mesh position={[0, 0, 6]}><boxGeometry args={[14, 0.04, 6]} /><primitive object={materials.cyanX} attach="material" /></mesh>
      <mesh position={[0, 0, -1]}><boxGeometry args={[5, 0.04, 8]} /><primitive object={materials.orangeZ} attach="material" /></mesh>
      <mesh position={[-10, 0, -3]}><boxGeometry args={[5, 0.04, 10]} /><primitive object={materials.cyanZ} attach="material" /></mesh>
      <mesh position={[-10, 0, -11]}><boxGeometry args={[5, 0.04, 8]} /><primitive object={materials.cyanZ} attach="material" /></mesh>
      <mesh position={[-20, 0, 4]}><boxGeometry args={[8, 0.04, 4]} /><primitive object={materials.orangeX} attach="material" /></mesh>
      <mesh position={[-6, 0, -10]}><boxGeometry args={[2, 0.04, 10]} /><primitive object={materials.cyanZ} attach="material" /></mesh>
      <mesh position={[4, 0, -10]}><boxGeometry args={[2, 0.04, 10]} /><primitive object={materials.cyanZ} attach="material" /></mesh>
      <mesh position={[0, 0, 29]}><boxGeometry args={[6, 0.04, 25]} /><primitive object={materials.orangeZ} attach="material" /></mesh>
      <mesh position={[0, 0, 18]}><boxGeometry args={[10, 0.04, 4]} /><primitive object={materials.orangeX} attach="material" /></mesh>
    </group>
  )
}

function GroundZones() {
  const roadZoneMat = <meshBasicMaterial color="#2a3040" transparent opacity={0.6} />
  const parkZoneMat = <meshBasicMaterial color="#0a4a3a" transparent opacity={0.4} />
  const buildingBaseMat = <meshBasicMaterial color="#0a1525" transparent opacity={0.7} />
  
  return (
    <group position={[0, 0.02, 0]}>
      {/* 道路区域 - 灰色 */}
      <Box args={[8, 0.01, 40]} position={[0, 0, 0]}>{roadZoneMat}</Box>
      <Box args={[40, 0.01, 8]} position={[0, 0, 0]}>{roadZoneMat}</Box>
      <Box args={[6, 0.01, 30]} position={[-20, 0, -5]}>{roadZoneMat}</Box>
      <Box args={[6, 0.01, 30]} position={[20, 0, -5]}>{roadZoneMat}</Box>
      
      {/* 公园绿地区域 - 青绿色 */}
      <Box args={[25, 0.01, 20]} position={[0, 0, 15]}>{parkZoneMat}</Box>
      <Box args={[20, 0.01, 25]} position={[-15, 0, -15]}>{parkZoneMat}</Box>
      <Box args={[20, 0.01, 25]} position={[15, 0, -15]}>{parkZoneMat}</Box>
      <Box args={[30, 0.01, 15]} position={[0, 0, -30]}>{parkZoneMat}</Box>
      
      {/* 建筑底座区域 - 深蓝色 */}
      <Box args={[12, 0.01, 12]} position={[-12, 0, -8]}>{buildingBaseMat}</Box>
      <Box args={[12, 0.01, 12]} position={[12, 0, -8]}>{buildingBaseMat}</Box>
      <Box args={[12, 0.01, 12]} position={[-12, 0, 8]}>{buildingBaseMat}</Box>
      <Box args={[12, 0.01, 12]} position={[12, 0, 8]}>{buildingBaseMat}</Box>
      <Box args={[15, 0.01, 15]} position={[0, 0, 0]}>{buildingBaseMat}</Box>
    </group>
  )
}

function Courtyards() {
  const yardMat = <meshBasicMaterial color="#00ffaa" transparent opacity={0.15} />
  const edgeMat = <Edges linewidth={1.5} threshold={15} color="#00ffaa" />
  return (
    <group position={[0, 0.035, 0]}>
      {/* 中央大草坪 */}
      <Box args={[20, 0.05, 15]} position={[0, 0, 10]}>{yardMat}{edgeMat}</Box>
      
      {/* 教学楼间绿地 */}
      <Box args={[15, 0.05, 12]} position={[-12, 0, 0]}>{yardMat}{edgeMat}</Box>
      <Box args={[15, 0.05, 12]} position={[12, 0, 0]}>{yardMat}{edgeMat}</Box>
      
      {/* 图书馆周边绿地 */}
      <Box args={[18, 0.05, 10]} position={[0, 0, -15]}>{yardMat}{edgeMat}</Box>
      
      {/* 宿舍区绿地 */}
      <Box args={[12, 0.05, 15]} position={[-20, 0, -20]}>{yardMat}{edgeMat}</Box>
      <Box args={[12, 0.05, 15]} position={[20, 0, -20]}>{yardMat}{edgeMat}</Box>
      
      {/* 运动场周边绿地 */}
      <Box args={[25, 0.05, 8]} position={[0, 0, -28]}>{yardMat}{edgeMat}</Box>
    </group>
  )
}

function RunningTrack() {
  return (
    <group position={[-24, 10.1, 0]}>
      <Box args={[13, 0.1, 17]}><meshStandardMaterial color="#1a2535" /></Box>
      {Array.from({ length: 6 }, (_, i) => (
        <Box key={`lane-${i}`} args={[12.2 - i * 0.8, 0.12, 16.2 - i * 0.8]} position={[0, 0.02, 0]}>
          <meshBasicMaterial color="#00e5ff" transparent opacity={0.5 + i * 0.08} />
        </Box>
      ))}
      <Box args={[4, 0.15, 8]} position={[0, 0.08, 0]}><meshBasicMaterial color="#0e4a35" /></Box>
    </group>
  )
}

function Landscape() {
  // 绿篱 - 沿道路的低矮灌木
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

  // 花坛 - 彩色植物区
  const flowerBeds: { pos: [number, number, number]; size: [number, number, number]; color: string }[] = [
    { pos: [0, 0.15, 20], size: [6, 0.3, 4], color: '#ff6b9d' },
    { pos: [-12, 0.15, 10], size: [4, 0.3, 3], color: '#ffd93d' },
    { pos: [12, 0.15, 10], size: [4, 0.3, 3], color: '#6bcf7f' },
    { pos: [0, 0.15, -10], size: [5, 0.3, 3], color: '#4d96ff' },
    { pos: [-20, 0.15, -10], size: [3, 0.3, 4], color: '#ff6b9d' },
    { pos: [20, 0.15, -10], size: [3, 0.3, 4], color: '#ffd93d' },
  ]

  // 大树 - 不同大小和位置
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

  // 小树 - 点缀用
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
      {/* 绿篱 */}
      {hedges.map((h, i) => (
        <mesh key={`hedge-${i}`} position={h.pos}>
          <boxGeometry args={h.size} />
          <meshStandardMaterial color="#2d5a3d" roughness={0.8} />
        </mesh>
      ))}

      {/* 花坛 */}
      {flowerBeds.map((f, i) => (
        <mesh key={`flower-${i}`} position={f.pos}>
          <boxGeometry args={f.size} />
          <meshStandardMaterial color={f.color} emissive={f.color} emissiveIntensity={0.2} />
        </mesh>
      ))}

      {/* 大树 */}
      {largeTrees.map((t, i) => (
        <group key={`large-tree-${i}`} position={t.pos} scale={t.scale}>
          <Cylinder args={[0.15, 0.2, 3, 8]} position={[0, 1.5, 0]}>
            <meshStandardMaterial color="#3a2518" />
          </Cylinder>
          <Sphere args={[1.2, 8, 6]} position={[0, 3.5, 0]}>
            <meshStandardMaterial color="#1a5a30" emissive="#0a3a1a" emissiveIntensity={0.3} />
          </Sphere>
          <Sphere args={[0.9, 8, 6]} position={[0.6, 3.2, 0.4]}>
            <meshStandardMaterial color="#1e5e35" emissive="#0a3a1a" emissiveIntensity={0.3} />
          </Sphere>
          <Sphere args={[0.9, 8, 6]} position={[-0.5, 3.3, -0.3]}>
            <meshStandardMaterial color="#185528" emissive="#0a3a1a" emissiveIntensity={0.3} />
          </Sphere>
        </group>
      ))}

      {/* 小树 */}
      {smallTrees.map((t, i) => (
        <group key={`small-tree-${i}`} position={t.pos} scale={t.scale}>
          <Cylinder args={[0.1, 0.15, 2, 6]} position={[0, 1, 0]}>
            <meshStandardMaterial color="#3a2518" />
          </Cylinder>
          <Sphere args={[0.8, 8, 6]} position={[0, 2.3, 0]}>
            <meshStandardMaterial color="#1a5a30" emissive="#0a3a1a" emissiveIntensity={0.3} />
          </Sphere>
          <Sphere args={[0.6, 8, 6]} position={[0.4, 2.1, 0.3]}>
            <meshStandardMaterial color="#1e5e35" emissive="#0a3a1a" emissiveIntensity={0.3} />
          </Sphere>
        </group>
      ))}
    </group>
  )
}

function Reservoir() {
  return (
    <group position={[0, -0.4, -50]} rotation={[-Math.PI / 2, 0, 0]}>
      <mesh>
        <planeGeometry args={[80, 30]} />
        <MeshReflectorMaterial
          blur={[400, 100]} resolution={1024} mixBlur={1} mixStrength={60}
          roughness={0.1} color="#0d1a2d" metalness={0.5} mirror={0.8}
        />
      </mesh>
    </group>
  )
}

function CityContext() {
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
        const offsetX = Math.sin(x*z) * 8
        const offsetZ = Math.cos(x*z) * 8
        data.push({ position: [x + offsetX, h / 2, z + offsetZ] as [number, number, number], size: [w, h, d] as [number, number, number] })
      }
    }
    return data
  }, [])

  return (
    <group>
      {blocks.map((block, i) => (
        <Box key={`city-block-${i}`} args={block.size} position={block.position}>
          <meshStandardMaterial color="#080c14" transparent={false} roughness={0.9} />
        </Box>
      ))}
    </group>
  )
}

function GroundDecorations() {
  // POI 标注点位置 (建筑入口、路口等关键位置)
  const poiPoints: [number, number, number][] = [
    [0, 0.5, 20],      // 主入口
    [0, 0.5, 0],       // 中央广场
    [-12, 0.5, -8],    // 教学楼A入口
    [12, 0.5, -8],     // 教学楼B入口
    [0, 0.5, -15],     // 图书馆入口
    [-20, 0.5, -20],   // 宿舍A入口
    [20, 0.5, -20],    // 宿舍B入口
    [0, 0.5, -28],     // 运动场入口
  ]
  
  // 建筑间数据连线
  const connections: [[number, number, number], [number, number, number]][] = [
    [[0, 0.3, 0], [-12, 0.3, -8]],    // 中央 → 教学楼A
    [[0, 0.3, 0], [12, 0.3, -8]],     // 中央 → 教学楼B
    [[0, 0.3, 0], [0, 0.3, -15]],     // 中央 → 图书馆
    [[-12, 0.3, -8], [-20, 0.3, -20]], // 教学楼A → 宿舍A
    [[12, 0.3, -8], [20, 0.3, -20]],  // 教学楼B → 宿舍B
    [[0, 0.3, -15], [0, 0.3, -28]],   // 图书馆 → 运动场
  ]
  
  return (
    <group>
      {/* POI 发光点 */}
      {poiPoints.map((pos, i) => (
        <group key={`poi-${i}`} position={pos}>
          {/* 底部发光圆环 */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.8, 1.2, 32]} />
            <meshBasicMaterial color="#00e5ff" transparent opacity={0.6} side={THREE.DoubleSide} />
          </mesh>
          {/* 中心发光点 */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.5, 32]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.8} side={THREE.DoubleSide} />
          </mesh>
          {/* 垂直光柱 */}
          <Cylinder args={[0.05, 0.05, 2, 8]} position={[0, 1, 0]}>
            <meshBasicMaterial color="#00e5ff" transparent opacity={0.4} />
          </Cylinder>
        </group>
      ))}
      
      {/* 建筑间数据连线 */}
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
              <meshBasicMaterial color="#00e5ff" transparent opacity={0.5} />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}


export default function CampusBase() {
  return (
    <group>
      <Plane args={[400, 400]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <meshStandardMaterial color="#050a14" polygonOffset polygonOffsetFactor={1} polygonOffsetUnits={1} />
      </Plane>

      <CityContext />
      <GroundZones />
      <Roads />
      <Archways />
      <Courtyards />
      <RunningTrack />
      <Landscape />
      <Reservoir />
      <GroundDecorations />

      {BUILDINGS.map((b) => (
        <BuildingMesh key={b.id} building={b} />
      ))}

      <Environment preset="city" />
      <ContactShadows position={[0, 0.05, 0]} scale={80} resolution={1024} far={20} blur={2.5} opacity={0.6} color="#000000" />
      
      <ambientLight intensity={0.4} />
      <directionalLight position={[20, 30, 10]} intensity={0.8} castShadow />
      <pointLight position={[0, 20, 0]} intensity={0.3} />
    </group>
  )
}
