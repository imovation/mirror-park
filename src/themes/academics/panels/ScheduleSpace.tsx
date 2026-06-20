import { useScheduleData, useClassroomUsage } from '@/api/queries/academics'
import BarChart from '@/components/charts/BarChart'
import PieChart from '@/components/charts/PieChart'
import GaugeChart from '@/components/charts/GaugeChart'
import NumberFlip from '@/components/ui/NumberFlip'
import StatusPanel from '@/components/ui/StatusPanel'
import ChartLabel from '@/components/ui/ChartLabel'

export default function ScheduleSpace() {
  const schedule = useScheduleData()
  const classroom = useClassroomUsage()

  if (schedule.isLoading || classroom.isLoading) return <StatusPanel type="loading" />
  if (schedule.error || classroom.error) return <StatusPanel type="error" />
  if (!schedule.data || !classroom.data) return <StatusPanel type="empty" />

  const s = schedule.data
  const c = classroom.data
  const total = c.inUse + c.available
  const usagePercent = total > 0 ? Math.round((c.inUse / total) * 100) : 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1, minHeight: 0 }}>
      <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexShrink: 0 }}>
        <NumberFlip label="使用中" value={c.inUse} unit="间" color="var(--color-success)" />
        <NumberFlip label="空闲" value={c.available} unit="间" color="var(--color-warning)" />
      </div>
      <div style={{ display: 'flex', gap: 6, flex: 1, minHeight: 0 }}>
        <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
          <ChartLabel align="center">年级排课分布</ChartLabel>
          <BarChart data={s.gradeDistribution} height={160} />
        </div>
        <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
          <ChartLabel align="center">各楼宇使用率</ChartLabel>
          <BarChart data={c.buildingUsage} height={160} />
        </div>
      </div>
      <div style={{ display: 'flex', gap: 6, flex: 1, minHeight: 0 }}>
        <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
          <ChartLabel align="center">教室类型分布</ChartLabel>
          <BarChart data={c.typeDistribution} height={120} />
        </div>
        <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
          <ChartLabel align="center">使用率</ChartLabel>
          <GaugeChart value={usagePercent} name="教室使用率" height={120} />
        </div>
      </div>
    </div>
  )
}
