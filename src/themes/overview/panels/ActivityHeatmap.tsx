import { useActivity } from '@/api/queries/overview'
import LineChart from '@/components/charts/LineChart'
import StatusPanel from '@/components/ui/StatusPanel'
import ChartLabel from '@/components/ui/ChartLabel'

export default function ActivityHeatmap() {
  const { data, isLoading, error } = useActivity()

  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return <StatusPanel type="empty" />

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'auto' }}>
      <ChartLabel>各时段校园人流变化</ChartLabel>
      <div style={{ flex: 1, minHeight: 0 }}>
        <LineChart
          xData={data.hours}
          series={[{ name: '人流量', data: data.values, color: '#00c853' }]}
          height={180}
          area
          smooth
        />
      </div>
    </div>
  )
}
