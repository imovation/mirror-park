import { useCalendarData } from '@/api/queries/admin'
import ScrollList from '@/components/ui/ScrollList'

const TYPE_COLORS: Record<string, string> = {
  '会议': '#4a9eff',
  '考试': '#ff1744',
  '活动': '#ff6d00',
}

export default function SchoolCalendar() {
  const { data, isLoading, error } = useCalendarData()
  if (isLoading) return <div style={{ color: '#6b7280', fontSize: '0.75rem' }}>加载中...</div>
  if (error) return <div style={{ color: '#ef4444', fontSize: '0.75rem' }}>数据加载失败</div>
  if (!data) return null

  const allItems = [
    ...data.thisWeek.map(e => ({
      id: `week-${e.date}`,
      content: (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: TYPE_COLORS[e.type] || '#4a9eff', flexShrink: 0 }} />
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', minWidth: 56 }}>{e.date}</span>
          <span style={{ fontSize: 10, color: TYPE_COLORS[e.type] || '#4a9eff', minWidth: 28, textAlign: 'center' }}>{e.type}</span>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)' }}>{e.event}</span>
        </div>
      ),
    })),
    ...data.upcomingEvents.map(e => ({
      id: `upcoming-${e.date}`,
      content: (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#00c853', flexShrink: 0 }} />
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', minWidth: 56 }}>{e.date}</span>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)' }}>{e.event}</span>
        </div>
      ),
    })),
    ...data.holidays.map(e => ({
      id: `holiday-${e.date}`,
      content: (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#ffc107', flexShrink: 0 }} />
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', minWidth: 56 }}>{e.date}</span>
          <span style={{ fontSize: 12, color: '#ffc107' }}>{e.event}</span>
        </div>
      ),
    })),
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <ScrollList items={allItems} maxHeight={200} />
    </div>
  )
}
