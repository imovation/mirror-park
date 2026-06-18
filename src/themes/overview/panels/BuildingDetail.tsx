import { useSceneStore } from '@/stores/useSceneStore'
import { BUILDINGS } from '@/components/scene/CampusBase'

export default function BuildingDetail() {
  const selectedId = useSceneStore((s) => s.selectedObjectId)
  const building = BUILDINGS.find((b) => b.id === selectedId)

  if (!building) {
    return (
      <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textAlign: 'center', padding: 20 }}>
        点击左侧3D场景中的建筑查看详情
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 18, fontWeight: 'bold', color: 'var(--accent)', marginBottom: 4 }}>
          {building.label}
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
          {building.info}
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 12, color: 'var(--text-secondary)' }}>
        <div>位置: X{building.position[0].toFixed(0)} Z{building.position[2].toFixed(0)}</div>
        <div>规格: {building.size[0]}m x {building.size[2]}m</div>
        <div>层数: {building.size[1]}层</div>
        <div>风格: 红砖白墙</div>
      </div>
    </div>
  )
}
