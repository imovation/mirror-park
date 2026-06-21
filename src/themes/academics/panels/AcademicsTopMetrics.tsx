import { useAcademicsOverview } from '@/api/queries/academics'
import { useClassData } from '@/api/queries/academics'
import TopMetricsCard from '@/components/ui/TopMetricsCard'
import { formatNumber } from '@/utils/format'

export default function AcademicsTopMetrics() {
  const { data: overview } = useAcademicsOverview()
  const { data: classes } = useClassData()

  if (!overview) return null

  return (
    <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
      <TopMetricsCard icon="calendar" label="今日课程" value={formatNumber(overview.todayCourses)} />
      <TopMetricsCard icon="briefcase" label="正在上课" value={formatNumber(overview.ongoingCourses)} />
      <TopMetricsCard icon="room" label="教室总数" value={formatNumber(overview.totalClassrooms)} />
      <TopMetricsCard icon="chart" label="教室使用率" value={`${Math.round((overview.usageRate ?? 0) * 100)}%`} />
      <TopMetricsCard icon="group" label="班级总数" value={classes?.totalClasses?.toString() ?? '-'} />
    </div>
  )
}
