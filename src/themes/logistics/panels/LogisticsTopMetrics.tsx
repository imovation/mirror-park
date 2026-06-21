import { useLogisticsLeave, useLogisticsVisitors, useLogisticsCanteen } from '@/api/queries/logistics'
import TopMetricsCard from '@/components/ui/TopMetricsCard'
import { formatNumber } from '@/utils/format'

export default function LogisticsTopMetrics() {
  const { data: leave } = useLogisticsLeave()
  const { data: visitors } = useLogisticsVisitors()
  const { data: canteen } = useLogisticsCanteen()

  if (!leave && !visitors) return null

  return (
    <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
      <TopMetricsCard icon="calendar" label="今日请假" value={leave ? formatNumber(leave.todayTotal) : '-'} />
      <TopMetricsCard icon="users" label="今日访客" value={visitors ? formatNumber(visitors.todayVisitors) : '-'} />
      <TopMetricsCard icon="person" label="当前在校访客" value={visitors ? formatNumber(visitors.currentVisitors) : '-'} />
      <TopMetricsCard icon="food" label="今日就餐" value={canteen ? formatNumber(canteen.todayTotal) : '-'} />
      <TopMetricsCard icon="check" label="食材抽检" value={canteen ? `${canteen.safetyRecords.filter(r => r.result === '合格').length}/${canteen.safetyRecords.length}` : '-'} />
    </div>
  )
}
