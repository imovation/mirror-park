import { useNoticeData } from '@/api/queries/admin'
import ScrollList from '@/components/ui/ScrollList'
import StatusPanel from '@/components/ui/StatusPanel'

const TYPE_COLORS: Record<string, string> = {
  '行政': 'var(--accent)',
  '教学': 'var(--color-success)',
  '活动': 'var(--color-warning)',
  '紧急': 'var(--color-danger)',
}

export default function NoticeBoard() {
  const { data, isLoading, error } = useNoticeData()
  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return <StatusPanel type="empty" />
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1, minHeight: 0, paddingTop: 2 }}>
      <ScrollList
        maxHeight={260}
        items={data.notices.map(n => ({
          id: n.id,
          content: (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)' }}>{n.title}</span>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 'var(--font-size-2xs)', color: 'var(--text-muted)', minWidth: 0, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{n.department}</span>
                <span style={{ display: 'flex', gap: 6, flexShrink: 0, marginLeft: 8, alignItems: 'center' }}>
                  <span style={{ fontSize: 'var(--font-size-2xs)', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{n.date}</span>
                  <span style={{ fontSize: 'var(--font-size-2xs)', color: TYPE_COLORS[n.type] || 'var(--accent)', fontWeight: 500, whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', background: `${TYPE_COLORS[n.type]}20`, padding: '1px 5px', borderRadius: 3, lineHeight: 1.4 }}>{n.type}</span>
                </span>
              </div>
            </div>
          ),
        }))}
      />
    </div>
  )
}
