import { useAdminAttendance } from '@/api/queries/admin'
import NumberFlip from '@/components/ui/NumberFlip'
import BarChart from '@/components/charts/BarChart'
import LineChart from '@/components/charts/LineChart'

export default function StaffAttendance() {
  const { data, isLoading, error } = useAdminAttendance()
  if (isLoading) return <div style={{ color: '#6b7280', fontSize: '0.75rem' }}>加载中...</div>
  if (error) return <div style={{ color: '#ef4444', fontSize: '0.75rem' }}>数据加载失败</div>
  if (!data) return null
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
        <NumberFlip label="今日出勤" value={data.todayPresent} unit="人" color="#00c853" />
        <NumberFlip label="请假" value={data.todayLeave} unit="人" color="#ffc107" />
        <NumberFlip label="缺勤" value={data.todayAbsent} unit="人" color="#ff1744" />
      </div>
      <div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 2 }}>各部门出勤率</div>
        <BarChart data={data.departmentRates} height={100} horizontal={false} />
      </div>
      <div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 2 }}>近30日出勤趋势</div>
        <LineChart
          xData={data.monthlyTrend.days}
          series={[{ name: '出勤率', data: data.monthlyTrend.values, color: '#4a9eff' }]}
          height={100}
        />
      </div>
    </div>
  )
}
