import { CHART_PALETTE } from '@/config/chartTheme'
import { useResourceStats } from '@/api/queries/teachingResearch'
import BarChart from '@/components/charts/BarChart'
import StatusPanel from '@/components/ui/StatusPanel'
import ChartLabel from '@/components/ui/ChartLabel'

const STATS = [
  { key: 'totalResources', label: '资源总量', unit: '份', color: 'var(--accent)' },
  { key: 'cloudQuestions', label: '云试题数', unit: '道', color: 'var(--color-success)' },
  { key: 'cloudResources', label: '云资源数', unit: '份', color: 'var(--color-warning)' },
  { key: 'recentUpdates', label: '近期更新', unit: '次', color: 'var(--color-chart-7)' },
] as const

const RESOURCE_DATA = [
  { name: '试卷', value: 1240 },
  { name: '课件', value: 980 },
  { name: '学案', value: 860 },
  { name: '教学设计', value: 520 },
  { name: '微课', value: 380 },
]

export default function ResourceStatistics() {
  const { data, isLoading, error } = useResourceStats()
  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return <StatusPanel type="empty" />

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1, minHeight: 0 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, flexShrink: 0 }}>
        {STATS.map((s) => (
          <div
            key={s.key}
            style={{
              background: 'var(--panel-bg)',
              border: '1px solid var(--border-light)',
              borderRadius: 4,
              padding: '6px 8px',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: s.color, opacity: 0.5 }} />
            <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, color: s.color, fontFamily: 'monospace', lineHeight: 1.1 }}>{data[s.key].toLocaleString()}</div>
            <div style={{ fontSize: 'var(--font-size-2xs)', color: 'var(--text-muted)', marginTop: 1 }}>{s.label} · {s.unit}</div>
          </div>
        ))}
      </div>
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <ChartLabel>资源类型分布</ChartLabel>
        <div style={{ flex: 1, minHeight: 0 }}>
          <BarChart data={RESOURCE_DATA} height={120} barWidth="55%" />
        </div>
      </div>
    </div>
  )
}
