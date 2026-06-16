import { useAttendanceData } from '@/api/queries/academics'
import GaugeChart from '@/components/charts/GaugeChart'
import BarChart from '@/components/charts/BarChart'
import LineChart from '@/components/charts/LineChart'

export default function StudentAttendance() {
  const { data, isLoading, error } = useAttendanceData()
  if (isLoading) return <div style={{ color: '#6b7280', fontSize: '0.75rem' }}>加载中...</div>
  if (error) return <div style={{ color: '#ef4444', fontSize: '0.75rem' }}>数据加载失败</div>
  if (!data) return null
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', gap: 8 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginBottom: 2 }}>今日出勤率</div>
          <GaugeChart value={Math.round(data.todayRate * 100)} name="出勤率" height={120} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginBottom: 2 }}>各年级出勤率</div>
          <BarChart data={data.gradeRates.map(r => ({ name: r.name, value: r.value }))} height={100} />
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginBottom: 2 }}>班级出勤排名</div>
          <BarChart data={data.classRank.map(r => ({ name: r.name, value: r.value }))} height={120} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginBottom: 2 }}>30日出勤趋势</div>
          <LineChart xData={data.trend.days} series={[{ name: '出勤率', data: data.trend.values, color: '#4a9eff' }]} height={120} smooth area />
        </div>
      </div>
    </div>
  )
}
