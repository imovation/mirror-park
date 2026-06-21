import { useResearchProjects } from '@/api/queries/teachingResearch'
import StatusPanel from '@/components/ui/StatusPanel'
import ChartLabel from '@/components/ui/ChartLabel'

const statusColors: Record<string, string> = {
  '在研': 'var(--accent)',
  '中期': 'var(--color-pending)',
  '结题': 'var(--color-success)',
}

const STATUS_ORDER = ['在研', '中期', '结题']

export default function ResearchProjectsList() {
  const { data, isLoading, error } = useResearchProjects()
  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return <StatusPanel type="empty" />

  const total = data.projects.length
  const statusCount: Record<string, number> = {}
  data.projects.forEach((p) => {
    statusCount[p.status] = (statusCount[p.status] || 0) + 1
  })

  const totalMembers = data.projects.reduce((sum, p) => sum + p.members, 0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1, minHeight: 0 }}>
      <div style={{ display: 'flex', gap: 14, justifyContent: 'space-between', alignItems: 'center', flexShrink: 0, padding: '0 4px' }}>
        <div style={{ display: 'flex', gap: 14 }}>
          {STATUS_ORDER.map((s) => (
            <div key={s} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, color: statusColors[s] }}>{statusCount[s] || 0}</div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>{s}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8, fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
          <span>课题 <b style={{ color: 'var(--text-primary)' }}>{total}</b> 项</span>
          <span style={{ color: 'var(--border-light)' }}>|</span>
          <span>成员 <b style={{ color: 'var(--text-primary)' }}>{totalMembers}</b> 人</span>
        </div>
      </div>
      <div style={{ display: 'flex', height: 6, borderRadius: 3, overflow: 'hidden', background: 'var(--border-light)', flexShrink: 0 }}>
        {STATUS_ORDER.map((s) => {
          const count = statusCount[s] || 0
          const pct = total > 0 ? (count / total) * 100 : 0
          return pct > 0 ? (
            <div
              key={s}
              style={{ width: `${pct}%`, background: statusColors[s] }}
              title={`${s} ${count}项 (${pct.toFixed(0)}%)`}
            />
          ) : null
        })}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, overflow: 'auto', flex: 1 }}>
        {data.projects.map((p) => (
          <div
            key={p.id}
            style={{
              background: 'var(--panel-bg)',
              border: '1px solid var(--border-light)',
              borderRadius: 6,
              padding: '10px 12px',
              borderLeft: `3px solid ${statusColors[p.status] || 'var(--accent)'}`,
            }}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: 'var(--text-primary)',
                marginBottom: 4,
                lineHeight: 1.3,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                minHeight: 34,
              }}
              title={p.name}
            >
              {p.name}
            </div>
            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)' }}>负责人: {p.leader}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
              <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)' }}>{p.members}人</span>
              <span
                style={{
                  fontSize: 'var(--font-size-xs)',
                  color: statusColors[p.status] || 'var(--accent)',
                  fontWeight: 600,
                  background: `${statusColors[p.status] || 'var(--accent)'}20`,
                  padding: '1px 6px',
                  borderRadius: 3,
                }}
              >
                {p.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
