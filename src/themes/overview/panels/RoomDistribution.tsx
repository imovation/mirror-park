import { useRoomDistribution } from '@/api/queries/overview'
import { CHART_PALETTE } from '@/config/chartTheme'
import BarChart from '@/components/charts/BarChart'
import StatusPanel from '@/components/ui/StatusPanel'
import ChartLabel from '@/components/ui/ChartLabel'

export default function RoomDistribution() {
  const { data, isLoading, error } = useRoomDistribution()

  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return <StatusPanel type="empty" />

  const total = data.rooms.reduce((a, b) => a + b.count, 0)

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
          data={data.rooms.map((r) => ({ name: r.name, value: r.count }))}
          colors={CHART_PALETTE.dark}
            height={165}
          gridLeft="22%"
          gridBottom="10%"
          showLabel
          barWidth="40%"
        />
      </div>
    </div>
  )
}
