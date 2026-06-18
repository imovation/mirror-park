import { useRecentActivity } from '@/api/queries/overview'
import ScrollList from '@/components/ui/ScrollList'
import StatusPanel from '@/components/ui/StatusPanel'

export default function RecentActivity() {
  const { data, isLoading, error } = useRecentActivity()

  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data || data.length === 0) return <StatusPanel type="empty" />

  const items = data.map((e) => ({
    id: e.id,
    content: (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>{e.title}</span>
        <span style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{e.time}</span>
          <span style={{
            fontSize: 10,
            color: e.status === '进行中'
              ? 'var(--accent)'
              : e.status === '已完成'
                ? 'var(--color-success)'
                : 'var(--text-tertiary)',
          }}>
            {e.status}
          </span>
        </span>
      </div>
    ),
  }))

  return <ScrollList items={items} maxHeight={200} />
}
