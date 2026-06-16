import { useTeacherDistribution } from '@/api/queries/overview'
import BarChart from '@/components/charts/BarChart'
import StatusPanel from '@/components/ui/StatusPanel'

export default function TeacherDistribution() {
  const { data, isLoading, error } = useTeacherDistribution()

  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 2 }}>各学科教师数量</div>
        <BarChart data={data.subjects} height={120} color="#4a9eff" />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 2 }}>职称分布</div>
        <BarChart data={data.titles} height={100} color="#00c853" />
      </div>
    </div>
  )
}
