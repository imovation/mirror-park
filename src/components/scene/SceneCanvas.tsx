import type { ReactNode } from 'react'
import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import ParticleBg from './ParticleBg'
import CameraController from './CameraController'
import SceneInfo from './SceneInfo'
import { useTimeModeStore } from '@/stores/useTimeModeStore'
import { DAY_NIGHT } from '@/config/dayNightTheme'
import { SCENE } from '@/utils/constants'

interface SceneCanvasProps {
  children: ReactNode
}

function SceneContent() {
  const timeMode = useTimeModeStore((s) => s.timeMode)
  const cfg = DAY_NIGHT[timeMode]
  return (
    <>
      <fog attach="fog" args={[cfg.fog.color, SCENE.FOG_NEAR, SCENE.FOG_FAR]} />
      <ParticleBg />
      <CameraController />
      <EffectComposer>
        <Bloom luminanceThreshold={0.5} luminanceSmoothing={0.9} mipmapBlur intensity={cfg.bloom.intensity} />
      </EffectComposer>
    </>
  )
}

export default function SceneCanvas({ children }: SceneCanvasProps) {
  const timeMode = useTimeModeStore((s) => s.timeMode)
  const cfg = DAY_NIGHT[timeMode]
  return (
    <div className="scene-loading" style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas
        camera={{ fov: 50, near: 0.1, far: 1000 }}
        style={{ background: cfg.canvas.background }}
      >
        {children}
        <Suspense fallback={null}>
          <SceneContent />
        </Suspense>
      </Canvas>
      <SceneInfo />
    </div>
  )
}
