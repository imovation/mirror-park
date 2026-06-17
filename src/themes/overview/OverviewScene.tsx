import CampusBaseClassic from '@/components/scene/CampusBaseClassic'
import CampusBaseTron from '@/components/scene/CampusBaseTron'
import { useStyleStore } from '@/stores/useStyleStore'

export default function OverviewScene() {
  const style = useStyleStore((s) => s.visualStyle)
  return style === 'classic' ? <CampusBaseClassic /> : <CampusBaseTron />
}
