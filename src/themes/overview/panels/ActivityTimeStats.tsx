import { useActivity } from '@/api/queries/overview'
import BarChart from '@/components/charts/BarChart'
import StatusPanel from '@/components/ui/StatusPanel'
import ChartLabel from '@/components/ui/ChartLabel'

export default function ActivityTimeStats() {
  const { data, isLoading, error } = useActivity()

  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return <StatusPanel type="empty" />

  const chartData = data.hours.map((h, i) => ({ name: h, value: data.values[i] }))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <ChartLabel>各时段活跃度</ChartLabel>
      <div style={{ flex: 1 }}>
        <BarChart data={chartData} height={200} horizontal={false} color="#ff6d00" />
      </div>
    </div>
  )
}
