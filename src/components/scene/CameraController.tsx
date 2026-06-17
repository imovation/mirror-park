import { useRef, useEffect } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { useThemeStore } from '@/stores/useThemeStore'
import { useSceneStore } from '@/stores/useSceneStore'
import { SCENE } from '@/utils/constants'

function setControlsEnabled(ref: React.MutableRefObject<any>, enabled: boolean) {
  if (ref.current) {
    ref.current.enabled = enabled
  }
}

export default function CameraController() {
  const controlsRef = useRef<any>(null)
  const { camera } = useThree()
  const currentTheme = useThemeStore((s) => s.currentTheme)
  const finishTransition = useThemeStore((s) => s.finishTransition)
  const flyToRequest = useSceneStore((s) => s.flyToRequest)
  const targetPos = useRef(new THREE.Vector3())
  const targetLook = useRef(new THREE.Vector3())
  const isAnimating = useRef(false)

  useEffect(() => {
    camera.position.set(...SCENE.DEFAULT_CAMERA.position)
    camera.lookAt(...SCENE.DEFAULT_CAMERA.target)
  }, [camera])

  useEffect(() => {
    const preset = SCENE.THEME_CAMERAS[currentTheme as keyof typeof SCENE.THEME_CAMERAS] || SCENE.THEME_CAMERAS.overview
    targetPos.current.set(...preset.position)
    targetLook.current.set(...preset.target)
    isAnimating.current = true
    setControlsEnabled(controlsRef, false)

    if (controlsRef.current) {
      controlsRef.current.target.copy(targetLook.current)
      controlsRef.current.update()
    }

    const timer = setTimeout(() => {
      if (isAnimating.current) {
        isAnimating.current = false
        setControlsEnabled(controlsRef, true)
        if (controlsRef.current) controlsRef.current.update()
        finishTransition()
      }
    }, 2000)
    return () => {
      clearTimeout(timer)
      setControlsEnabled(controlsRef, true)
    }
  }, [currentTheme, finishTransition])

  useEffect(() => {
    if (!flyToRequest) return
    targetPos.current.set(...flyToRequest.position)
    targetLook.current.set(...flyToRequest.lookAt)
    isAnimating.current = true
    setControlsEnabled(controlsRef, false)

    if (controlsRef.current) {
      controlsRef.current.target.copy(targetLook.current)
      controlsRef.current.update()
    }
  }, [flyToRequest])

  useFrame((_, delta) => {
    if (!isAnimating.current) return
    const dist = camera.position.distanceTo(targetPos.current)
    if (dist < 0.3) {
      camera.position.copy(targetPos.current)
      isAnimating.current = false
      setControlsEnabled(controlsRef, true)
      if (controlsRef.current) controlsRef.current.update()
      finishTransition()
      return
    }
    camera.position.lerp(targetPos.current, Math.min(delta * 3, 0.1))
    camera.lookAt(targetLook.current)
  })

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.3}
      autoRotate
      autoRotateSpeed={0.08}
      minDistance={10}
      maxDistance={120}
      maxPolarAngle={Math.PI / 2.2}
      target={SCENE.DEFAULT_CAMERA.target}
    />
  )
}
