import { useCalendarData } from '@/api/queries/admin'
import ScrollList from '@/components/ui/ScrollList'
import StatusPanel from '@/components/ui/StatusPanel'

const TYPE_COLORS: Record<string, string> = {
  '会议': '#4a9eff',
  '考试': '#ff1744',
  '活动': '#ff6d00',
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
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: TYPE_COLORS[e.type] || '#4a9eff', flexShrink: 0 }} />
          <span style={{ fontSize: 10, color: 'var(--text-muted)', minWidth: 56 }}>{e.date}</span>
          <span style={{ fontSize: 10, color: TYPE_COLORS[e.type] || 'var(--accent)', minWidth: 28, textAlign: 'center' }}>{e.type}</span>
          <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{e.event}</span>
        </div>
      ),
    })),
    ...data.upcomingEvents.map(e => ({
      id: `upcoming-${e.date}`,
      content: (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#00c853', flexShrink: 0 }} />
          <span style={{ fontSize: 10, color: 'var(--text-muted)', minWidth: 56 }}>{e.date}</span>
          <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{e.event}</span>
        </div>
      ),
    })),
    ...data.holidays.map(e => ({
      id: `holiday-${e.date}`,
      content: (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#ffc107', flexShrink: 0 }} />
          <span style={{ fontSize: 10, color: 'var(--text-muted)', minWidth: 56 }}>{e.date}</span>
          <span style={{ fontSize: 12, color: 'var(--color-pending)' }}>{e.event}</span>
        </div>
      ),
    })),
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1, minHeight: 0, overflow: 'auto' }}>
      <ScrollList items={allItems} />
    </div>
  )
}
