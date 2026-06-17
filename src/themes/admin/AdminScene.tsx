import CampusBaseClassic from '@/components/scene/CampusBaseClassic'
import CampusBaseTron from '@/components/scene/CampusBaseTron'
import { useStyleStore } from '@/stores/useStyleStore'

export default function AdminScene() {
  const style = useStyleStore((s) => s.visualStyle)
  const Base = style === 'classic' ? CampusBaseClassic : CampusBaseTron
  return <Base />
}
