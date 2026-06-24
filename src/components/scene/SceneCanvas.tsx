import type { ReactNode } from 'react'
import { useState, useEffect, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import ParticleBg from './ParticleBg'
import CameraController from './CameraController'
import CameraStateSync from './CameraStateSync'
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
      {import.meta.env.DEV && <CameraStateSync />}
      <EffectComposer>
        <Bloom luminanceThreshold={0.5} luminanceSmoothing={0.9} mipmapBlur intensity={cfg.bloom.intensity} />
      </EffectComposer>
    </>
  )
}

const getAdaptiveFov = (width: number, height: number): number => {
  const aspect = width / height
  let fov = 50 * (1.78 / Math.max(aspect, 0.5))
  return Math.max(30, Math.min(75, fov))
}

export default function SceneCanvas({ children }: SceneCanvasProps) {
  const timeMode = useTimeModeStore((s) => s.timeMode)
  const cfg = DAY_NIGHT[timeMode]
  const [viewportSize, setViewportSize] = useState({ width: 1920, height: 1080 })
  useEffect(() => {
    const updateSize = () => setViewportSize({ width: window.innerWidth, height: window.innerHeight })
    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])
  const fov = getAdaptiveFov(viewportSize.width, viewportSize.height)
  return (
    <div className="scene-loading" style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas
        camera={{ fov, near: 0.1, far: 1000 }}
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
