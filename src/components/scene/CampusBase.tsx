import { Box, Cylinder } from '@react-three/drei'
import { Plane } from '@react-three/drei'

interface BuildingData {
  id: string
  label: string
  position: [number, number, number]
  size: [number, number, number]
  color: string
}

const BUILDINGS: BuildingData[] = [
  { id: 'chongde', label: '崇德楼', position: [-18, 5.5, 4], size: [10, 11, 7], color: '#a0522d' },
  { id: 'chongzhi', label: '崇智楼', position: [-6, 5.5, 4], size: [10, 11, 7], color: '#a0522d' },
  { id: 'chongxin', label: '崇信楼', position: [6, 5.5, 4], size: [10, 11, 7], color: '#a0522d' },
  { id: 'chongwen', label: '崇文楼', position: [-10, 4, -10], size: [8, 8, 6], color: '#8b4513' },
  { id: 'chongya', label: '崇雅楼', position: [16, 5, -8], size: [7, 10, 6], color: '#cd853f' },
  { id: 'chongsi', label: '崇思楼', position: [22, 5, -2], size: [7, 10, 6], color: '#cd853f' },
  { id: 'bell-tower', label: '钟楼', position: [0, 10, -12], size: [3, 20, 3], color: '#b5651d' },
  { id: 'gymnasium', label: '体育馆', position: [-22, 4, -8], size: [8, 8, 10], color: '#d2b48c' },
  { id: 'canteen', label: '食堂', position: [-14, 3.5, -16], size: [8, 7, 6], color: '#deb887' },
]

export default function CampusBase() {
  return (
    <group>
      <Plane
        args={[100, 100]}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.01, 0]}
        receiveShadow
      >
        <meshStandardMaterial color="#1a5c2a" />
      </Plane>

      {BUILDINGS.map((b) => (
        <group key={b.id}>
          <Box args={b.size} position={b.position} castShadow receiveShadow>
            <meshStandardMaterial color={b.color} transparent opacity={0.9} />
          </Box>
        </group>
      ))}

      <ambientLight intensity={0.5} />
      <directionalLight position={[20, 30, 10]} intensity={0.8} castShadow />
      <pointLight position={[0, 20, 0]} intensity={0.3} />
    </group>
  )
}
