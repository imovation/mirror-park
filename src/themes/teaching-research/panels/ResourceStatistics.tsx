import { useResourceStats } from '@/api/queries/teachingResearch'
import NumberFlip from '@/components/ui/NumberFlip'
import StatusPanel from '@/components/ui/StatusPanel'

export default function ResourceStatistics() {
  const { data, isLoading, error } = useResourceStats()
  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return <StatusPanel type="empty" />
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
      <NumberFlip label="资源总量" value={data.totalResources} unit="份" color="#4a9eff" />
      <NumberFlip label="云试题数" value={data.cloudQuestions} unit="道" color="#00c853" />
      <NumberFlip label="云资源数" value={data.cloudResources} unit="份" color="#ff6d00" />
      <NumberFlip label="近期更新数" value={data.recentUpdates} unit="次" color="#aa00ff" />
    </div>
  )
}
