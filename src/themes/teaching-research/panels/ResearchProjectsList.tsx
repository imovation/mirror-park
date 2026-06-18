import { useResearchProjects } from '@/api/queries/teachingResearch'
import CardCarousel from '@/components/ui/CardCarousel'
import StatusPanel from '@/components/ui/StatusPanel'

const statusColors: Record<string, string> = {
  '在研': '#4a9eff',
  '中期': '#ffc107',
  '结题': '#00c853',
}

export default function ResearchProjectsList() {
  const { data, isLoading, error } = useResearchProjects()
  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return <StatusPanel type="empty" />
  return (
    <div style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
      <CardCarousel
        items={data.projects.map((p) => ({
          id: p.id,
          title: p.name,
          subtitle: `负责人: ${p.leader} · ${p.members}人`,
          tag: p.status,
          tagColor: statusColors[p.status],
        }))}
      />
    </div>
  )
}
