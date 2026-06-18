import { useClassroomUsage } from '@/api/queries/academics'
import NumberFlip from '@/components/ui/NumberFlip'
import BarChart from '@/components/charts/BarChart'
import PieChart from '@/components/charts/PieChart'
import GaugeChart from '@/components/charts/GaugeChart'
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
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
        <NumberFlip label="使用中" value={data.inUse} unit="间" color="#00c853" />
        <NumberFlip label="空闲" value={data.available} unit="间" color="#ff6d00" />
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <div style={{ flex: 1 }}>
          <ChartLabel align="center">各楼使用率</ChartLabel>
          <BarChart data={data.buildingUsage} height={100} />
        </div>
        <div style={{ flex: 1 }}>
          <ChartLabel align="center">使用率</ChartLabel>
          <GaugeChart value={usagePercent} name="教室使用率" height={120} />
        </div>
      </div>
      <div>
        <ChartLabel align="center">教室类型分布</ChartLabel>
        <PieChart data={data.typeDistribution} height={110} />
      </div>
    </div>
  )
}
