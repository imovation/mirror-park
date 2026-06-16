import { useNoticeData } from '@/api/queries/admin'
import ScrollList from '@/components/ui/ScrollList'

const TYPE_COLORS: Record<string, string> = {
  '行政': '#4a9eff',
  '教学': '#00c853',
  '活动': '#ff6d00',
  '紧急': '#ff1744',
}

export default function NoticeBoard() {
  const { data, isLoading, error } = useNoticeData()
  if (isLoading) return <div style={{ color: '#6b7280', fontSize: '0.75rem' }}>加载中...</div>
  if (error) return <div style={{ color: '#ef4444', fontSize: '0.75rem' }}>数据加载失败</div>
  if (!data) return null
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <ScrollList
        items={data.notices.map(n => ({
          id: n.id,
          content: (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <div style={{ fontWeight: 500 }}>{n.title}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>{n.department}</span>
                <span style={{ display: 'flex', gap: 8 }}>
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>{n.date}</span>
                  <span style={{ fontSize: 10, color: TYPE_COLORS[n.type] || '#4a9eff', fontWeight: 500 }}>{n.type}</span>
                </span>
              </div>
            </div>
          ),
        }))}
        maxHeight={200}
      />
    </div>
  )
}
