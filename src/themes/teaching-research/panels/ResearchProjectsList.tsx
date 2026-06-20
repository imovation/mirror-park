import { useResearchProjects } from '@/api/queries/teachingResearch'
import StatusPanel from '@/components/ui/StatusPanel'

const statusColors: Record<string, string> = {
  '在研': 'var(--accent)',
  '中期': 'var(--color-warning)',
  '结题': 'var(--color-success)',
}

export default function ResearchProjectsList() {
  const { data, isLoading, error } = useResearchProjects()
  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return <StatusPanel type="empty" />

  const statusCount = data.projects.reduce<Record<string, number>>((acc, p) => {
    acc[p.status] = (acc[p.status] || 0) + 1
    return acc
  }, {})

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1, minHeight: 0 }}>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexShrink: 0 }}>
        {Object.entries(statusCount).map(([status, count]) => (
          <div key={status} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, color: statusColors[status] || 'var(--text-primary)' }}>{count}</div>
            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>{status}</div>
          </div>
        ))}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, color: 'var(--text-primary)' }}>{data.projects.length}</div>
          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>全部</div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, overflow: 'auto', flex: 1 }}>
        {data.projects.map((p) => (
          <div key={p.id} style={{ background: 'var(--panel-bg)', border: '1px solid var(--border-light)', borderRadius: 6, padding: '8px 10px' }}>
            <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 4 }}>{p.name}</div>
            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>负责人: {p.leader}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>{p.members}人</span>
              <span style={{ fontSize: 'var(--font-size-xs)', color: statusColors[p.status] || 'var(--accent)', fontWeight: 500, background: `${statusColors[p.status] || 'var(--accent)'}20`, padding: '1px 6px', borderRadius: 3 }}>{p.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
