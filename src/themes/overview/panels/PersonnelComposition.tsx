import { usePersonnelComposition } from '@/api/queries/overview'
import RingChart from '@/components/charts/RingChart'
import StatusPanel from '@/components/ui/StatusPanel'
import ChartLabel from '@/components/ui/ChartLabel'

export default function PersonnelComposition() {
  const { data, isLoading, error } = usePersonnelComposition()

  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return <StatusPanel type="empty" />

  const genderData = [
    { name: '男', value: data.maleCount },
    { name: '女', value: data.femaleCount },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1, minHeight: 0, overflow: 'auto' }}>
      <div style={{ display: 'flex', gap: 12, flex: 1, minHeight: 0 }}>
        <div style={{ flex: 1, minHeight: 0 }}>
          <ChartLabel align="center">性别比例</ChartLabel>
          <RingChart
            data={genderData}
            height={150}
            centerLabel={String(data.totalTeachers)}
            centerLabelSize={22}
            centerLabelColor="var(--text-primary)"
            legendPosition="bottom"
          />
          <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--text-muted)', marginTop: -8 }}>
            教师总数 / 人
          </div>
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <ChartLabel align="center">学历分布</ChartLabel>
          <RingChart
            data={data.education}
            height={150}
            colors={['#1890ff', '#52c41a', '#faad14', '#722ed1']}
            legendPosition="bottom"
          />
        </div>
      </div>
    </div>
  )
}
