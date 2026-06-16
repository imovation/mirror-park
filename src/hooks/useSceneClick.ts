import { useThree } from '@react-three/fiber'
import { useSceneStore } from '@/stores/useSceneStore'

export function useSceneClick() {
  const { camera } = useThree()
  const selectObject = useSceneStore((s) => s.selectObject)
  const setCameraTarget = useSceneStore((s) => s.setCameraTarget)

  return {
    onObjectClick: (objectId: string, position: [number, number, number]) => {
      selectObject(objectId)
      setCameraTarget(position)
    },
  }
}
