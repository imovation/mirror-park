import { CHART_PALETTE, HUE_ROTATION } from '@/config/chartTheme'
import { useAdminAttendance } from '@/api/queries/admin'
import NumberFlip from '@/components/ui/NumberFlip'
import BarChart from '@/components/charts/BarChart'
import LineChart from '@/components/charts/LineChart'
import StatusPanel from '@/components/ui/StatusPanel'
import ChartLabel from '@/components/ui/ChartLabel'

export default function StaffAttendance() {
  const { data, isLoading, error } = useAdminAttendance()
  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return <StatusPanel type="empty" />

  const colorByRate = (v: number) =>
    v >= 97 ? 'var(--color-success)' : v >= 92 ? 'var(--accent)' : v >= 85 ? 'var(--color-warning)' : 'var(--color-danger)'

  const trendValues = data.monthlyTrend.values
  const abnormalCount = trendValues.filter((v) => v < 90).length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1, minHeight: 0 }}>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexShrink: 0 }}>
        <NumberFlip label="今日出勤" value={data.todayPresent} unit="人" color="var(--color-success)" />
        <NumberFlip label="请假" value={data.todayLeave} unit="人" color="var(--color-warning)" />
        <NumberFlip label="缺勤" value={data.todayAbsent} unit="人" color="var(--color-danger)" />
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <ChartLabel>各部门出勤率</ChartLabel>
        <BarChart
          data={data.departmentRates}
          colors={data.departmentRates.map(d => colorByRate(d.value))}
          height={120}
          barWidth="50%"
        />
      </div>
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <ChartLabel>近 30 日出勤趋势</ChartLabel>
          {abnormalCount > 0 && (
            <span style={{ fontSize: 'var(--font-size-2xs)', color: 'var(--color-warning)' }}>
              ⚠ {abnormalCount} 次异常
            </span>
          )}
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <LineChart
            xData={data.monthlyTrend.days}
            series={[
              { name: '出勤率', data: trendValues, color: HUE_ROTATION.r2[0] },
            ]}
            markLine={95}
            height={120}
          />
        </div>
      </div>
    </div>
  )
}
