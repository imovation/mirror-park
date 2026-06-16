import StatusPanel from '@/components/ui/StatusPanel'
import { useTeachingResources } from '@/api/queries/teachingResearch'
import TreemapChart from '@/components/charts/TreemapChart'

export default function TeachingResourcesPanel() {
  const { data, isLoading, error } = useTeachingResources()
  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return <StatusPanel type="empty" />

  const treemapData = data.resources.map((r) => ({
    name: r.name,
    value: r.value,
  }))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 2 }}>教学资源分类占比</div>
      <TreemapChart data={treemapData} height={220} />
    </div>
  )
}
