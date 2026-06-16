import { useAdminOverview } from '@/api/queries/admin'
import NumberFlip from '@/components/ui/NumberFlip'

export default function AdminOverview() {
  const { data, isLoading, error } = useAdminOverview()
  if (isLoading) return <div style={{ color: '#6b7280', fontSize: '0.75rem' }}>加载中...</div>
  if (error) return <div style={{ color: '#ef4444', fontSize: '0.75rem' }}>数据加载失败</div>
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
