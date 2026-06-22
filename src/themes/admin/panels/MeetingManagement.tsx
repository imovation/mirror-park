import { useMeetingData } from '@/api/queries/admin'
import StatusPanel from '@/components/ui/StatusPanel'
import ChartLabel from '@/components/ui/ChartLabel'

export default function MeetingManagement() {
  const { data, isLoading, error } = useMeetingData()
  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return <StatusPanel type="empty" />

  const inUseCount = data.rooms.filter((r) => r.status === '使用中').length
  const availableCount = data.rooms.filter((r) => r.status === '空闲').length
  const usageRate = data.rooms.length > 0 ? Math.round((inUseCount / data.rooms.length) * 100) : 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1, minHeight: 0 }}>
      <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexShrink: 0 }}>
        <div style={{ textAlign: 'center', background: 'var(--panel-bg)', border: '1px solid var(--border-light)', borderRadius: 8, padding: '8px 12px', flex: 1 }}>
          <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, color: 'var(--accent)', fontFamily: "'Courier New', monospace", lineHeight: 1.1 }}>{data.todayCount}</div>
          <div style={{ fontSize: 'var(--font-size-2xs)', color: 'var(--text-muted)', marginTop: 2 }}>今日 / 场</div>
        </div>
        <div style={{ textAlign: 'center', background: 'var(--panel-bg)', border: '1px solid var(--border-light)', borderRadius: 8, padding: '8px 12px', flex: 1 }}>
          <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, color: 'var(--color-success)', fontFamily: "'Courier New', monospace", lineHeight: 1.1 }}>{data.weekCount}</div>
          <div style={{ fontSize: 'var(--font-size-2xs)', color: 'var(--text-muted)', marginTop: 2 }}>本周 / 场</div>
        </div>
        <div style={{ textAlign: 'center', background: 'var(--panel-bg)', border: '1px solid var(--border-light)', borderRadius: 8, padding: '8px 12px', flex: 1 }}>
          <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, color: 'var(--color-warning)', fontFamily: "'Courier New', monospace", lineHeight: 1.1 }}>{usageRate}%</div>
          <div style={{ fontSize: 'var(--font-size-2xs)', color: 'var(--text-muted)', marginTop: 2 }}>使用率</div>
        </div>
      </div>
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
          <ChartLabel>会议室状态</ChartLabel>
          <span style={{ fontSize: 'var(--font-size-2xs)', color: 'var(--text-muted)' }}>
            <span style={{ color: 'var(--color-warning)' }}>● {inUseCount} 用</span>
            <span style={{ marginLeft: 8, color: 'var(--color-success)' }}>● {availableCount} 闲</span>
          </span>
        </div>
        <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, alignContent: 'start' }}>
          {data.rooms.map((room) => (
            <div
              key={room.name}
              style={{
                background: 'var(--panel-bg)',
                border: room.status === '使用中' ? '1px solid var(--color-warning)' : '1px solid var(--color-success)',
                borderRadius: 4,
                padding: '5px 8px',
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
              }}
            >
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-primary)', fontWeight: 500 }}>{room.name}</span>
              <span
                style={{
                  fontSize: 'var(--font-size-2xs)',
                  color: room.status === '使用中' ? 'var(--color-warning)' : 'var(--color-success)',
                  fontWeight: 600,
                }}
              >
                {room.status === '使用中' ? '🔴' : '🟢'} {room.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
