import StatusPanel from '@/components/ui/StatusPanel'
import ChartLabel from '@/components/ui/ChartLabel'
import { useTeachingResources } from '@/api/queries/teachingResearch'

export default function TeachingResourcesPanel() {
  const { data, isLoading, error } = useTeachingResources()
  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return <StatusPanel type="empty" />

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1, minHeight: 0, overflow: 'auto' }}>
      <ChartLabel>教学资源分类占比</ChartLabel>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, flex: 1, minHeight: 0, overflow: 'auto' }}>
        {data.resources.map((r) => (
          <div
            key={r.name}
            style={{
              background: 'var(--panel-bg)',
              border: '1px solid var(--border-light)',
              borderRadius: 6,
              overflow: 'hidden',
            }}
          >
            <div style={{ height: 4, background: r.color, opacity: 0.65 }} />
            <div style={{ padding: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>{r.value}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{r.name}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
