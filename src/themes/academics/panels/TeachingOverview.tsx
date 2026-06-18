import { useAcademicsOverview } from '@/api/queries/academics'
import CompactStatsRow from '@/components/ui/CompactStatsRow'
import StatusPanel from '@/components/ui/StatusPanel'

export default function TeachingOverview() {
  const { data, isLoading, error } = useAcademicsOverview()
  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return <StatusPanel type="empty" />

  return (
    <CompactStatsRow items={[
      { id: 'today', label: '今日课程', value: data.todayCourses, unit: '节', color: 'var(--accent)' },
      { id: 'now', label: '正在上课', value: data.activeCourses, unit: '节', color: 'var(--color-success)' },
      { id: 'rooms', label: '教室总数', value: data.totalClassrooms, unit: '间' },
      { id: 'rate', label: '教室使用率', value: Math.round(data.usageRate * 100), unit: '%', color: 'var(--color-warning)' }
    ]} />
  )
}
