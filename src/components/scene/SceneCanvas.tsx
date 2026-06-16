import type { ReactNode } from 'react'
import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import ParticleBg from './ParticleBg'
import CameraController from './CameraController'
import SceneInfo from './SceneInfo'
import { SCENE } from '@/utils/constants'

interface SceneCanvasProps {
  children: ReactNode
}

export default function SceneCanvas({ children }: SceneCanvasProps) {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas
        camera={{ fov: 50, near: 0.1, far: 1000 }}
        style={{ background: 'linear-gradient(180deg, #0a1628 0%, #16213e 100%)' }}
      >
        <fog attach="fog" args={[SCENE.FOG_COLOR, SCENE.FOG_NEAR, SCENE.FOG_FAR]} />
        <Suspense fallback={null}>
          {children}
          <ParticleBg />
          <CameraController />
        </Suspense>
      </Canvas>
      <SceneInfo />
    </div>
  )
}
