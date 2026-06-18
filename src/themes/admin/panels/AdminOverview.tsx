import { useAdminOverview } from '@/api/queries/admin'
import CompactStatsRow from '@/components/ui/CompactStatsRow'
import StatusPanel from '@/components/ui/StatusPanel'

export default function AdminOverview() {
  const { data, isLoading, error } = useAdminOverview()
  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return <StatusPanel type="empty" />

  return (
    <CompactStatsRow items={[
      { id: 'dept', label: '部门数量', value: data.departmentCount, unit: '个', color: 'var(--accent)' },
      { id: 'staff', label: '教职工总数', value: data.staffCount, unit: '人' },
      { id: 'rate', label: '今日出勤率', value: Math.round(data.attendanceRate * 100), unit: '%', color: 'var(--color-success)' },
      { id: 'room', label: '功能室数量', value: data.roomCount, unit: '间', color: 'var(--color-warning)' }
    ]} />
  )
}
