import { useTeacherDistribution } from '@/api/queries/overview'
import BarChart from '@/components/charts/BarChart'
import StatusPanel from '@/components/ui/StatusPanel'
import ChartLabel from '@/components/ui/ChartLabel'

export default function TeacherDistribution() {
  const { data, isLoading, error } = useTeacherDistribution()

  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return <StatusPanel type="empty" />

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1, minHeight: 0, overflow: 'auto' }}>
      <div style={{ flex: 1, minHeight: 0 }}>
        <ChartLabel>各学科教师数量</ChartLabel>
        <div style={{ flex: 1, minHeight: 0 }}>
          <BarChart data={data.subjects} height={140} color="#4a9eff" />
        </div>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <ChartLabel>职称分布</ChartLabel>
        <div style={{ flex: 1, minHeight: 0 }}>
          <BarChart data={data.titles} height={75} color="#00c853" />
        </div>
      </div>
    </div>
  )
}
