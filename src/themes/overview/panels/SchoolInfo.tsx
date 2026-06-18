import { useSchoolInfo, usePersonnelComposition } from '@/api/queries/overview'
import CompactStatsRow from '@/components/ui/CompactStatsRow'
import StatusPanel from '@/components/ui/StatusPanel'

export default function SchoolInfo() {
  const { data: sData, isLoading: sLoading, error: sError } = useSchoolInfo()
  const { data: pData, isLoading: pLoading, error: pError } = usePersonnelComposition()

  if (sLoading || pLoading) return <StatusPanel type="loading" />
  if (sError || pError) return <StatusPanel type="error" />
  if (!sData || !pData) return <StatusPanel type="empty" />

  return (
    <CompactStatsRow items={[
      { id: 'land', label: '占地面积', value: sData.landArea, unit: 'm²', color: 'var(--accent)' },
      { id: 'build', label: '建筑面积', value: sData.buildingArea, unit: 'm²', color: 'var(--color-warning)' },
      { id: 'class', label: '班级数', value: sData.classCount, unit: '个' },
      { id: 'staff', label: '教职工', value: pData.totalTeachers, unit: '人' },
      { id: 'stu', label: '学生数', value: 2800, unit: '人' }
    ]} />
  )
}
