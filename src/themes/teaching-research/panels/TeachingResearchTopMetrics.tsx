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
    <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
      <TopMetricsCard icon="library" label="资源总量" value={formatNumber(stats.totalResources)} />
      <TopMetricsCard icon="file" label="课例成果" value={topics?.lessonCases?.toLocaleString() ?? '-'} />
      <TopMetricsCard icon="flask" label="在研课题" value={topics?.ongoingTopics?.toLocaleString() ?? '-'} />
      <TopMetricsCard icon="person" label="名师工作室" value={studios?.studios?.length?.toString() ?? '-'} />
      <TopMetricsCard icon="clock" label="近期更新" value={stats.recentUpdates?.toString() ?? '-'} />
    </div>
  )
}
