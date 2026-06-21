import { useRoomDistribution } from '@/api/queries/overview'
import BarChart from '@/components/charts/BarChart'
import StatusPanel from '@/components/ui/StatusPanel'
import ChartLabel from '@/components/ui/ChartLabel'

export default function RoomDistribution() {
  const { data, isLoading, error } = useRoomDistribution()

  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return <StatusPanel type="empty" />

  const total = data.rooms.reduce((a, b) => a + b.count, 0)
  const sorted = [...data.rooms].sort((a, b) => b.count - a.count)
  const topColors = ['var(--accent)', 'var(--color-success)', 'var(--color-warning)', 'var(--color-chart-7)', 'var(--color-pending)', 'var(--color-chart-1)', 'var(--color-chart-5)', 'var(--color-chart-4)']
  const barColors = sorted.map((_, i) => topColors[i] || 'var(--accent)')
  const dataWithColors = data.rooms.map((r) => {
    const idx = sorted.findIndex((s) => s.name === r.name)
    return { ...r, color: barColors[idx] }
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1, minHeight: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <ChartLabel>功能室分布</ChartLabel>
        <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
          共 <b style={{ color: 'var(--accent)' }}>{total}</b> 间
        </span>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <BarChart
          data={dataWithColors.map((r) => ({ name: r.name, value: r.count }))}
          colors={dataWithColors.map((r) => r.color)}
          height={220}
          gridLeft="22%"
          gridBottom="10%"
          showLabel
        />
      </div>
    </div>
  )
}
