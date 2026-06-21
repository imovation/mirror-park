import { useCalendarData } from '@/api/queries/admin'
import ScrollList from '@/components/ui/ScrollList'
import StatusPanel from '@/components/ui/StatusPanel'

const TYPE_COLORS: Record<string, string> = {
  '会议': 'var(--accent)',
  '考试': 'var(--color-danger)',
  '活动': 'var(--color-warning)',
}

export default function SchoolCalendar() {
  const { data, isLoading, error } = useCalendarData()
  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return <StatusPanel type="empty" />

  const allItems = [
    ...data.thisWeek.map(e => ({
      id: `week-${e.date}`,
      content: (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: TYPE_COLORS[e.type] || 'var(--accent)', boxShadow: '0 0 8px rgba(var(--accent-rgb), 0.5)', flexShrink: 0 }} />
          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', minWidth: 56 }}>{e.date}</span>
          <span style={{ fontSize: 'var(--font-size-xs)', color: TYPE_COLORS[e.type] || 'var(--accent)', minWidth: 28, textAlign: 'center' }}>{e.type}</span>
          <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>{e.event}</span>
        </div>
      ),
    })),
    ...data.upcomingEvents.map(e => ({
      id: `upcoming-${e.date}`,
      content: (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-success)', boxShadow: '0 0 8px rgba(var(--color-success-rgb), 0.5)', flexShrink: 0 }} />
          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', minWidth: 56 }}>{e.date}</span>
          <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>{e.event}</span>
        </div>
      ),
    })),
    ...data.holidays.map(e => ({
      id: `holiday-${e.date}`,
      content: (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-pending)', boxShadow: '0 0 8px rgba(var(--color-warning-rgb), 0.5)', flexShrink: 0 }} />
          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', minWidth: 56 }}>{e.date}</span>
          <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-pending)' }}>{e.event}</span>
        </div>
      ),
    })),
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1, minHeight: 0 }}>
      <div style={{ display: 'flex', gap: 12, flexShrink: 0 }}>
        <div style={{ flex: 1, background: 'var(--panel-bg)', border: '1px solid var(--border-light)', borderRadius: 6, padding: '6px 10px', textAlign: 'center' }}>
          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>本月事件</div>
          <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, color: 'var(--accent)' }}>11<span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', fontWeight: 400, marginLeft: 2 }}>项</span></div>
        </div>
        <div style={{ flex: 1, background: 'var(--panel-bg)', border: '1px solid var(--border-light)', borderRadius: 6, padding: '6px 10px', textAlign: 'center' }}>
          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>今日事件</div>
          <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, color: 'var(--color-warning)' }}>1<span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', fontWeight: 400, marginLeft: 2 }}>项</span></div>
        </div>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)', boxShadow: '0 0 4px rgba(var(--accent-rgb), 0.6)' }} />
          会议
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-danger)', boxShadow: '0 0 4px rgba(var(--color-danger-rgb), 0.6)' }} />
          考试
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-warning)', boxShadow: '0 0 4px rgba(var(--color-warning-rgb), 0.6)' }} />
          活动
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-success)', boxShadow: '0 0 4px rgba(var(--color-success-rgb), 0.6)' }} />
          近期事件
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-pending)', boxShadow: '0 0 4px rgba(var(--color-warning-rgb), 0.6)' }} />
          假期
        </span>
      </div>
      <ScrollList items={allItems} maxHeight={220} />
    </div>
  )
}
