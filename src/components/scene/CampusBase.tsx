import { useState } from 'react'
import { Box, Plane, Html, Grid } from '@react-three/drei'
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
  { id: 'chongde', label: '崇德楼', position: [-18, 5.5, 4], size: [10, 11, 7], color: '#a0522d', info: '初一年级教学楼' },
  { id: 'chongzhi', label: '崇智楼', position: [-6, 5.5, 4], size: [10, 11, 7], color: '#a0522d', info: '初二年级教学楼' },
  { id: 'chongxin', label: '崇信楼', position: [6, 5.5, 4], size: [10, 11, 7], color: '#a0522d', info: '初三年级教学楼' },
  { id: 'chongwen', label: '崇文楼', position: [-10, 4, -10], size: [8, 8, 6], color: '#8b4513', info: '开放式图书馆 · 藏书10万余册' },
  { id: 'chongya', label: '崇雅楼', position: [16, 5, -8], size: [7, 10, 6], color: '#cd853f', info: '师生宿舍 · 22层' },
  { id: 'chongsi', label: '崇思楼', position: [22, 5, -2], size: [7, 10, 6], color: '#cd853f', info: '师生宿舍 · 15层' },
  { id: 'bell-tower', label: '钟楼', position: [0, 10, -12], size: [3, 20, 3], color: '#b5651d', info: '镇远中学标志性建筑' },
  { id: 'gymnasium', label: '体育馆', position: [-22, 4, -8], size: [8, 8, 10], color: '#d2b48c', info: '室内体育馆 · 游泳馆 · 报告厅' },
  { id: 'canteen', label: '食堂', position: [-14, 3.5, -16], size: [8, 7, 6], color: '#deb887', info: '16个窗口 · 可容纳1500人同时就餐' },
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
          if (isOverview) {
            selectObject(isSelected ? null : building.id)
          }
        }}
        onPointerOver={(e) => {
          e.stopPropagation()
          if (isOverview) { setHovered(true); document.body.style.cursor = 'pointer' }
        }}
        onPointerOut={(e) => {
          e.stopPropagation()
          setHovered(false); document.body.style.cursor = 'default'
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
        center
        distanceFactor={40}
        style={{ pointerEvents: 'none' }}
      >
        <div style={{
          background: isSelected ? 'rgba(74,158,255,0.9)' : 'rgba(0,0,0,0.7)',
          color: '#fff',
          padding: '3px 10px',
          borderRadius: 4,
          fontSize: 12,
          fontWeight: 'bold',
          whiteSpace: 'nowrap',
          border: isSelected ? '2px solid #fff' : '1px solid rgba(255,255,255,0.2)',
          transition: 'all 0.3s',
        }}>
          {building.label}
        </div>
      </Html>
    </group>
  )
}

function Roads() {
  return (
    <group position={[0, 0.02, 0]}>
      <Box args={[50, 0.05, 2]} position={[0, 0, 4]}>
        <meshStandardMaterial color="#333" />
      </Box>
      <Box args={[2, 0.05, 20]} position={[-10, 0, -2]}>
        <meshStandardMaterial color="#333" />
      </Box>
      <Box args={[15, 0.05, 10]} position={[-6, 0, 0]}>
        <meshStandardMaterial color="#2a2a2a" />
      </Box>
    </group>
  )
}

export default function CampusBase() {
  return (
    <group>
      <Plane args={[100, 100]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <meshStandardMaterial color="#1a5c2a" />
      </Plane>

      <Grid
        args={[100, 100]}
        position={[0, 0.01, 0]}
        cellSize={2}
        cellThickness={0.5}
        cellColor="#4a9eff"
        sectionSize={10}
        sectionThickness={1}
        sectionColor="#1a3a5c"
        fadeDistance={80}
        fadeStrength={1}
        infiniteGrid
      />

      <Roads />

      {BUILDINGS.map((b) => (
        <BuildingMesh key={b.id} building={b} />
      ))}

      <ambientLight intensity={0.5} />
      <directionalLight position={[20, 30, 10]} intensity={0.8} castShadow />
      <pointLight position={[0, 20, 0]} intensity={0.3} />
    </group>
  )
}
