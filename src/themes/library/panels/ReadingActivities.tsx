import { useLibraryActivities } from '@/api/queries/library'
import ScrollList from '@/components/ui/ScrollList'

export default function ReadingActivities() {
  const { data, isLoading, error } = useLibraryActivities()
  if (isLoading) return <div style={{ color: '#6b7280', fontSize: '0.75rem' }}>加载中...</div>
  if (error) return <div style={{ color: '#ef4444', fontSize: '0.75rem' }}>数据加载失败</div>
  if (!data) return null
  return (
    <ScrollList
      items={data.activities.map((a) => ({
        id: a.id,
        content: (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{a.title}</span>
            <span style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>{a.date}</span>
              <span style={{
                fontSize: 10,
                color: a.status === '进行中' ? '#4a9eff' : a.status === '即将开始' ? '#ffc107' : 'rgba(255,255,255,0.5)',
              }}>
                {a.status}
              </span>
            </span>
          </div>
        ),
      }))}
      maxHeight={160}
    />
  )
}
