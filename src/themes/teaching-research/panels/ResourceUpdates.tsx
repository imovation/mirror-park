import { useResourceUpdates } from '@/api/queries/teachingResearch'
import ScrollList from '@/components/ui/ScrollList'
import StatusPanel from '@/components/ui/StatusPanel'

export default function ResourceUpdates() {
  const { data, isLoading, error } = useResourceUpdates()
  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data || data.recentItems.length === 0) return <StatusPanel type="empty" />

  const items = data.recentItems.map(item => ({
    id: item.id,
    content: (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 60px 40px', gap: 8, alignItems: 'center', padding: '4px 0' }}>
        <div style={{ fontSize: 12, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
        <div style={{ fontSize: 10, color: 'var(--text-secondary)' }}>{item.time}</div>
        <div style={{ fontSize: 10, color: 'var(--accent)', textAlign: 'right' }}>{item.teacher}</div>
      </div>
    )
  }))

  return <ScrollList items={items} maxHeight={160} />
}
