import { useAdminOverview, useMeetingData } from '@/api/queries/admin'
import TopMetricsCard from '@/components/ui/TopMetricsCard'
import { formatNumber } from '@/utils/format'

export default function AdminTopMetrics() {
  const { data } = useAdminOverview()
  const { data: meetings } = useMeetingData()

  if (!data) return null

  return (
    <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
      <TopMetricsCard icon="department" label="部门数量" value={formatNumber(data.departmentCount)} />
      <TopMetricsCard icon="teacher" label="教职工总数" value={formatNumber(data.staffCount)} />
      <TopMetricsCard icon="attendance" label="今日出勤率" value={`${Math.round((data.attendanceRate ?? 0) * 100)}%`} />
      <TopMetricsCard icon="calendar" label="今日会议" value={meetings?.todayCount?.toString() ?? '-'} />
      <TopMetricsCard icon="room" label="功能室数量" value={data.roomCount?.toString() ?? '-'} />
    </div>
  )
}
