import { useResourceStats } from '@/api/queries/teachingResearch'
import { useTeacherTopics } from '@/api/queries/teachingResearch'
import { useTeacherStudios } from '@/api/queries/teachingResearch'
import TopMetricsCard from '@/components/ui/TopMetricsCard'
import { formatNumber } from '@/utils/format'

export default function TeachingResearchTopMetrics() {
  const { data: stats } = useResourceStats()
  const { data: topics } = useTeacherTopics()
  const { data: studios } = useTeacherStudios()

  if (!stats) return null

  return (
    <div style={{ display: 'flex', gap: 24, justifyContent: 'center' }}>
      <TopMetricsCard label="资源总量" value={formatNumber(stats.totalResources)} />
      <TopMetricsCard label="课例成果" value={topics?.lessonCases?.toLocaleString() ?? '-'} />
      <TopMetricsCard label="在研课题" value={topics?.ongoingTopics?.toLocaleString() ?? '-'} />
      <TopMetricsCard label="名师工作室" value={studios?.studios?.length?.toString() ?? '-'} />
      <TopMetricsCard label="近期更新" value={stats.recentUpdates?.toString() ?? '-'} />
    </div>
  )
}
