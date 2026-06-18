import { useAcademicsOverview } from '@/api/queries/academics'
import { useClassData } from '@/api/queries/academics'
import TopMetricsCard from '@/components/ui/TopMetricsCard'

export default function AcademicsTopMetrics() {
  const { data: overview } = useAcademicsOverview()
  const { data: classes } = useClassData()

  if (!overview) return null

  return (
    <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap' }}>
      <TopMetricsCard label="今日课程" value={overview.todayCourses?.toString() ?? '-'} />
      <TopMetricsCard label="正在上课" value={overview.ongoingCourses?.toString() ?? '-'} />
      <TopMetricsCard label="教室总数" value={overview.totalClassrooms?.toString() ?? '-'} />
      <TopMetricsCard label="教室使用率" value={`${Math.round(overview.usageRate * 100)}%`} />
      <TopMetricsCard label="班级总数" value={classes?.totalClasses?.toString() ?? '-'} />
    </div>
  )
}
