import { CHART_PALETTE, HUE_ROTATION } from '@/config/chartTheme'
import { useAttendanceData } from '@/api/queries/academics'
import BarChart from '@/components/charts/BarChart'
import LineChart from '@/components/charts/LineChart'
import NumberFlip from '@/components/ui/NumberFlip'
import StatusPanel from '@/components/ui/StatusPanel'
import ChartLabel from '@/components/ui/ChartLabel'

export default function ClassAttendanceRank() {
  const { data, isLoading, error } = useAttendanceData()
  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return <StatusPanel type="empty" />

  const rate = Math.round(data.todayRate * 100)
  const avgGradeRate = data.gradeRates.length
    ? Math.round(data.gradeRates.reduce((a, b) => a + b.value, 0) / data.gradeRates.length)
    : 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1, minHeight: 0 }}>
      <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexShrink: 0 }}>
        <NumberFlip label="今日出勤率" value={rate} unit="%" color="var(--color-success)" />
        <NumberFlip label="年级均分" value={avgGradeRate} unit="%" color="var(--accent)" />
      </div>
      <div style={{ display: 'flex', gap: 6, flex: 1, minHeight: 0 }}>
        <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <ChartLabel align="center">班级出勤排名</ChartLabel>
          <div style={{ flex: 1, minHeight: 0 }}>
            <BarChart data={data.classRank} colors={CHART_PALETTE.dark} height={120} barWidth="60%" />
          </div>
        </div>
        <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <ChartLabel align="center">30 日出勤趋势</ChartLabel>
          <div style={{ flex: 1, minHeight: 0 }}>
            <LineChart
              xData={data.trend.days}
              series={[{ name: '出勤率', data: data.trend.values, color: HUE_ROTATION.r3[1] }]}
              height={120}
              smooth
              area
            />
          </div>
        </div>
      </div>
    </div>
  )
}
