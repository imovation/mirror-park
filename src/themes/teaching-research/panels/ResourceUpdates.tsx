import { useResourceUpdates } from '@/api/queries/teachingResearch'
import ScrollList from '@/components/ui/ScrollList'

export default function ResourceUpdates() {
  const { data, isLoading, error } = useResourceUpdates()
  if (isLoading) return <div style={{ color: '#6b7280', fontSize: '0.75rem' }}>加载中...</div>
  if (error) return <div style={{ color: '#ef4444', fontSize: '0.75rem' }}>数据加载失败</div>
  if (!data) return null
  return (
    <ScrollList
      items={data.recentItems.map((item) => ({
        id: item.id,
        content: (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{item.name}</span>
            <span style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ fontSize: 10, color: '#4a9eff' }}>{item.subject}</span>
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>{item.teacher}</span>
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>{item.time}</span>
            </span>
          </div>
        ),
      }))}
      maxHeight={200}
    />
  )
}
