import { useResourceStats } from '@/api/queries/teachingResearch'
import CompactStatsRow from '@/components/ui/CompactStatsRow'
import StatusPanel from '@/components/ui/StatusPanel'

export default function ResourceStatistics() {
  const { data, isLoading, error } = useResourceStats()
  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return <StatusPanel type="empty" />

  return (
    <CompactStatsRow items={[
      { id: 'total', label: '资源总量', value: data.totalResources, unit: '份', color: 'var(--accent)' },
      { id: 'q', label: '云试题数', value: data.cloudQuestions, unit: '道', color: 'var(--color-warning)' },
      { id: 'r', label: '云资源数', value: data.cloudResources, unit: '份' },
      { id: 'u', label: '近期更新', value: data.recentUpdates, unit: '次', color: 'var(--color-success)' }
    ]} />
  )
}
