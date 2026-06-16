import { useActivity } from '@/api/queries/overview'
import LineChart from '@/components/charts/LineChart'
import StatusPanel from '@/components/ui/StatusPanel'

export default function ActivityHeatmap() {
  const { data, isLoading, error } = useActivity()

  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>各时段校园人流变化</div>
      <div style={{ flex: 1 }}>
        <LineChart
          xData={data.hours}
          series={[{ name: '人流量', data: data.values, color: '#00c853' }]}
          height={220}
          area
          smooth
        />
      </div>
    </div>
  )
}
