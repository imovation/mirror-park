import { useRef, useMemo, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere, Html } from '@react-three/drei'
import * as THREE from 'three'
import CampusBase from '@/components/scene/CampusBase'
import { useUIStore } from '@/stores/useUIStore'

function createIconTexture(type: 'camera' | 'access'): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 64
  canvas.height = 64
  const ctx = canvas.getContext('2d')!
  ctx.clearRect(0, 0, 64, 64)
  ctx.strokeStyle = type === 'camera' ? '#7dd3fc' : '#86efac'
  ctx.fillStyle = type === 'camera' ? 'rgba(8, 24, 48, 0.9)' : 'rgba(4, 28, 16, 0.9)'
  ctx.lineWidth = 3

  if (type === 'camera') {
    ctx.beginPath()
    ctx.moveTo(10, 18)
    ctx.lineTo(54, 18)
    ctx.lineTo(54, 46)
    ctx.lineTo(10, 46)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(32, 32, 9, 0, Math.PI * 2)
    ctx.fillStyle = '#7dd3fc'
    ctx.fill()
    ctx.beginPath()
    ctx.arc(32, 32, 5, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(8, 24, 48, 0.9)'
    ctx.fill()
    ctx.fillStyle = type === 'camera' ? '#7dd3fc' : '#86efac'
    ctx.beginPath()
    ctx.moveTo(55, 20)
    ctx.lineTo(60, 18)
    ctx.lineTo(60, 46)
    ctx.lineTo(55, 44)
    ctx.closePath()
    ctx.fill()
  } else {
    ctx.beginPath()
    ctx.moveTo(14, 12)
    ctx.lineTo(50, 12)
    ctx.lineTo(50, 52)
    ctx.lineTo(14, 52)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()
    ctx.fillStyle = '#86efac'
    ctx.fillRect(20, 18, 24, 3)
    ctx.fillRect(20, 30, 24, 3)
    ctx.fillRect(20, 42, 24, 3)
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}

const cameraIconTex = /*#__PURE__*/ createIconTexture('camera')
const accessIconTex = /*#__PURE__*/ createIconTexture('access')

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
        <DeviceMarker key={d.id} d={d} />
      ))}
    </group>
  )
}

function DeviceMarker({ d }: { d: typeof DEVICES[number] }) {
  const [hovered, setHovered] = useState(false)
  return (
    <group
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer' }}
      onPointerOut={(e) => { e.stopPropagation(); setHovered(false); document.body.style.cursor = 'default' }}
    >
      <sprite
        position={d.position}
        scale={hovered ? [1.8, 1.8, 1] : [1.2, 1.2, 1]}
      >
        <spriteMaterial
          map={d.type === 'camera' ? cameraIconTex : accessIconTex}
          transparent
          depthTest={false}
        />
      </sprite>
      <Html
        position={[d.position[0], d.position[1] + 0.6, d.position[2]]}
        center
        distanceFactor={40}
        style={{
          pointerEvents: 'none',
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.2s ease',
        }}
      >
        <div style={{
          background: d.type === 'camera' ? 'rgba(8, 24, 48, 0.92)' : 'rgba(4, 28, 16, 0.92)',
          color: d.type === 'camera' ? '#7dd3fc' : '#86efac',
          padding: '2px 8px',
          borderRadius: 4,
          fontSize: 'var(--font-size-2xs)',
          fontWeight: 600,
          whiteSpace: 'nowrap',
          border: d.type === 'camera' ? '1px solid rgba(125, 211, 252, 0.6)' : '1px solid rgba(134, 239, 172, 0.6)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
          textShadow: '0 1px 2px rgba(0,0,0,0.6)',
        }}>
          {d.type === 'camera' ? '📹' : '🚪'} {d.label}
        </div>
      </Html>
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
