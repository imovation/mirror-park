import { useResourceStats } from '@/api/queries/teachingResearch'
import NumberFlip from '@/components/ui/NumberFlip'

export default function ResourceStatistics() {
  const { data, isLoading, error } = useResourceStats()
  if (isLoading) return <div style={{ color: '#6b7280', fontSize: '0.75rem' }}>加载中...</div>
  if (error) return <div style={{ color: '#ef4444', fontSize: '0.75rem' }}>数据加载失败</div>
  if (!data) return null
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
      <NumberFlip label="资源总量" value={data.totalResources} unit="份" color="#4a9eff" />
      <NumberFlip label="云试题数" value={data.cloudQuestions} unit="道" color="#00c853" />
      <NumberFlip label="云资源数" value={data.cloudResources} unit="份" color="#ff6d00" />
      <NumberFlip label="近期更新数" value={data.recentUpdates} unit="次" color="#aa00ff" />
    </div>
  )
}
