import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useTimeModeStore } from '@/stores/useTimeModeStore'
import { DAY_NIGHT } from '@/config/dayNightTheme'

export default function ParticleBg({ count = 200 }: { count?: number }) {
  const mesh = useRef<THREE.Points>(null)
  const timeMode = useTimeModeStore((s) => s.timeMode)
  const particleCfg = DAY_NIGHT[timeMode].particle
  const floatTime = useRef(0)
  const baseY = useMemo(() => {
    const arr = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      arr[i] = Math.random() * 40 + 2
    }
    return arr
  }, [count])

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 80
      pos[i * 3 + 1] = baseY[i]
      pos[i * 3 + 2] = (Math.random() - 0.5) * 80
    }
    return pos
  }, [count, baseY])

  useFrame((_, delta) => {
    if (!mesh.current) return
    mesh.current.rotation.y += delta * 0.02
    floatTime.current += delta
    const pos = mesh.current.geometry.attributes.position.array as Float32Array
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 1] = baseY[i] + Math.sin(floatTime.current * 0.5 + i * 0.5) * 1.5
    }
    mesh.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        color={particleCfg.color}
        transparent
        opacity={particleCfg.opacity}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}
