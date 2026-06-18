import StatusPanel from '@/components/ui/StatusPanel'
import ChartLabel from '@/components/ui/ChartLabel'
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1, minHeight: 0, overflow: 'auto' }}>
      <ChartLabel>教学资源分类占比</ChartLabel>
      <div style={{ flex: 1, minHeight: 0 }}>
        <TreemapChart data={treemapData} />
      </div>
    </div>
  )
}
