import { useAdminOverview, useMeetingData } from '@/api/queries/admin'
import TopMetricsCard from '@/components/ui/TopMetricsCard'
import { TOP_METRIC_PALETTE } from '@/config/metricColors'
import { formatNumber } from '@/utils/format'

const COLORS = [
  TOP_METRIC_PALETTE.blue,
  TOP_METRIC_PALETTE.purple,
  TOP_METRIC_PALETTE.green,
  TOP_METRIC_PALETTE.cyan,
  TOP_METRIC_PALETTE.orange,
]

export default function AdminTopMetrics() {
  const { data } = useAdminOverview()
  const { data: meetings } = useMeetingData()

  if (!data) return null

  return (
    <div style={{ display: 'flex', gap: 10, justifyContent: 'space-between', width: '100%' }}>
      <TopMetricsCard icon="department" label="部门数量" value={formatNumber(data.departmentCount)} valueColor={COLORS[0]} />
      <TopMetricsCard icon="teacher" label="教职工总数" value={formatNumber(data.staffCount)} valueColor={COLORS[1]} />
      <TopMetricsCard icon="attendance" label="今日出勤率" value={`${Math.round((data.attendanceRate ?? 0) * 100)}%`} valueColor={COLORS[2]} />
      <TopMetricsCard icon="calendar" label="今日会议" value={meetings?.todayCount?.toString() ?? '-'} valueColor={COLORS[3]} />
      <TopMetricsCard icon="room" label="功能室数量" value={data.roomCount?.toString() ?? '-'} valueColor={COLORS[4]} />
    </div>
  )
}
