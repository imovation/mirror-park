import StatusPanel from '@/components/ui/StatusPanel'
import ChartLabel from '@/components/ui/ChartLabel'
import PieChart from '@/components/charts/PieChart'
import { useTeachingResources } from '@/api/queries/teachingResearch'

const UNITS: Record<string, string> = {
  '试卷': '套', '学案': '份', '教学设计': '个', '微课': '节', '课件': '个', '素材': '份',
}

export default function TeachingResourcesPanel() {
  const { data, isLoading, error } = useTeachingResources()
  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return <StatusPanel type="empty" />

  const total = data.resources.reduce((a, b) => a + b.value, 0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1, minHeight: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <ChartLabel>教学资源分类</ChartLabel>
        <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
          共 <b style={{ color: 'var(--accent)' }}>{total.toLocaleString()}</b> 份
        </span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, flexShrink: 0 }}>
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
            <div style={{ height: 4, background: r.color, opacity: 0.45 }} />
            <div style={{ padding: '8px 6px', textAlign: 'center' }}>
              <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>
                {r.value}<span style={{ fontSize: 'var(--font-size-2xs)', color: 'var(--text-muted)', marginLeft: 2, marginRight: 4, fontWeight: 400 }}>{UNITS[r.name] || ''}</span>
              </div>
              <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)', marginTop: 2 }}>{r.name}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <PieChart
          data={data.resources.map((r) => ({ name: r.name, value: r.value }))}
          height={140}
          legendPosition="bottom"
        />
      </div>
    </div>
  )
}
