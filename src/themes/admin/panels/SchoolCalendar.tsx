import { useCalendarData } from '@/api/queries/admin'
import ScrollList from '@/components/ui/ScrollList'
import StatusPanel from '@/components/ui/StatusPanel'

const TYPE_COLORS: Record<string, string> = {
  '会议': '#1890ff',
  '考试': '#f5222d',
  '活动': '#fa8c16',
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
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: TYPE_COLORS[e.type] || '#1890ff', boxShadow: '0 0 8px rgba(24,144,255,0.5)', flexShrink: 0 }} />
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
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#52c41a', boxShadow: '0 0 8px rgba(82,196,26,0.5)', flexShrink: 0 }} />
          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', minWidth: 56 }}>{e.date}</span>
          <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>{e.event}</span>
        </div>
      ),
    })),
    ...data.holidays.map(e => ({
      id: `holiday-${e.date}`,
      content: (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#faad14', boxShadow: '0 0 8px rgba(250,173,20,0.5)', flexShrink: 0 }} />
          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', minWidth: 56 }}>{e.date}</span>
          <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-pending)' }}>{e.event}</span>
        </div>
      ),
    })),
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1, minHeight: 0 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#1890ff', boxShadow: '0 0 4px rgba(24,144,255,0.6)' }} />
          会议
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#f5222d', boxShadow: '0 0 4px rgba(245,34,45,0.6)' }} />
          考试
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#fa8c16', boxShadow: '0 0 4px rgba(250,140,22,0.6)' }} />
          活动
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#52c41a', boxShadow: '0 0 4px rgba(82,196,26,0.6)' }} />
          近期事件
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#faad14', boxShadow: '0 0 4px rgba(250,173,20,0.6)' }} />
          假期
        </span>
      </div>
      <ScrollList items={allItems} maxHeight={220} />
    </div>
  )
}
