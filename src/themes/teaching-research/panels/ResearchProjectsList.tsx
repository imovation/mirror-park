import { useResearchProjects } from '@/api/queries/teachingResearch'
import CardCarousel from '@/components/ui/CardCarousel'

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
    <CardCarousel
      items={data.projects.map((p) => ({
        id: p.id,
        title: p.name,
        subtitle: `负责人: ${p.leader} · ${p.members}人`,
        tag: p.status,
        tagColor: statusColors[p.status],
      }))}
      maxHeight={200}
    />
  )
}
