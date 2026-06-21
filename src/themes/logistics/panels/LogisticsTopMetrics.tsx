import { useLogisticsLeave, useLogisticsVisitors, useLogisticsCanteen } from '@/api/queries/logistics'
import TopMetricsCard from '@/components/ui/TopMetricsCard'
import { TOP_METRIC_PALETTE } from '@/config/metricColors'
import { formatNumber } from '@/utils/format'

const COLORS = [
  TOP_METRIC_PALETTE.orange,
  TOP_METRIC_PALETTE.cyan,
  TOP_METRIC_PALETTE.purple,
  TOP_METRIC_PALETTE.green,
  TOP_METRIC_PALETTE.lime,
]

export default function LogisticsTopMetrics() {
  const { data: leave } = useLogisticsLeave()
  const { data: visitors } = useLogisticsVisitors()
  const { data: canteen } = useLogisticsCanteen()

  if (!leave && !visitors) return null

  return (
    <div style={{ display: 'flex', gap: 10, justifyContent: 'space-between', width: '100%' }}>
      <TopMetricsCard icon="calendar" label="今日请假" value={leave ? formatNumber(leave.todayTotal) : '-'} valueColor={COLORS[0]} />
      <TopMetricsCard icon="users" label="今日访客" value={visitors ? formatNumber(visitors.todayVisitors) : '-'} valueColor={COLORS[1]} />
      <TopMetricsCard icon="person" label="当前在校访客" value={visitors ? formatNumber(visitors.currentVisitors) : '-'} valueColor={COLORS[2]} />
      <TopMetricsCard icon="food" label="今日就餐" value={canteen ? formatNumber(canteen.todayTotal) : '-'} valueColor={COLORS[3]} />
      <TopMetricsCard icon="check" label="食材抽检" value={canteen ? `${canteen.safetyRecords.filter(r => r.result === '合格').length}/${canteen.safetyRecords.length}` : '-'} valueColor={COLORS[4]} />
    </div>
  )
}
