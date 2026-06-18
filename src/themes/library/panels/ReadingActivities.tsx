import { useLibraryActivities } from '@/api/queries/library'
import CardCarousel from '@/components/ui/CardCarousel'
import StatusPanel from '@/components/ui/StatusPanel'

const statusColors: Record<string, string> = {
  '进行中': 'var(--accent)',
  '即将开始': 'var(--color-pending)',
}

export default function ReadingActivities() {
  const { data, isLoading, error } = useLibraryActivities()
  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return <StatusPanel type="empty" />
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1, minHeight: 0, overflow: 'auto' }}>
      <CardCarousel
        items={data.activities.map((a) => ({
          id: a.id,
          title: a.title,
          subtitle: a.date,
          tag: a.status,
          tagColor: statusColors[a.status],
        }))}
      />
    </div>
  )
}
