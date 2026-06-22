import { useMeetingData } from '@/api/queries/admin'
import ScrollList from '@/components/ui/ScrollList'
import StatusPanel from '@/components/ui/StatusPanel'
import ChartLabel from '@/components/ui/ChartLabel'

export default function RecentMeetings() {
  const { data, isLoading, error } = useMeetingData()
  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return <StatusPanel type="empty" />

  const items = [...data.upcoming]
    .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`))
    .slice(0, 6)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1, minHeight: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <ChartLabel>近期会议安排</ChartLabel>
        <span style={{ fontSize: 'var(--font-size-2xs)', color: 'var(--text-muted)' }}>共 {data.upcoming.length} 项 · 未来 7 天</span>
      </div>
      <div style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
        <ScrollList
          items={items.map((m) => ({
            id: m.id,
            content: (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text-primary)' }}>
                  {m.title}
                </span>
                <span style={{ display: 'flex', gap: 6, flexShrink: 0, marginLeft: 8, alignItems: 'center' }}>
                  <span
                    style={{
                      fontSize: 'var(--font-size-2xs)',
                      color: 'var(--text-muted)',
                      background: 'var(--panel-bg)',
                      padding: '0 5px',
                      borderRadius: 3,
                      border: '1px solid var(--border-light)',
                    }}
                  >
                    {m.room}
                  </span>
                  <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--accent)', minWidth: 120, textAlign: 'right' }}>{m.date} {m.time}</span>
                </span>
              </div>
            ),
          }))}
        />
      </div>
    </div>
  )
}
