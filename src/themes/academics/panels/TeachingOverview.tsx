import { useAcademicsOverview } from '@/api/queries/academics'
import NumberFlip from '@/components/ui/NumberFlip'
import StatusPanel from '@/components/ui/StatusPanel'

export default function TeachingOverview() {
  const { data, isLoading, error } = useAcademicsOverview()
  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return <StatusPanel type="empty" />
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, flex: 1, minHeight: 0, overflow: 'auto' }}>
      <NumberFlip label="今日课程" value={data.todayCourses} unit="节" />
      <NumberFlip label="正在上课" value={data.ongoingCourses} unit="节" color="#00c853" />
      <NumberFlip label="教室总数" value={data.totalClassrooms} unit="间" />
      <NumberFlip label="教室使用率" value={Math.round(data.usageRate * 100)} unit="%" color="var(--color-warning)" />
    </div>
  )
}
