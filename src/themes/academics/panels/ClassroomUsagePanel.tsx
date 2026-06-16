import { useClassroomUsage } from '@/api/queries/academics'
import NumberFlip from '@/components/ui/NumberFlip'
import BarChart from '@/components/charts/BarChart'
import PieChart from '@/components/charts/PieChart'
import GaugeChart from '@/components/charts/GaugeChart'

export default function ClassroomUsagePanel() {
  const { data, isLoading, error } = useClassroomUsage()
  if (isLoading) return <div style={{ color: '#6b7280', fontSize: '0.75rem' }}>加载中...</div>
  if (error) return <div style={{ color: '#ef4444', fontSize: '0.75rem' }}>数据加载失败</div>
  if (!data) return null

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
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginBottom: 2 }}>各楼使用率</div>
          <BarChart data={data.buildingUsage} height={100} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginBottom: 2 }}>使用率</div>
          <GaugeChart value={usagePercent} name="教室使用率" height={120} />
        </div>
      </div>
      <div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginBottom: 2 }}>教室类型分布</div>
        <PieChart data={data.typeDistribution} height={110} />
      </div>
    </div>
  )
}
