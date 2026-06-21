import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere, Html } from '@react-three/drei'
import CampusBase from '@/components/scene/CampusBase'
import { useUIStore } from '@/stores/useUIStore'

const DEVICES: { id: string; type: 'camera' | 'access'; position: [number, number, number]; label: string }[] = [
  { id: 'cam-1', type: 'camera' as const, position: [-18, 8, 7.5], label: '崇德楼摄像头' },
  { id: 'cam-2', type: 'camera' as const, position: [-6, 8, 7.5], label: '崇智楼摄像头' },
  { id: 'cam-3', type: 'camera' as const, position: [6, 8, 7.5], label: '崇信楼摄像头' },
  { id: 'cam-4', type: 'camera' as const, position: [0, 12, -10], label: '钟楼摄像头' },
  { id: 'cam-5', type: 'camera' as const, position: [-22, 6, -5], label: '体育馆摄像头' },
  { id: 'cam-6', type: 'camera' as const, position: [-14, 5, -13], label: '食堂摄像头' },
  { id: 'cam-7', type: 'camera' as const, position: [-10, 6, -7], label: '崇文楼摄像头' },
  { id: 'door-1', type: 'access' as const, position: [-8, 2, 9], label: '教学区门禁' },
  { id: 'door-2', type: 'access' as const, position: [0, 2, 9], label: '主入口门禁' },
  { id: 'door-3', type: 'access' as const, position: [-10, 2, -7], label: '图书馆门禁' },
  { id: 'door-4', type: 'access' as const, position: [-22, 2, -10], label: '体育馆门禁' },
]

const ALERT_LOCATIONS: { id: string; position: [number, number, number]; label: string }[] = [
  { id: 'alert-south', position: [0, 4, 15], label: '南围墙区域' },
  { id: 'alert-north', position: [0, 4, -20], label: '北围墙区域' },
  { id: 'alert-gym', position: [-22, 4, -8], label: '体育馆' },
  { id: 'alert-dorm', position: [19, 4, -5], label: '宿舍区' },
]

function BlinkingSphere({ position, color, size = 0.5 }: { position: [number, number, number]; color: string; size?: number }) {
  const ref = useRef<any>(null)
  const opacityRef = useRef(0.8)
  useFrame(() => {
    if (!ref.current?.material) return
    const t = Date.now() * 0.005
    const s = 1 + Math.sin(t) * 0.4
    ref.current.scale.setScalar(s)
    opacityRef.current = 0.5 + Math.sin(t) * 0.5
    ref.current.material.opacity = opacityRef.current
  })
  return (
    <Sphere ref={ref} args={[size, 16, 16]} position={position}>
      <meshStandardMaterial color={color} transparent emissive={color} emissiveIntensity={0.6} />
    </Sphere>
  )
}

function DeviceMarkers() {
  return (
    <group>
      {DEVICES.map((d) => (
        <group key={d.id}>
          <Sphere args={[0.3, 8, 8]} position={d.position}>
            <meshStandardMaterial
              color={d.type === 'camera' ? '#4a9eff' : '#00c853'}
              emissive={d.type === 'camera' ? '#4a9eff' : '#00c853'}
              emissiveIntensity={0.5}
            />
          </Sphere>
          <Html position={[d.position[0], d.position[1] + 0.6, d.position[2]]} center distanceFactor={40} style={{ pointerEvents: 'none' }}>
            <div style={{
              background: d.type === 'camera' ? 'rgba(74,158,255,0.8)' : 'rgba(0,200,83,0.8)',
              color: 'var(--text-primary)', padding: '1px 6px', borderRadius: 3, fontSize: 'var(--font-size-2xs)', whiteSpace: 'nowrap',
            }}>
              {d.type === 'camera' ? '📹' : '🚪'} {d.label}
            </div>
          </Html>
        </group>
      ))}
    </group>
  )
}

function AlertMarkers() {
  const alertQueue = useUIStore((s) => s.alertQueue)

  const activeLocations = useMemo(() => {
    if (alertQueue.length === 0) return []
    const count = Math.min(alertQueue.length, ALERT_LOCATIONS.length)
    return ALERT_LOCATIONS.slice(0, count)
  }, [alertQueue.length])

  if (activeLocations.length === 0) return null

  return (
    <group>
      {activeLocations.map((loc) => (
        <group key={loc.id}>
          <BlinkingSphere position={loc.position as [number, number, number]} color="#ff1744" size={0.6} />
          <Html position={[loc.position[0], loc.position[1] + 1, loc.position[2]]} center distanceFactor={40} style={{ pointerEvents: 'none' }}>
            <div style={{
              background: 'var(--color-danger)', color: 'var(--text-primary)',
              padding: '2px 8px', borderRadius: 4, fontSize: 'var(--font-size-xs)', whiteSpace: 'nowrap',
              animation: 'pulse 1s ease-in-out infinite',
            }}>
              ⚠ {loc.label}
            </div>
          </Html>
        </group>
      ))}
    </group>
  )
}

export default function SecurityScene() {
  return (
    <>
      <CampusBase />
      <DeviceMarkers />
      <AlertMarkers />
    </>
  )
}
