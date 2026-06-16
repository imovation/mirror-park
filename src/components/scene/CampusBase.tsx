import { useState } from 'react'
import { Box, Plane, Html, Grid, Cylinder, Sphere } from '@react-three/drei'
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
}

export const BUILDINGS: BuildingData[] = [
  /* ── Teaching Zone ── U-shaped courtyard, entrance at south ── */
  { id: 'chongde', label: '崇德楼', position: [-12, 5.5, 6], size: [10, 11, 7], color: '#a0522d', info: '初一年级教学楼' },
  { id: 'chongzhi', label: '崇智楼', position: [0, 5.5, 10], size: [14, 11, 7], color: '#a0522d', info: '初二年级教学楼 · 正对校门' },
  { id: 'chongxin', label: '崇信楼', position: [12, 5.5, 6], size: [10, 11, 7], color: '#a0522d', info: '初三年级教学楼' },
  /* Bell Tower ── landmark in the courtyard ── */
  { id: 'bell-tower', label: '钟楼', position: [0, 14, 8], size: [3, 8, 3], color: '#b5651d', info: '镇远中学标志性钟楼 · 雅典学派风格' },
  /* Gymnasium ── west side of teaching zone, track on roof ── */
  { id: 'gymnasium', label: '体育馆', position: [-24, 5, 0], size: [14, 10, 18], color: '#d2b48c', info: '多功能体育馆 · 楼顶400m跑道+真草球场' },
  /* Library ── down garden paths north of sports field ── */
  { id: 'chongwen', label: '崇文楼', position: [-10, 4.5, -7], size: [12, 9, 7], color: '#8b4513', info: '开放式图书馆 · 2层 · 藏书10万余册' },
  /* Cafeteria ── further north along axis ── */
  { id: 'canteen', label: '食堂', position: [-10, 3.5, -13], size: [10, 7, 8], color: '#deb887', info: '16个窗口 · 370+张餐桌 · 1500人同时就餐' },
  /* Dormitories ── tallest buildings, flanking cafeteria ── */
  { id: 'chongya', label: '崇雅楼', position: [-22, 11, -14], size: [7, 22, 7], color: '#cd853f', info: '师生宿舍 · 22层 · 校园最高建筑' },
  { id: 'chongsi', label: '崇思楼', position: [2, 7.5, -14], size: [7, 15, 7], color: '#cd853f', info: '师生宿舍 · 15层' },
]

function BuildingMesh({ building }: { building: BuildingData }) {
  const [hovered, setHovered] = useState(false)
  const selectedId = useSceneStore((s) => s.selectedObjectId)
  const selectObject = useSceneStore((s) => s.selectObject)
  const currentTheme = useThemeStore((s) => s.currentTheme)
  const isSelected = selectedId === building.id
  const isOverview = currentTheme === ThemeId.OVERVIEW

  return (
    <group>
      <Box
        args={building.size}
        position={building.position}
        castShadow
        receiveShadow
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
        <meshStandardMaterial
          color={building.color}
          transparent
          opacity={hovered || isSelected ? 1 : 0.85}
          emissive={isSelected ? '#4a9eff' : hovered ? '#ffffff' : '#000000'}
          emissiveIntensity={isSelected ? 0.4 : hovered ? 0.15 : 0}
        />
      </Box>

      <Html
        position={[building.position[0], building.position[1] + building.size[1] / 2 + 1.5, building.position[2]]}
        center distanceFactor={40} style={{ pointerEvents: 'none' }}
      >
        <div style={{
          background: isSelected ? 'rgba(74,158,255,0.9)' : 'rgba(0,0,0,0.7)',
          color: '#fff', padding: '3px 10px', borderRadius: 4, fontSize: 12,
          fontWeight: 'bold', whiteSpace: 'nowrap',
          border: isSelected ? '2px solid #fff' : '1px solid rgba(255,255,255,0.2)',
          transition: 'all 0.3s',
        }}>
          {building.label}
        </div>
      </Html>
    </group>
  )
}

