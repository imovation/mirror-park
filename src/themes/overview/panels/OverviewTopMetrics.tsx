import { useSchoolInfo } from '@/api/queries/overview'
import TopMetricsCard from '@/components/ui/TopMetricsCard'
import { formatNumber } from '@/utils/format'

export default function OverviewTopMetrics() {
  const { data } = useSchoolInfo()

  if (!data) return null

  return (
    <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap' }}>
      <TopMetricsCard label="占地面积" value={`${formatNumber(data.landArea ?? 0)}㎡`} />
      <TopMetricsCard label="建筑面积" value={`${formatNumber(data.buildingArea ?? 0)}㎡`} />
      <TopMetricsCard label="班级数" value={formatNumber(data.classCount ?? 0)} />
      <TopMetricsCard label="教职工" value={formatNumber(data.totalTeachers ?? 0)} />
      <TopMetricsCard label="学生数" value={formatNumber(data.totalStudents ?? 0)} />
    </div>
  )
}
