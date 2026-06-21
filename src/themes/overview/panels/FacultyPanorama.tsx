import { usePersonnelComposition, useTeacherDistribution } from '@/api/queries/overview'
import RingChart from '@/components/charts/RingChart'
import BarChart from '@/components/charts/BarChart'
import StatusPanel from '@/components/ui/StatusPanel'
import ChartLabel from '@/components/ui/ChartLabel'

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
        <div style={{ textAlign: 'center', padding: '4px 12px', background: 'rgba(74,158,255,0.08)', border: '1px solid var(--border-light)', borderRadius: 6, minWidth: 80 }}>
          <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'monospace' }}>{p.totalTeachers}</div>
          <div style={{ fontSize: 'var(--font-size-2xs)', color: 'var(--text-muted)' }}>教职工</div>
        </div>
        <div style={{ textAlign: 'center', padding: '4px 12px', background: 'rgba(74,158,255,0.08)', border: '1px solid var(--border-light)', borderRadius: 6, minWidth: 80 }}>
          <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, color: '#4a9eff', fontFamily: 'monospace' }}>♂ {p.maleCount}</div>
          <div style={{ fontSize: 'var(--font-size-2xs)', color: 'var(--text-muted)' }}>男</div>
        </div>
        <div style={{ textAlign: 'center', padding: '4px 12px', background: 'rgba(236,72,153,0.08)', border: '1px solid var(--border-light)', borderRadius: 6, minWidth: 80 }}>
          <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, color: '#ec4899', fontFamily: 'monospace' }}>♀ {p.femaleCount}</div>
          <div style={{ fontSize: 'var(--font-size-2xs)', color: 'var(--text-muted)' }}>女</div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 6, flex: 1, minHeight: 0 }}>
        <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
          <ChartLabel align="center">性别比例</ChartLabel>
          <RingChart
            data={genderData}
            colors={['#4a9eff', '#ec4899']}
            height={180}
            centerLabel={String(p.totalTeachers)}
            centerLabelSize={22}
            legendPosition="bottom"
          />
        </div>
        <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
          <ChartLabel align="center">年龄分布</ChartLabel>
          <BarChart data={ageData} height={180} barWidth="60%" showLabel />
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
          <BarChart data={t.titles} height={150} gridLeft="20%" barWidth="60%" showLabel />
        </div>
        <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
          <ChartLabel align="center">学历分布</ChartLabel>
          <BarChart data={p.education} height={150} gridLeft="15%" barWidth="60%" showLabel />
        </div>
      </div>
      <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
        <ChartLabel align="center">学科分布</ChartLabel>
        <BarChart data={t.subjects} height={140} gridLeft="14%" barWidth="55%" showLabel />
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
