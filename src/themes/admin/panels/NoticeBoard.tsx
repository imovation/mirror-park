import { useNoticeData } from '@/api/queries/admin'
import ScrollList from '@/components/ui/ScrollList'
import StatusPanel from '@/components/ui/StatusPanel'

const TYPE_COLORS: Record<string, string> = {
  '行政': '#4a9eff',
  '教学': '#00c853',
  '活动': '#ff6d00',
  '紧急': '#ff1744',
}

export default function NoticeBoard() {
  const { data, isLoading, error } = useNoticeData()
  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return <StatusPanel type="empty" />
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1, minHeight: 0, overflow: 'auto' }}>
      <ScrollList
        items={data.notices.map(n => ({
          id: n.id,
          content: (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{n.title}</span>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 10, color: 'var(--text-muted)', minWidth: 0, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{n.department}</span>
                <span style={{ display: 'flex', gap: 8, flexShrink: 0, marginLeft: 8 }}>
                  <span style={{ fontSize: 10, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{n.date}</span>
                  <span style={{ fontSize: 10, color: TYPE_COLORS[n.type] || 'var(--accent)', fontWeight: 500, whiteSpace: 'nowrap' }}>{n.type}</span>
                </span>
              </div>
            </div>
          ),
        }))}
      />
    </div>
  )
}
