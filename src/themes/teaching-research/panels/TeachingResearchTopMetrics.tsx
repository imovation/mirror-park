import { useResourceStats } from '@/api/queries/teachingResearch'
import { useTeacherTopics } from '@/api/queries/teachingResearch'
import { useTeacherStudios } from '@/api/queries/teachingResearch'
import TopMetricsCard from '@/components/ui/TopMetricsCard'
import { TOP_METRIC_PALETTE } from '@/config/metricColors'
import { formatNumber } from '@/utils/format'

const COLORS = [
  TOP_METRIC_PALETTE.purple,
  TOP_METRIC_PALETTE.pink,
  TOP_METRIC_PALETTE.cyan,
  TOP_METRIC_PALETTE.yellow,
  TOP_METRIC_PALETTE.green,
]

export default function TeachingResearchTopMetrics() {
  const { data: stats } = useResourceStats()
  const { data: topics } = useTeacherTopics()
  const { data: studios } = useTeacherStudios()

  if (!stats) return null

  return (
    <div style={{ display: 'flex', gap: 12, justifyContent: 'space-between', width: '100%' }}>
      <TopMetricsCard icon="library" label="资源总量" value={formatNumber(stats.totalResources)} valueColor={COLORS[0]} />
      <TopMetricsCard icon="file" label="课例成果" value={topics?.lessonCases?.toLocaleString() ?? '-'} valueColor={COLORS[1]} />
      <TopMetricsCard icon="flask" label="在研课题" value={topics?.ongoingTopics?.toLocaleString() ?? '-'} valueColor={COLORS[2]} />
      <TopMetricsCard icon="person" label="名师工作室" value={studios?.studios?.length?.toString() ?? '-'} valueColor={COLORS[3]} />
      <TopMetricsCard icon="clock" label="近期更新" value={stats.recentUpdates?.toString() ?? '-'} valueColor={COLORS[4]} />
    </div>
  )
}
