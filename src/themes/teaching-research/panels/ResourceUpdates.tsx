import { useResourceUpdates } from '@/api/queries/teachingResearch'
import ScrollList from '@/components/ui/ScrollList'
import StatusPanel from '@/components/ui/StatusPanel'

export default function ResourceUpdates() {
  const { data, isLoading, error } = useResourceUpdates()
  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return <StatusPanel type="empty" />
  return (
    <ScrollList
      header="近期更新资源"
      items={data.recentItems.map((item) => ({
        id: item.id,
        content: (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, marginRight: 8, maxWidth: 140 }}>
              {item.name}
            </span>
            <span style={{ display: 'flex', gap: 4, alignItems: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: 9, color: '#fff', background: 'var(--accent)', padding: '1px 5px', borderRadius: 3, opacity: 0.8 }}>{item.subject}</span>
              <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{item.teacher}</span>
              <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{item.time}</span>
            </span>
          </div>
        ),
      }))}
      maxHeight={200}
    />
  )
}
