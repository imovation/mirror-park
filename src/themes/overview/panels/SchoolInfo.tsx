import { useSchoolInfo } from '@/api/queries/overview'
import NumberFlip from '@/components/ui/NumberFlip'
import StatusPanel from '@/components/ui/StatusPanel'

export default function SchoolInfo() {
  const { data, isLoading, error } = useSchoolInfo()

  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return null

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
      <NumberFlip label="占地面积" value={data.landArea} unit="m²" />
      <NumberFlip label="建筑面积" value={data.buildingArea} unit="m²" />
      <NumberFlip label="班级数量" value={data.classCount} unit="个" />
      <NumberFlip label="建筑数量" value={data.buildingCount} unit="栋" />
    </div>
  )
}
