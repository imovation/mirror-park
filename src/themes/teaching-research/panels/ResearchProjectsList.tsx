import { useResearchProjects } from '@/api/queries/teachingResearch'
import ScrollList from '@/components/ui/ScrollList'

const statusColors: Record<string, string> = {
  '在研': '#4a9eff',
  '中期': '#ffc107',
  '结题': '#00c853',
}

export default function ResearchProjectsList() {
  const { data, isLoading, error } = useResearchProjects()
  if (isLoading) return <div style={{ color: '#6b7280', fontSize: '0.75rem' }}>加载中...</div>
  if (error) return <div style={{ color: '#ef4444', fontSize: '0.75rem' }}>数据加载失败</div>
  if (!data) return null
  return (
    <ScrollList
      items={data.projects.map((p) => ({
        id: p.id,
        content: (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{p.name}</span>
            <span style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>{p.leader}</span>
              <span style={{
                fontSize: 10,
                color: statusColors[p.status] || 'rgba(255,255,255,0.5)',
              }}>
                {p.status}
              </span>
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>{p.members}人</span>
            </span>
          </div>
        ),
      }))}
      maxHeight={200}
    />
  )
}
