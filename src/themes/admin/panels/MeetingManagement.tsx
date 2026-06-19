import { useMeetingData } from '@/api/queries/admin'
import ScrollList from '@/components/ui/ScrollList'
import StatusPanel from '@/components/ui/StatusPanel'
import ChartLabel from '@/components/ui/ChartLabel'

export default function MeetingManagement() {
  const { data, isLoading, error } = useMeetingData()
  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return <StatusPanel type="empty" />
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1, minHeight: 0 }}>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', background: 'rgba(24,144,255,0.08)', border: '1px solid var(--border-light)', borderRadius: 8, padding: '6px 14px', flex: 1 }}>
          <div style={{ fontSize: 'var(--font-size-xxl)', fontWeight: 700, color: '#4a9eff', fontFamily: "'Courier New', monospace" }}>{data.todayCount}</div>
          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>今日会议 / 场</div>
        </div>
        <div style={{ textAlign: 'center', background: 'rgba(82,196,26,0.08)', border: '1px solid var(--border-light)', borderRadius: 8, padding: '6px 14px', flex: 1 }}>
          <div style={{ fontSize: 'var(--font-size-xxl)', fontWeight: 700, color: '#52c41a', fontFamily: "'Courier New', monospace" }}>{data.weekCount}</div>
          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>本周会议 / 场</div>
        </div>
      </div>
      <div>
        <ChartLabel>会议室状态</ChartLabel>
        <div style={{ display: 'flex', gap: 4 }}>
          {data.rooms.map(room => (
            <div
              key={room.name}
              style={{
                flex: 1,
                background: room.status === '使用中' ? 'rgba(255,109,0,0.1)' : 'rgba(0,200,83,0.08)',
                borderRadius: 6,
                padding: '5px 6px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)', fontWeight: 500 }}>{room.name}</div>
              <div style={{ fontSize: 'var(--font-size-2xs)', color: room.status === '使用中' ? 'var(--color-warning)' : 'var(--color-success)', marginTop: 2 }}>
                {room.status}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <ChartLabel>即将召开</ChartLabel>
        <ScrollList
          maxHeight={160}
          items={data.upcoming.slice(0, 5).map(m => ({
            id: m.id,
            content: (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.title}</span>
                <span style={{ display: 'flex', gap: 6, flexShrink: 0, marginLeft: 8 }}>
                  <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', minWidth: 64, textAlign: 'right' }}>{m.room}</span>
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
