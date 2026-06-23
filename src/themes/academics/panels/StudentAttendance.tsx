import { CHART_PALETTE, HUE_ROTATION } from '@/config/chartTheme'
import { useAttendanceData } from '@/api/queries/academics'
import GaugeChart from '@/components/charts/GaugeChart'
import BarChart from '@/components/charts/BarChart'
import LineChart from '@/components/charts/LineChart'
import NumberFlip from '@/components/ui/NumberFlip'
import StatusPanel from '@/components/ui/StatusPanel'
import ChartLabel from '@/components/ui/ChartLabel'

export function AttendanceOverview() {
  const { data, isLoading, error } = useAttendanceData()
  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return <StatusPanel type="empty" />

  const rate = Math.round(data.todayRate * 100)
  const avgGradeRate = data.gradeRates.length
    ? Math.round(data.gradeRates.reduce((a, b) => a + b.value, 0) / data.gradeRates.length)
    : 0
  const avgTrend = data.trend.values.length
    ? Math.round(data.trend.values.reduce((a, b) => a + b, 0) / data.trend.values.length)
    : 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1, minHeight: 0 }}>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexShrink: 0 }}>
        <NumberFlip label="今日出勤率" value={rate} unit="%" color="var(--accent)" />
        <NumberFlip label="年级均分" value={avgGradeRate} unit="%" color="var(--color-success)" />
        <NumberFlip label="30日均值" value={avgTrend} unit="%" color="var(--text-primary)" />
      </div>
      <div style={{ display: 'flex', gap: 6, flex: 1, minHeight: 0 }}>
        <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
          <ChartLabel align="center">各年级出勤率</ChartLabel>
          <BarChart data={data.gradeRates.map(r => ({ name: r.name, value: r.value }))} height={120} />
        </div>
        <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
          <ChartLabel align="center">实时仪表</ChartLabel>
          <GaugeChart value={rate} name="出勤率" height={150} />
        </div>
      </div>
    </div>
  )
}

export function AttendanceTrend() {
  const { data, isLoading, error } = useAttendanceData()
  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return <StatusPanel type="empty" />
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1, minHeight: 0 }}>
      <div style={{ display: 'flex', gap: 6, flex: 1, minHeight: 0 }}>
        <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
          <ChartLabel align="center">班级出勤排名</ChartLabel>
          <BarChart data={data.classRank.map(r => ({ name: r.name, value: r.value }))} height={220} />
        </div>
        <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
          <ChartLabel align="center">30日出勤趋势</ChartLabel>
          <LineChart xData={data.trend.days} series={[{ name: '出勤率', data: data.trend.values, color: HUE_ROTATION.r2[1] }]} height={220} smooth area />
        </div>
      </div>
    </div>
  )
}

export default function StudentAttendance() {
  const { data, isLoading, error } = useAttendanceData()
  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return <StatusPanel type="empty" />
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1, minHeight: 0 }}>
      <AttendanceOverview />
      <AttendanceTrend />
    </div>
  )
}
