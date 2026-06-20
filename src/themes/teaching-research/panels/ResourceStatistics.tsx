import { useResourceStats } from '@/api/queries/teachingResearch'
import BarChart from '@/components/charts/BarChart'
import StatusPanel from '@/components/ui/StatusPanel'
import ChartLabel from '@/components/ui/ChartLabel'

const STATS = [
  { key: 'totalResources', label: '资源总量', unit: '份', color: '#1890ff' },
  { key: 'cloudQuestions', label: '云试题数', unit: '道', color: '#52c41a' },
  { key: 'cloudResources', label: '云资源数', unit: '份', color: '#faad14' },
  { key: 'recentUpdates', label: '近期更新', unit: '次', color: '#722ed1' },
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1, minHeight: 0 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, flexShrink: 0 }}>
        {STATS.map((s) => (
          <div
            key={s.key}
            style={{
              background: 'var(--panel-bg)',
              border: '1px solid var(--border-light)',
              borderRadius: 6,
              padding: '10px 12px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 'var(--font-size-xxl)', fontWeight: 700, color: s.color }}>{data[s.key].toLocaleString()}</div>
            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)' }}>{s.label} <span style={{ fontSize: 'var(--font-size-xs)' }}>{s.unit}</span></div>
          </div>
        ))}
      </div>
      <div style={{ flexShrink: 0 }}>
        <ChartLabel>资源类型分布</ChartLabel>
        <BarChart data={RESOURCE_DATA} height={140} />
      </div>
    </div>
  )
}
