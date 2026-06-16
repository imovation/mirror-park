import { useAcademicsOverview } from '@/api/queries/academics'
import NumberFlip from '@/components/ui/NumberFlip'

export default function TeachingOverview() {
  const { data, isLoading, error } = useAcademicsOverview()
  if (isLoading) return <div style={{ color: '#6b7280', fontSize: '0.75rem' }}>加载中...</div>
  if (error) return <div style={{ color: '#ef4444', fontSize: '0.75rem' }}>数据加载失败</div>
  if (!data) return null
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
      <NumberFlip label="今日课程" value={data.todayCourses} unit="节" />
      <NumberFlip label="正在上课" value={data.ongoingCourses} unit="节" color="#00c853" />
      <NumberFlip label="教室总数" value={data.totalClassrooms} unit="间" />
      <NumberFlip label="教室使用率" value={Math.round(data.usageRate * 100)} unit="%" color="#ff6d00" />
    </div>
  )
}
