import { usePersonnelComposition, useTeacherDistribution } from '@/api/queries/overview'
import RingChart from '@/components/charts/RingChart'
import BarChart from '@/components/charts/BarChart'
import StatusPanel from '@/components/ui/StatusPanel'
import ChartLabel from '@/components/ui/ChartLabel'
import { CHART_PALETTE } from '@/config/chartTheme'

export function FacultyComposition() {
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1, minHeight: 0 }}>
      <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexShrink: 0 }}>
        <div style={{ textAlign: 'center', padding: '4px 12px', background: 'var(--panel-bg)', border: '1px solid var(--border-light)', borderRadius: 6, minWidth: 80 }}>
          <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'monospace' }}>{p.totalTeachers}</div>
          <div style={{ fontSize: 'var(--font-size-2xs)', color: 'var(--text-muted)' }}>教职工</div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 6, flex: 1, minHeight: 0 }}>
        <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
          <ChartLabel align="center">性别比例</ChartLabel>
          <RingChart
            data={genderData}
            colors={[CHART_PALETTE.semantic.male, CHART_PALETTE.semantic.female]}
            height={200}
            centerLabel={String(p.totalTeachers)}
            centerLabelSize={22}
            legendPosition="bottom"
          />
        </div>
        <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
          <ChartLabel align="center">年龄分布</ChartLabel>
          <BarChart
            data={ageData}
            colors={CHART_PALETTE.dark}
            height={200}
            barWidth="60%"
            showLabel
          />
        </div>
      </div>
    </div>
  )
}

export function FacultyStructure() {
  const personnel = usePersonnelComposition()
  const teacher = useTeacherDistribution()
  if (personnel.isLoading || teacher.isLoading) return <StatusPanel type="loading" />
  if (personnel.error || teacher.error) return <StatusPanel type="error" />
  if (!personnel.data || !teacher.data) return <StatusPanel type="empty" />

  const t = teacher.data
  const p = personnel.data
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1, minHeight: 0 }}>
      <div style={{ display: 'flex', gap: 6, flex: 1, minHeight: 0 }}>
        <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
          <ChartLabel align="center">职称分布</ChartLabel>
          <BarChart
            data={t.titles}
            colors={CHART_PALETTE.dark}
            height={150}
            gridLeft="20%"
            gridBottom="15%"
            barWidth="60%"
            showLabel
          />
        </div>
        <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
          <ChartLabel align="center">学历分布</ChartLabel>
          <BarChart
            data={p.education}
            colors={CHART_PALETTE.dark}
            height={150}
            gridLeft="15%"
            gridBottom="15%"
            barWidth="60%"
            showLabel
          />
        </div>
      </div>
      <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
        <ChartLabel align="center">学科分布</ChartLabel>
        <BarChart
          data={t.subjects}
          colors={CHART_PALETTE.dark}
          height={140}
          gridLeft="14%"
          gridBottom="15%"
          barWidth="55%"
          showLabel
        />
      </div>
    </div>
  )
}

export default function FacultyPanorama() {
  const personnel = usePersonnelComposition()
  const teacher = useTeacherDistribution()

  if (personnel.isLoading || teacher.isLoading) return <StatusPanel type="loading" />
  if (personnel.error || teacher.error) return <StatusPanel type="error" />
  if (!personnel.data || !teacher.data) return <StatusPanel type="empty" />

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1, minHeight: 0 }}>
      <FacultyComposition />
      <FacultyStructure />
    </div>
  )
}
