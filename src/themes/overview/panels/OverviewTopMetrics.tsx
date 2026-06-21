import { useSchoolInfo } from '@/api/queries/overview'
import TopMetricsCard from '@/components/ui/TopMetricsCard'
import { formatNumber } from '@/utils/format'

const LABELS = ['占地面积', '建筑面积', '班级数', '建筑栋数', '教职工', '学生数']

function Skeleton() {
  return (
    <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
      {LABELS.map((label) => (
        <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '8px 20px', borderRadius: 8, background: 'var(--panel-bg)', minWidth: 100 }}>
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
    <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
      <TopMetricsCard label="占地面积" value={`${formatNumber(data.landArea ?? 0)}㎡`} />
      <TopMetricsCard label="建筑面积" value={`${formatNumber(data.buildingArea ?? 0)}㎡`} />
      <TopMetricsCard label="班级数" value={formatNumber(data.classCount ?? 0)} />
      <TopMetricsCard label="建筑栋数" value={formatNumber(data.buildingCount ?? 0)} />
      <TopMetricsCard label="教职工" value={formatNumber(data.totalTeachers ?? 0)} />
      <TopMetricsCard label="学生数" value={formatNumber(data.totalStudents ?? 0)} />
    </div>
  )
}
