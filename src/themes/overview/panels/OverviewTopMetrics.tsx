import { useSchoolInfo } from '@/api/queries/overview'
import TopMetricsCard from '@/components/ui/TopMetricsCard'

export default function OverviewTopMetrics() {
  const { data } = useSchoolInfo()

  if (!data) return null

  return (
    <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap' }}>
      <TopMetricsCard label="占地面积" value={`${data.landArea?.toLocaleString()}㎡`} />
      <TopMetricsCard label="建筑面积" value={`${data.buildingArea?.toLocaleString()}㎡`} />
      <TopMetricsCard label="班级数" value={data.classCount?.toString() ?? '-'} />
      <TopMetricsCard label="教职工" value={data.totalTeachers?.toString() ?? '-'} />
      <TopMetricsCard label="学生数" value={data.totalStudents?.toLocaleString() ?? '-'} />
    </div>
  )
}
