import { useAttendanceData } from '@/api/queries/academics'
import GaugeChart from '@/components/charts/GaugeChart'
import BarChart from '@/components/charts/BarChart'
import LineChart from '@/components/charts/LineChart'
import StatusPanel from '@/components/ui/StatusPanel'
import ChartLabel from '@/components/ui/ChartLabel'

export default function StudentAttendance() {
  const { data, isLoading, error } = useAttendanceData()
  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return null
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', gap: 8 }}>
        <div style={{ flex: 1 }}>
          <ChartLabel align="center">今日出勤率</ChartLabel>
          <GaugeChart value={Math.round(data.todayRate * 100)} name="出勤率" height={120} />
        </div>
        <div style={{ flex: 1 }}>
          <ChartLabel align="center">各年级出勤率</ChartLabel>
          <BarChart data={data.gradeRates.map(r => ({ name: r.name, value: r.value }))} height={100} />
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <div style={{ flex: 1 }}>
          <ChartLabel align="center">班级出勤排名</ChartLabel>
          <BarChart data={data.classRank.map(r => ({ name: r.name, value: r.value }))} height={120} />
        </div>
        <div style={{ flex: 1 }}>
          <ChartLabel align="center">30日出勤趋势</ChartLabel>
          <LineChart xData={data.trend.days} series={[{ name: '出勤率', data: data.trend.values, color: '#4a9eff' }]} height={120} smooth area />
        </div>
      </div>
    </div>
  )
}
