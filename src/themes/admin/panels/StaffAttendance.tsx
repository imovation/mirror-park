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
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, height: '100%' }}>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
        <NumberFlip label="今日出勤" value={data.todayPresent} unit="人" color="#00c853" />
        <NumberFlip label="请假" value={data.todayLeave} unit="人" color="#ffc107" />
        <NumberFlip label="缺勤" value={data.todayAbsent} unit="人" color="#ff1744" />
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <ChartLabel>各部门出勤率</ChartLabel>
        <BarChart data={data.departmentRates} horizontal={false} />
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <ChartLabel>近30日出勤趋势</ChartLabel>
        <LineChart
          xData={data.monthlyTrend.days}
          series={[{ name: '出勤率', data: data.monthlyTrend.values, color: '#4a9eff' }]}
        />
      </div>
    </div>
  )
}
