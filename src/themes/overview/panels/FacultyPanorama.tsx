import { usePersonnelComposition, useTeacherDistribution } from '@/api/queries/overview'
import RingChart from '@/components/charts/RingChart'
import BarChart from '@/components/charts/BarChart'
import StatusPanel from '@/components/ui/StatusPanel'
import ChartLabel from '@/components/ui/ChartLabel'

export default function FacultyPanorama() {
  const personnel = usePersonnelComposition()
  const teacher = useTeacherDistribution()

  if (personnel.isLoading || teacher.isLoading) return <StatusPanel type="loading" />
  if (personnel.error || teacher.error) return <StatusPanel type="error" />
  if (!personnel.data || !teacher.data) return <StatusPanel type="empty" />

  const p = personnel.data
  const t = teacher.data

  const genderData = [
    { name: '男', value: p.maleCount },
    { name: '女', value: p.femaleCount },
  ]

  const ageData = t.ageDistribution

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1, minHeight: 0 }}>
      <div style={{ display: 'flex', gap: 8, flex: 1, minHeight: 0, overflow: 'hidden' }}>
        <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
          <ChartLabel align="center">性别比例</ChartLabel>
          <RingChart
            data={genderData}
            height={100}
            centerLabel={String(p.totalTeachers)}
            centerLabelSize={16}
            centerLabelColor="var(--text-primary)"
            legendPosition="bottom"
          />
          <div style={{ textAlign: 'center', fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', marginTop: -4 }}>
            教职工总数（人）
          </div>
        </div>
        <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
          <ChartLabel align="center">年龄分布</ChartLabel>
          <BarChart data={ageData} height={100} gridLeft="2%" gridBottom="12%" barWidth="70%" />
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, flex: 1, minHeight: 0 }}>
        <div style={{ flex: 1, minHeight: 0 }}>
          <ChartLabel align="center">职称分布</ChartLabel>
          <BarChart data={t.titles} height={140} gridLeft="15%" barWidth="70%" />
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <ChartLabel align="center">学科分布</ChartLabel>
          <BarChart data={t.subjects.slice(0, 6)} height={140} gridLeft="10%" barWidth="70%" />
        </div>
      </div>
    </div>
  )
}
