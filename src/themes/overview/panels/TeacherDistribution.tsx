import { useTeacherDistribution } from '@/api/queries/overview'
import BarChart from '@/components/charts/BarChart'
import RadarChart from '@/components/charts/RadarChart'
import StatusPanel from '@/components/ui/StatusPanel'

export default function TeacherDistribution() {
  const { data, isLoading, error } = useTeacherDistribution()

  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return null

  const maxSubject = Math.max(...data.subjects.map(s => s.value)) + 5
  const indicator = data.subjects.map(s => ({ name: s.name, max: maxSubject }))
  const series = [{ name: '教师人数', value: data.subjects.map(s => s.value) }]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 2 }}>各学科教师数量</div>
        <RadarChart indicator={indicator} series={series} height={240} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 2 }}>职称分布</div>
        <BarChart data={data.titles} height={100} color="#00c853" />
      </div>
    </div>
  )
}
