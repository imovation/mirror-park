import { useLibraryVisitors } from '@/api/queries/library'
import NumberFlip from '@/components/ui/NumberFlip'
import BarChart from '@/components/charts/BarChart'
import StatusPanel from '@/components/ui/StatusPanel'
import ChartLabel from '@/components/ui/ChartLabel'

export default function VisitorStats() {
  const { data, isLoading, error } = useLibraryVisitors()
  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return <StatusPanel type="empty" />
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
        <NumberFlip label="今日入馆" value={data.todayVisitors} unit="人" color="#00c853" />
        <NumberFlip label="实时在馆" value={data.currentVisitors} unit="人" color="#4a9eff" />
      </div>
      <div style={{ flex: 1 }}>
        <ChartLabel>入馆时段分布</ChartLabel>
        <BarChart
          data={data.hourlyDistribution.hours.map((h, i) => ({ name: h, value: data.hourlyDistribution.values[i] }))}
          height={130}
          horizontal={false}
        />
      </div>
    </div>
  )
}
