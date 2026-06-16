import { useLibraryActivities } from '@/api/queries/library'
import CardCarousel from '@/components/ui/CardCarousel'
import StatusPanel from '@/components/ui/StatusPanel'

const statusColors: Record<string, string> = {
  '进行中': '#4a9eff',
  '即将开始': '#ffc107',
}

export default function ReadingActivities() {
  const { data, isLoading, error } = useLibraryActivities()
  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
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
