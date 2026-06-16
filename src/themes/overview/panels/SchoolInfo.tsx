import { useSchoolInfo } from '@/api/queries/overview'
import NumberFlip from '@/components/ui/NumberFlip'

export default function SchoolInfo() {
  const { data, isLoading, error } = useSchoolInfo()

  if (isLoading) return <div style={{ color: '#6b7280', fontSize: '0.75rem' }}>加载中...</div>
  if (error) return <div style={{ color: '#ef4444', fontSize: '0.75rem' }}>数据加载失败</div>
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
