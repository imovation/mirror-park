import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import CampusBase from './CampusBase'
import CameraController from './CameraController'
import { SCENE } from '@/utils/constants'

export default function SceneCanvas() {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Canvas
        camera={{ fov: 50, near: 0.1, far: 1000 }}
        style={{ background: 'linear-gradient(180deg, #0a1628 0%, #16213e 100%)' }}
      >
        <fog attach="fog" args={[SCENE.FOG_COLOR, SCENE.FOG_NEAR, SCENE.FOG_FAR]} />
        <Suspense fallback={null}>
          <CampusBase />
          <CameraController />
        </Suspense>
      </Canvas>
    </div>
  )
}