function Archways() {
  return (
    <group>
      {/* Main entrance archway at south */}
      <Box args={[6, 6, 2]} position={[0, 3, 16]}>
        <meshStandardMaterial color="#c4a882" />
      </Box>
      <Box args={[7, 0.6, 3]} position={[0, 6.3, 16]}>
        <meshStandardMaterial color="#b89b72" />
      </Box>
      {/* West archway: 崇德楼 ↔ 崇智楼 */}
      <Box args={[2, 5, 2]} position={[-7, 2.5, 8]}>
        <meshStandardMaterial color="#c4a882" />
      </Box>
      <Box args={[2.5, 0.5, 3]} position={[-7, 5.2, 8]}>
        <meshStandardMaterial color="#b89b72" />
      </Box>
      {/* East archway: 崇智楼 ↔ 崇信楼 */}
      <Box args={[2, 5, 2]} position={[7, 2.5, 8]}>
        <meshStandardMaterial color="#c4a882" />
      </Box>
      <Box args={[2.5, 0.5, 3]} position={[7, 5.2, 8]}>
        <meshStandardMaterial color="#b89b72" />
      </Box>
    </group>
  )
}

function Roads() {
  return (
    <group position={[0, 0.02, 0]}>
      {/* Main entrance approach */}
      <Box args={[6, 0.05, 6]} position={[0, 0, 19]}>
        <meshStandardMaterial color="#3a3a3a" />
      </Box>
      {/* Steps up through entrance archway */}
      <Box args={[6, 0.05, 4]} position={[0, 0, 14]}>
        <meshStandardMaterial color="#4a4a4a" />
      </Box>
      {/* Teaching courtyard open space */}
      <Box args={[14, 0.05, 6]} position={[0, 0, 6]}>
        <meshStandardMaterial color="#2a2a2a" />
      </Box>
      {/* Main axis path north from teaching zone */}
      <Box args={[5, 0.05, 8]} position={[0, 0, -1]}>
        <meshStandardMaterial color="#3a3a3a" />
      </Box>
      {/* Path to library */}
      <Box args={[5, 0.05, 10]} position={[-10, 0, -3]}>
        <meshStandardMaterial color="#3a3a3a" />
      </Box>
      {/* Path from library to cafeteria */}
      <Box args={[5, 0.05, 8]} position={[-10, 0, -11]}>
        <meshStandardMaterial color="#3a3a3a" />
      </Box>
      {/* West connector to gymnasium */}
      <Box args={[8, 0.05, 4]} position={[-20, 0, 4]}>
        <meshStandardMaterial color="#3a3a3a" />
      </Box>
      {/* Garden paths flanking the axis toward dorms */}
      <Box args={[2, 0.05, 10]} position={[-6, 0, -10]}>
        <meshStandardMaterial color="#3a3a3a" />
      </Box>
      <Box args={[2, 0.05, 10]} position={[4, 0, -10]}>
        <meshStandardMaterial color="#3a3a3a" />
      </Box>
    </group>
  )
}

function RunningTrack() {
  return (
    <group position={[-24, 10.1, 0]}>
      {/* Red track surface on gymnasium roof */}
      <Box args={[13, 0.1, 17]}>
        <meshStandardMaterial color="#c44" />
      </Box>
      {/* Lane markings */}
      {Array.from({ length: 6 }, (_, i) => (
        <Box key={`lane-${i}`} args={[12.2 - i * 0.8, 0.12, 16.2 - i * 0.8]} position={[0, 0.02, 0]}>
          <meshStandardMaterial color="#c44" transparent opacity={0.5 + i * 0.08} />
        </Box>
      ))}
      {/* Football field in center */}
      <Box args={[4, 0.15, 8]} position={[0, 0.08, 0]}>
        <meshStandardMaterial color="#2d5a1e" />
      </Box>
    </group>
  )
}

