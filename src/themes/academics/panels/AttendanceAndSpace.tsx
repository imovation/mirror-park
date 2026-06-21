import { useAttendanceData, useClassroomUsage } from '@/api/queries/academics'
import BarChart from '@/components/charts/BarChart'
import LineChart from '@/components/charts/LineChart'
import GaugeChart from '@/components/charts/GaugeChart'
import NumberFlip from '@/components/ui/NumberFlip'
import StatusPanel from '@/components/ui/StatusPanel'
import ChartLabel from '@/components/ui/ChartLabel'

export default function AttendanceAndSpace() {
  const attQuery = useAttendanceData()
  const clsQuery = useClassroomUsage()

  if (attQuery.isLoading || clsQuery.isLoading) return <StatusPanel type="loading" />
  if (attQuery.error || clsQuery.error) return <StatusPanel type="error" />
  if (!attQuery.data || !clsQuery.data) return <StatusPanel type="empty" />

  const att = attQuery.data
  const cls = clsQuery.data
  const rate = Math.round(att.todayRate * 100)
  const avgGradeRate = att.gradeRates.length
    ? Math.round(att.gradeRates.reduce((a, b) => a + b.value, 0) / att.gradeRates.length)
    : 0
  const total = cls.inUse + cls.available
  const conflictCount = cls.inUse > cls.available ? Math.max(0, cls.inUse - cls.available) : 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1, minHeight: 0 }}>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexShrink: 0 }}>
        <NumberFlip label="今日出勤率" value={rate} unit="%" color="var(--color-success)" />
        <NumberFlip label="年级均分" value={avgGradeRate} unit="%" color="var(--accent)" />
        <NumberFlip label="教室总数" value={total} unit="间" color="var(--accent)" />
        <div style={{ textAlign: 'center', padding: '4px 8px', background: 'var(--panel-bg)', border: '1px solid var(--border-light)', borderRadius: 6, display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: 70 }}>
          <div style={{ fontSize: 'var(--font-size-2xs)', color: 'var(--text-muted)' }}>实时冲突</div>
          <div style={{ fontSize: 'var(--font-size-md)', fontWeight: 700, color: 'var(--color-danger)' }}>{conflictCount}<span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 400, color: 'var(--text-muted)' }}>节</span></div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 6, flex: 1, minHeight: 0 }}>
        <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
          <ChartLabel align="center">班级出勤排名</ChartLabel>
          <BarChart data={att.classRank.map(r => ({ name: r.name, value: r.value }))} height={200} />
        </div>
        <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
          <ChartLabel align="center">30日出勤趋势</ChartLabel>
          <LineChart
            xData={att.trend.days}
            series={[{ name: '出勤率', data: att.trend.values, color: 'var(--accent)' }]}
            height={140}
            smooth
            area
          />
          <div style={{ marginTop: 4 }}>
            <ChartLabel align="center">使用率</ChartLabel>
            <GaugeChart value={Math.round((cls.inUse / total) * 100)} name="教室使用率" height={90} />
          </div>
        </div>
      </div>
    </div>
  )
}
