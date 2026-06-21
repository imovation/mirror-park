import { useResourceUpdates } from '@/api/queries/teachingResearch'
import ScrollList from '@/components/ui/ScrollList'
import StatusPanel from '@/components/ui/StatusPanel'

export default function ResourceUpdates() {
  const { data, isLoading, error } = useResourceUpdates()
  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return <StatusPanel type="empty" />
  return (
    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
      <ScrollList
        header="近期更新资源"
        items={data.recentItems.map((item) => ({
          id: item.id,
          content: (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, marginRight: 8 }}>
                {item.name}
              </span>
              <span style={{ display: 'flex', gap: 4, alignItems: 'center', flexShrink: 0 }}>
                <span style={{
                  fontSize: 'var(--font-size-2xs)',
                  color: '#fff',
                  background: 'var(--accent)',
                  padding: '1px 5px',
                  borderRadius: 3,
                  opacity: 0.85,
                  whiteSpace: 'nowrap',
                }}>{item.subject}</span>
                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{item.teacher}</span>
                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{item.time}</span>
              </span>
            </div>
          ),
        }))}
      />
    </div>
  )
}
