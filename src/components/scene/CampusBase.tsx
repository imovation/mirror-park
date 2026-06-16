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
