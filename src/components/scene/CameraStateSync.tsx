import { useFrame, useThree } from '@react-three/fiber'
import { useCameraCaptureStore } from '@/stores/useCameraCaptureStore'
import { getOrbitControls } from '@/utils/cameraRef'

const ROUND = (v: number) => Math.round(v * 1000) / 1000

export default function CameraStateSync() {
  const camera = useThree((s) => s.camera)
  const setCurrent = useCameraCaptureStore((s) => s.setCurrent)

  useFrame(() => {
    const controls = getOrbitControls()
    if (!controls?.target) return
    setCurrent({
      position: [ROUND(camera.position.x), ROUND(camera.position.y), ROUND(camera.position.z)],
      target: [ROUND(controls.target.x), ROUND(controls.target.y), ROUND(controls.target.z)],
    })
  })

  return null
}
