import { useTeachingResources } from '@/api/queries/teachingResearch'
import BarChart from '@/components/charts/BarChart'
import StatusPanel from '@/components/ui/StatusPanel'

export default function TeachingResourcesPanel() {
  const { data, isLoading, error } = useTeachingResources()
  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return null
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {data.resources.map((r) => (
        <div key={r.name} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 8,
            height: 8,
            borderRadius: 2,
            background: r.color,
            flexShrink: 0,
          }} />
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', minWidth: 50 }}>{r.name}</span>
          <div style={{ flex: 1 }}>
            <BarChart
              data={[{ name: r.name, value: r.value }]}
              height={20}
              horizontal
              color={r.color}
            />
          </div>
          <span style={{ fontSize: 11, color: r.color, minWidth: 36, textAlign: 'right' }}>{r.value}</span>
        </div>
      ))}
    </div>
  )
}
