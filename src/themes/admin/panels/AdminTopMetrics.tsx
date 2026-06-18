import { useAdminOverview } from '@/api/queries/admin'
import TopMetricsCard from '@/components/ui/TopMetricsCard'

export default function AdminTopMetrics() {
  const { data } = useAdminOverview()

  if (!data) return null

  return (
    <div style={{ display: 'flex', gap: 24, justifyContent: 'center' }}>
      <TopMetricsCard label="部门数量" value={data.departmentCount?.toLocaleString() ?? '-'} />
      <TopMetricsCard label="教职工总数" value={data.staffCount?.toLocaleString() ?? '-'} />
      <TopMetricsCard label="今日出勤率" value={`${Math.round(data.attendanceRate * 100)}%`} />
      <TopMetricsCard label="功能室数量" value={data.roomCount?.toString() ?? '-'} />
    </div>
  )
}
