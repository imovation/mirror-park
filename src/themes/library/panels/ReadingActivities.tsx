import { useLibraryActivities } from '@/api/queries/library'
import StatusPanel from '@/components/ui/StatusPanel'

const statusColors: Record<string, string> = {
  '进行中': 'var(--accent)',
  '即将开始': 'var(--color-warning)',
  '已结束': 'var(--text-tertiary)',
}

export default function ReadingActivities() {
  const { data, isLoading, error } = useLibraryActivities()
  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return <StatusPanel type="empty" />
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1, minHeight: 0 }}>
      {data.activities.slice(0, 5).map((a) => (
        <div
          key={a.id}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'rgba(74,158,255,0.05)',
            border: '1px solid var(--border-light)',
            borderRadius: 6,
            padding: '8px 10px',
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 500, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.title}</div>
            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>{a.date}</div>
          </div>
          <span style={{
            fontSize: 'var(--font-size-xs)',
            fontWeight: 500,
            padding: '2px 8px',
            borderRadius: 4,
            background: 'rgba(74,158,255,0.1)',
            color: statusColors[a.status] || 'var(--accent)',
            flexShrink: 0,
            marginLeft: 8,
          }}>{a.status}</span>
        </div>
      ))}
    </div>
  )
}
