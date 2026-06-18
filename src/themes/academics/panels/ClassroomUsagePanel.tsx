import { useClassroomUsage } from '@/api/queries/academics'
import BarChart from '@/components/charts/BarChart'
import PieChart from '@/components/charts/PieChart'
import StatusPanel from '@/components/ui/StatusPanel'
import ChartLabel from '@/components/ui/ChartLabel'

export default function ClassroomUsagePanel() {
  const { data, isLoading, error } = useClassroomUsage()
  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return <StatusPanel type="empty" />

  const total = data.inUse + data.available
  const usagePercent = total > 0 ? Math.round((data.inUse / total) * 100) : 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 12px' }}>
         <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>使用中: <span style={{color: 'var(--color-success)', fontWeight: 'bold'}}>{data.inUse}间</span></div>
         <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>空闲: <span style={{color: 'var(--color-warning)', fontWeight: 'bold'}}>{data.available}间</span></div>
         <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>使用率: <span style={{color: 'var(--accent)', fontWeight: 'bold'}}>{usagePercent}%</span></div>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <div style={{ flex: 1 }}>
          <ChartLabel align="center">各楼使用率</ChartLabel>
          <BarChart data={data.buildingUsage} height={80} />
        </div>
        <div style={{ flex: 1 }}>
          <ChartLabel align="center">教室类型分布</ChartLabel>
          <PieChart data={data.typeDistribution} height={80} />
        </div>
      </div>
    </div>
  )
}
