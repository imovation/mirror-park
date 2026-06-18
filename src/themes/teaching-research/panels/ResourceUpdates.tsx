import { useResourceUpdates } from '@/api/queries/teachingResearch'
import ScrollList from '@/components/ui/ScrollList'
import StatusPanel from '@/components/ui/StatusPanel'

export default function ResourceUpdates() {
  const { data, isLoading, error } = useResourceUpdates()
  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return <StatusPanel type="empty" />
  return (
    <div style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
      <ScrollList
        items={data.recentItems.map((item) => ({
          id: item.id,
          content: (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{item.name}</span>
              <span style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ fontSize: 10, color: 'var(--accent)' }}>{item.subject}</span>
                <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{item.teacher}</span>
                <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{item.time}</span>
              </span>
            </div>
          ),
        }))}
      />
    </div>
  )
}
