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
                opacity={0.3}
                emissive={color}
                emissiveIntensity={0.1}
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
