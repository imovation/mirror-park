import { useState, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Box, Plane, Html, Grid, Cylinder, Sphere, MeshReflectorMaterial, Edges, Environment, ContactShadows } from '@react-three/drei'
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

function Courtyards() {
  return (
    <group position={[0, 0.03, 0]}>
      <Box args={[14, 0.05, 5]} position={[0, 0, 6]}><meshStandardMaterial color="#0b2a26" /></Box>
      <Box args={[8, 0.05, 4]} position={[-10, 0, -4]}><meshStandardMaterial color="#0b2a26" /></Box>
      <Box args={[6, 0.05, 4]} position={[-10, 0, -10]}><meshStandardMaterial color="#0b2a26" /></Box>
      <Box args={[12, 0.05, 6]} position={[-6, 0, -13]}><meshStandardMaterial color="#0b2a26" /></Box>
    </group>
  )
}

function RunningTrack() {
  return (
    <group position={[-24, 10.1, 0]}>
      <Box args={[13, 0.1, 17]}><meshStandardMaterial color="#1a2535" /></Box>
      {Array.from({ length: 6 }, (_, i) => (
        <Box key={`lane-${i}`} args={[12.2 - i * 0.8, 0.12, 16.2 - i * 0.8]} position={[0, 0.02, 0]}>
          <meshStandardMaterial color="#00e5ff" transparent opacity={0.3 + i * 0.05} />
        </Box>
      ))}
      <Box args={[4, 0.15, 8]} position={[0, 0.08, 0]}><meshStandardMaterial color="#0b2a26" /></Box>
    </group>
  )
}

function Trees() {
  const positions: [number, number, number][] = [
    [-5, 0, 18], [5, 0, 18], [-6, 0, 16], [6, 0, 16],
    [-16, 0, 6], [16, 0, 6], [-16, 0, 12], [16, 0, 12],
    [-4, 0, -2], [4, 0, -2], [-20, 0, -7], [0, 0, -7],
    [-18, 0, -13], [-4, 0, -13], [8, 0, -13],
    [20, 0, -14], [-28, 0, -10],
    [22, 0, 4], [24, 0, 10], [22, 0, -4], [24, 0, -10], [26, 0, 0], [26, 0, 8], [26, 0, -8],
    [-30, 0, 4], [-32, 0, 10], [-30, 0, -4], [-32, 0, -10], [-34, 0, 0], [-34, 0, 8], [-34, 0, -8],
    [-5, 0, 22], [5, 0, 22], [-6, 0, 26], [6, 0, 26], [-8, 0, 24], [8, 0, 24], [-3, 0, 30], [3, 0, 30],
  ]
  return (
    <group>
      {positions.map((pos, i) => (
        <group key={`tree-${i}`} position={pos}>
          <Cylinder args={[0.08, 0.12, 1.5, 6]} position={[0, 0.75, 0]}>
            <meshStandardMaterial color="#2d1b11" />
          </Cylinder>
          <Sphere args={[0.8, 8, 6]} position={[0, 1.8, 0]}>
            <meshStandardMaterial color="#0c3a20" />
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

function DataRings() {
  const ringsRef = useRef<THREE.Group>(null)
  useFrame((_, delta) => {
    if (ringsRef.current) ringsRef.current.rotation.z += delta * 0.1
  })
  return (
    <group position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <group ref={ringsRef}>
        <mesh>
          <ringGeometry args={[48, 48.2, 64]} />
          <meshBasicMaterial color="#00e5ff" transparent opacity={0.3} side={THREE.DoubleSide} />
        </mesh>
        <mesh>
          <ringGeometry args={[42, 42.5, 64, 1, 0, Math.PI * 1.5]} />
          <meshBasicMaterial color="#00e5ff" transparent opacity={0.5} side={THREE.DoubleSide} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI]}>
          <ringGeometry args={[35, 35.1, 64, 1, 0, Math.PI]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.2} side={THREE.DoubleSide} />
        </mesh>
      </group>
    </group>
  )
}


export default function CampusBase() {
  return (
    <group>
      <Plane args={[400, 400]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <meshStandardMaterial color="#050a14" polygonOffset polygonOffsetFactor={1} polygonOffsetUnits={1} />
      </Plane>

      <Grid args={[400, 400]} position={[0, 0.01, 0]} cellSize={2} cellThickness={0.5}
        cellColor="#1a3a5c" sectionSize={10} sectionThickness={1} sectionColor="#0a1628"
        fadeDistance={200} fadeStrength={1} infiniteGrid />

      {/* 悬浮全息投影网格 */}
      <Grid args={[400, 400]} position={[0, 1.5, 0]} cellSize={2} cellThickness={0.3}
        cellColor="#00e5ff" sectionSize={10} sectionThickness={0.8} sectionColor="#0d2847"
        fadeDistance={200} fadeStrength={1} infiniteGrid />

      <CityContext />
      <Roads />
      <Archways />
      <Courtyards />
      <RunningTrack />
      <Trees />
      <Reservoir />
      <DataRings />

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
