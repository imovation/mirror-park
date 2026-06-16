import { useLibraryActivities } from '@/api/queries/library'
import CardCarousel from '@/components/ui/CardCarousel'

const statusColors: Record<string, string> = {
  '进行中': '#4a9eff',
  '即将开始': '#ffc107',
}

export default function ReadingActivities() {
  const { data, isLoading, error } = useLibraryActivities()
  if (isLoading) return <div style={{ color: '#6b7280', fontSize: '0.75rem' }}>加载中...</div>
  if (error) return <div style={{ color: '#ef4444', fontSize: '0.75rem' }}>数据加载失败</div>
  if (!data) return null
  return (
    <CardCarousel
      items={data.activities.map((a) => ({
        id: a.id,
        title: a.title,
        subtitle: a.date,
        tag: a.status,
        tagColor: statusColors[a.status],
      }))}
      maxHeight={160}
    />
  )
}
