import { useMeetingData } from '@/api/queries/admin'
import NumberFlip from '@/components/ui/NumberFlip'
import ScrollList from '@/components/ui/ScrollList'
import StatusPanel from '@/components/ui/StatusPanel'
import ChartLabel from '@/components/ui/ChartLabel'

export default function MeetingManagement() {
  const { data, isLoading, error } = useMeetingData()
  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return <StatusPanel type="empty" />
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
        <NumberFlip label="今日会议" value={data.todayCount} unit="场" color="#4a9eff" />
        <NumberFlip label="本周会议" value={data.weekCount} unit="场" color="#00c853" />
      </div>
      <div>
        <ChartLabel>会议室状态</ChartLabel>
        <div style={{ display: 'flex', gap: 6 }}>
          {data.rooms.map(room => (
            <div
              key={room.name}
              style={{
                flex: 1,
                background: room.status === '使用中' ? 'rgba(255,109,0,0.1)' : 'rgba(0,200,83,0.08)',
                borderRadius: 6,
                padding: '7px 8px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 500 }}>{room.name}</div>
              <div style={{ fontSize: 10, color: room.status === '使用中' ? 'var(--color-warning)' : 'var(--color-success)', marginTop: 2 }}>
                {room.status}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <ChartLabel>即将召开</ChartLabel>
        <ScrollList
          items={data.upcoming.map(m => ({
            id: m.id,
            content: (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{m.title}</span>
                <span style={{ display: 'flex', gap: 8 }}>
                  <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{m.room}</span>
                  <span style={{ fontSize: 10, color: 'var(--accent)' }}>{m.date} {m.time}</span>
                </span>
              </div>
            ),
          }))}
          maxHeight={80}
        />
      </div>
    </div>
  )
}
