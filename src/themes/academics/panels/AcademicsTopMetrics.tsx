import { useAcademicsOverview } from '@/api/queries/academics'
import { useClassData } from '@/api/queries/academics'
import TopMetricsCard from '@/components/ui/TopMetricsCard'
import { getMetricShades } from '@/config/metricColors'
import { formatNumber } from '@/utils/format'

const SHADES = getMetricShades()

export default function AcademicsTopMetrics() {
  const { data: overview } = useAcademicsOverview()
  const { data: classes } = useClassData()

  if (!overview) return null

  return (
    <div style={{ display: 'flex', gap: 10, justifyContent: 'space-between', width: '100%' }}>
      <TopMetricsCard icon="calendar" label="今日课程" value={formatNumber(overview.todayCourses)} valueColor={SHADES[0]} />
      <TopMetricsCard icon="briefcase" label="正在上课" value={formatNumber(overview.ongoingCourses)} valueColor={SHADES[1]} />
      <TopMetricsCard icon="room" label="教室总数" value={formatNumber(overview.totalClassrooms)} valueColor={SHADES[2]} />
      <TopMetricsCard icon="chart" label="教室使用率" value={`${Math.round((overview.usageRate ?? 0) * 100)}%`} valueColor={SHADES[3]} />
      <TopMetricsCard icon="group" label="班级总数" value={classes?.totalClasses?.toString() ?? '-'} valueColor={SHADES[4]} />
    </div>
  )
}
