import { useActivity } from '@/api/queries/overview'
import BarChart from '@/components/charts/BarChart'
import NumberFlip from '@/components/ui/NumberFlip'
import StatusPanel from '@/components/ui/StatusPanel'
import ChartLabel from '@/components/ui/ChartLabel'

export default function ActivityTimeStats() {
  const { data, isLoading, error } = useActivity()

  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return <StatusPanel type="empty" />

  const chartData = data.hours.map((h, i) => ({ name: h, value: data.values[i] }))
  const peakValue = Math.max(...data.values)
  const peakIndex = data.values.indexOf(peakValue)
  const peakHour = data.hours[peakIndex] ?? '--'
  const avgValue = Math.round(data.values.reduce((a, b) => a + b, 0) / data.values.length)
  const totalValue = data.values.reduce((a, b) => a + b, 0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1, minHeight: 0 }}>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexShrink: 0, alignItems: 'center' }}>
        <NumberFlip label="峰值人数" value={peakValue} unit="人" color="var(--color-warning)" />
        <NumberFlip label="平均活跃" value={avgValue} unit="人" color="var(--color-success)" />
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', marginBottom: 4 }}>峰值时段</div>
          <div style={{ fontSize: 'var(--font-size-xxl)', fontWeight: 700, color: 'var(--accent)', fontFamily: 'monospace' }}>{peakHour}</div>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <ChartLabel>各时段活跃度</ChartLabel>
          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
            今日累计 <b style={{ color: 'var(--text-primary)' }}>{totalValue.toLocaleString()}</b> 人次
          </span>
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <BarChart data={chartData} height={200} horizontal={false} barWidth="30%" />
        </div>
      </div>
    </div>
  )
}