function Trees() {
  const positions: [number, number, number][] = [
    /* Entrance approach */
    [-5, 0, 18], [5, 0, 18],
    [-6, 0, 16], [6, 0, 16],
    /* Teaching zone perimeter */
    [-16, 0, 6], [16, 0, 6],
    [-16, 0, 12], [16, 0, 12],
    /* Garden paths to north */
    [-4, 0, -2], [4, 0, -2],
    /* Around library */
    [-20, 0, -7], [0, 0, -7],
    /* Around cafeteria & dorms */
    [-18, 0, -13], [-4, 0, -13], [8, 0, -13],
    /* Perimeter */
    [20, 0, -14], [-28, 0, -10],
  ]
  return (
    <group>
      {positions.map((pos, i) => (
        <group key={`tree-${i}`} position={pos}>
          <Cylinder args={[0.08, 0.12, 1.5, 6]} position={[0, 0.75, 0]}>
            <meshStandardMaterial color="#5c3a1e" />
          </Cylinder>
          <Sphere args={[0.8, 8, 6]} position={[0, 1.8, 0]}>
            <meshStandardMaterial color="#2d5a1e" />
          </Sphere>
          <Sphere args={[0.6, 8, 6]} position={[0.3, 1.5, 0.3]}>
            <meshStandardMaterial color="#1e4a15" />
          </Sphere>
          <Sphere args={[0.55, 8, 6]} position={[-0.25, 1.6, -0.25]}>
            <meshStandardMaterial color="#25631a" />
          </Sphere>
        </group>
      ))}
    </group>
  )
}

function Courtyards() {
  return (
    <group position={[0, 0.03, 0]}>
      {/* Main teaching quadrangle courtyard — U-shape interior */}
      <Box args={[14, 0.05, 5]} position={[0, 0, 6]}>
        <meshStandardMaterial color="#2a4a2a" />
      </Box>
      {/* Library front garden */}
      <Box args={[8, 0.05, 4]} position={[-10, 0, -4]}>
        <meshStandardMaterial color="#1e3a1e" />
      </Box>
      {/* Garden between library and cafeteria */}
      <Box args={[6, 0.05, 4]} position={[-10, 0, -10]}>
        <meshStandardMaterial color="#1e3a1e" />
      </Box>
      {/* Cafeteria plaza */}
      <Box args={[12, 0.05, 6]} position={[-6, 0, -13]}>
        <meshStandardMaterial color="#1a2a1a" />
      </Box>
    </group>
  )
}

function Reservoir() {
  return (
    <group>
      <Box args={[30, 0.5, 5]} position={[0, -0.5, -38]} rotation={[0.02, 0, 0]}>
        <meshStandardMaterial color="#2a5a8a" transparent opacity={0.7} />
      </Box>
      <Box args={[28, 0.1, 4]} position={[0, 0.05, -38]} rotation={[0.02, 0, 0]}>
        <meshStandardMaterial color="#4a8ac4" transparent opacity={0.4} />
      </Box>
    </group>
  )
}

function Hillside() {
  return (
    <group>
      {/* First terrace behind dorms */}
      <Box args={[35, 3, 8]} position={[0, -0.5, -21]} rotation={[0.04, 0, 0]}>
        <meshStandardMaterial color="#1a3a1a" />
      </Box>
      {/* Second terrace stepping up */}
      <Box args={[40, 2.5, 10]} position={[0, -0.5, -28]} rotation={[0.06, 0, 0]}>
        <meshStandardMaterial color="#153015" />
      </Box>
      {/* Third terrace */}
      <Box args={[45, 2, 12]} position={[0, -1, -34]} rotation={[0.08, 0, 0]}>
        <meshStandardMaterial color="#0f250f" />
      </Box>
      {/* Final hillside blending into mountain */}
      <Box args={[50, 1.5, 15]} position={[0, -1.5, -40]} rotation={[0.1, 0, 0]}>
        <meshStandardMaterial color="#0a1f0a" />
      </Box>
    </group>
  )
}

export default function CampusBase() {
  return (
    <group>
      <Plane args={[120, 120]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <meshStandardMaterial color="#1a5c2a" />
      </Plane>

      <Grid args={[120, 120]} position={[0, 0.01, 0]} cellSize={2} cellThickness={0.5}
        cellColor="#4a9eff" sectionSize={10} sectionThickness={1} sectionColor="#1a3a5c"
        fadeDistance={80} fadeStrength={1} infiniteGrid />

      <Roads />
      <Archways />
      <Courtyards />
      <RunningTrack />
      <Trees />
      <Reservoir />
      <Hillside />

      {BUILDINGS.map((b) => (
        <BuildingMesh key={b.id} building={b} />
      ))}

      <ambientLight intensity={0.5} />
      <directionalLight position={[20, 30, 10]} intensity={0.8} castShadow />
      <pointLight position={[0, 20, 0]} intensity={0.3} />
    </group>
  )
}
