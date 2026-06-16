import { useRef, useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { SCENE } from '@/utils/constants'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'

export default function CameraController() {
  const controlsRef = useRef<OrbitControlsImpl>(null)
  const { camera } = useThree()

  useEffect(() => {
    camera.position.set(...SCENE.DEFAULT_CAMERA.position)
    camera.lookAt(...SCENE.DEFAULT_CAMERA.target)
  }, [camera])

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.08}
      autoRotate
      autoRotateSpeed={0.3}
      minDistance={10}
      maxDistance={100}
      maxPolarAngle={Math.PI / 2.2}
      target={SCENE.DEFAULT_CAMERA.target}
    />
  )
}
