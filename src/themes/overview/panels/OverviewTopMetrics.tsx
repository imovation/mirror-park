import { useSchoolInfo } from '@/api/queries/overview'
import TopMetricsCard from '@/components/ui/TopMetricsCard'
import { TOP_METRIC_PALETTE } from '@/config/metricColors'
import { formatNumber } from '@/utils/format'

const LABELS = ['占地面积', '建筑面积', '班级数', '建筑栋数', '教职工', '学生数']

const COLORS = [
  TOP_METRIC_PALETTE.cyan,
  TOP_METRIC_PALETTE.blue,
  TOP_METRIC_PALETTE.green,
  TOP_METRIC_PALETTE.purple,
  TOP_METRIC_PALETTE.pink,
  TOP_METRIC_PALETTE.yellow,
]

function Skeleton() {
  return (
    <div style={{ display: 'flex', gap: 10, justifyContent: 'space-between', width: '100%' }}>
      {LABELS.map((label, i) => (
        <div key={label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '8px 16px', borderRadius: 8, background: 'var(--panel-bg)', minWidth: 100, maxWidth: 200, borderLeft: `3px solid ${COLORS[i]}` }}>
          <div style={{ width: 60, height: 24, borderRadius: 4, background: 'var(--border-light)', opacity: 0.3, marginBottom: 4 }} />
          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)', marginTop: 2 }}>{label}</div>
        </div>
      ))}
    </div>
  )
}

export default function OverviewTopMetrics() {
  const { data } = useSchoolInfo()

  if (!data) return <Skeleton />

  return (
    <div style={{ display: 'flex', gap: 10, justifyContent: 'space-between', width: '100%' }}>
      <TopMetricsCard icon="map" label="占地面积" value={`${formatNumber(data.landArea ?? 0)}㎡`} valueColor={COLORS[0]} />
      <TopMetricsCard icon="building" label="建筑面积" value={`${formatNumber(data.buildingArea ?? 0)}㎡`} valueColor={COLORS[1]} />
      <TopMetricsCard icon="group" label="班级数" value={formatNumber(data.classCount ?? 0)} valueColor={COLORS[2]} />
      <TopMetricsCard icon="block" label="建筑栋数" value={formatNumber(data.buildingCount ?? 0)} valueColor={COLORS[3]} />
      <TopMetricsCard icon="teacher" label="教职工" value={formatNumber(data.totalTeachers ?? 0)} valueColor={COLORS[4]} />
      <TopMetricsCard icon="student" label="学生数" value={formatNumber(data.totalStudents ?? 0)} valueColor={COLORS[5]} />
    </div>
  )
}
