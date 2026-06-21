import { CHART_PALETTE } from '@/config/chartTheme'
import { useStudentInfo } from '@/api/queries/overview'
import BarChart from '@/components/charts/BarChart'
import StatusPanel from '@/components/ui/StatusPanel'
import ChartLabel from '@/components/ui/ChartLabel'

export default function StudentInfo() {
  const { data, isLoading, error } = useStudentInfo()

  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return <StatusPanel type="empty" />

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1, minHeight: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexShrink: 0, padding: '4px 8px', background: 'var(--panel-bg)', borderRadius: 6 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 'var(--font-size-xxl)', fontWeight: 700, color: 'var(--accent)' }}>{data.totalStudents}</div>
          <div style={{ fontSize: 'var(--font-size-2xs)', color: 'var(--text-muted)' }}>在校学生</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, color: 'var(--text-primary)' }}>♂ {Math.round(data.maleRatio * 100)}%</div>
          <div style={{ fontSize: 'var(--font-size-2xs)', color: 'var(--text-muted)' }}>男生</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, color: 'var(--text-primary)' }}>♀ {Math.round(data.femaleRatio * 100)}%</div>
          <div style={{ fontSize: 'var(--font-size-2xs)', color: 'var(--text-muted)' }}>女生</div>
        </div>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <ChartLabel align="center">年级人数对比</ChartLabel>
        <BarChart data={data.grades.map(g => ({ name: g.name, value: g.male + g.female }))} colors={CHART_PALETTE.dark} height={160} horizontal />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, flexShrink: 0 }}>
        {data.grades.map((g) => (
          <div
            key={g.name}
            style={{
              background: 'var(--panel-bg)',
              border: '1px solid var(--border-light)',
              borderRadius: 6,
              padding: '6px 4px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>{g.total}</div>
            <div style={{ fontSize: 'var(--font-size-2xs)', color: 'var(--text-muted)', marginBottom: 2 }}>{g.name} · 总人数</div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, fontSize: 'var(--font-size-sm)' }}>
              <span style={{ color: 'var(--accent)', fontWeight: 700 }}>♂ {g.male}</span>
              <span style={{ color: 'var(--color-chart-5)', fontWeight: 700 }}>♀ {g.female}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
