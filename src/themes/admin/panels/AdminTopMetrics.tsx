import { useAdminOverview, useMeetingData } from '@/api/queries/admin'
import TopMetricsCard from '@/components/ui/TopMetricsCard'
import { getMetricShades } from '@/config/metricColors'
import { formatNumber } from '@/utils/format'

const SHADES = getMetricShades()

export default function AdminTopMetrics() {
  const { data } = useAdminOverview()
  const { data: meetings } = useMeetingData()

  if (!data) return null

  return (
    <div style={{ display: 'flex', gap: 10, justifyContent: 'space-between', width: '100%' }}>
      <TopMetricsCard icon="department" label="部门数量" value={formatNumber(data.departmentCount)} valueColor={SHADES[0]} />
      <TopMetricsCard icon="teacher" label="教职工总数" value={formatNumber(data.staffCount)} valueColor={SHADES[1]} />
      <TopMetricsCard icon="attendance" label="今日出勤率" value={`${Math.round((data.attendanceRate ?? 0) * 100)}%`} valueColor={SHADES[2]} />
      <TopMetricsCard icon="calendar" label="今日会议" value={meetings?.todayCount?.toString() ?? '-'} valueColor={SHADES[3]} />
      <TopMetricsCard icon="room" label="功能室数量" value={data.roomCount?.toString() ?? '-'} valueColor={SHADES[4]} />
    </div>
  )
}
