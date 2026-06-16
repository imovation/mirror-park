import { useAdminOverview } from '@/api/queries/admin'
import NumberFlip from '@/components/ui/NumberFlip'
import StatusPanel from '@/components/ui/StatusPanel'

export default function AdminOverview() {
  const { data, isLoading, error } = useAdminOverview()
  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return null
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
      <NumberFlip label="部门数量" value={data.departmentCount} unit="个" />
      <NumberFlip label="教职工总数" value={data.staffCount} unit="人" color="#00c853" />
      <NumberFlip label="今日出勤率" value={Math.round(data.attendanceRate * 100)} unit="%" color="#4a9eff" />
      <NumberFlip label="功能室数量" value={data.roomCount} unit="间" color="#ff6d00" />
    </div>
  )
}
