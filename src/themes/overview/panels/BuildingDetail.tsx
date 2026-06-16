import { useSceneStore } from '@/stores/useSceneStore'
import { BUILDINGS } from '@/components/scene/CampusBase'

export default function BuildingDetail() {
  const selectedId = useSceneStore((s) => s.selectedObjectId)
  const requestFlyTo = useSceneStore((s) => s.requestFlyTo)
  const building = BUILDINGS.find((b) => b.id === selectedId)

  if (!building) {
    return (
      <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', textAlign: 'center', padding: 20 }}>
        点击左侧3D场景中的建筑查看详情
      </div>
    )
  }

  const handleFlyTo = () => {
    const camPos: [number, number, number] = [
      building.position[0] + 15,
      building.position[1] + 8,
      building.position[2] + 15,
    ]
    const lookAt: [number, number, number] = [
      building.position[0],
      building.position[1],
      building.position[2],
    ]
    requestFlyTo(camPos, lookAt)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 18, fontWeight: 'bold', color: '#4a9eff', marginBottom: 4 }}>
          {building.label}
        </div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
          {building.info}
        </div>
      </div>
      <button
        onClick={handleFlyTo}
        style={{
          padding: '6px 0',
          background: 'rgba(74,158,255,0.1)',
          border: '1px solid rgba(74,158,255,0.3)',
          borderRadius: 4,
          color: '#4a9eff',
          fontSize: 12,
          cursor: 'pointer',
          width: '100%',
        }}
      >
        🎯 飞向 {building.label}
      </button>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>
        <div>位置: X{building.position[0].toFixed(0)} Z{building.position[2].toFixed(0)}</div>
        <div>规格: {building.size[0]}m x {building.size[2]}m</div>
        <div>层数: {building.size[1]}层</div>
        <div>风格: 红砖白墙</div>
      </div>
    </div>
  )
}
