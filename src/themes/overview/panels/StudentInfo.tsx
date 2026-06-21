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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1, minHeight: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, justifyContent: 'center', flexShrink: 0 }}>
        <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1, fontFamily: 'monospace' }}>{data.totalStudents}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)' }}>在校学生</div>
          <div style={{ display: 'flex', gap: 10, fontSize: 'var(--font-size-sm)' }}>
            <span style={{ color: '#4a9eff', fontWeight: 600 }}>♂ {Math.round(data.maleRatio * 100)}%</span>
            <span style={{ color: '#ec4899', fontWeight: 600 }}>♀ {Math.round(data.femaleRatio * 100)}%</span>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
        {data.grades.map((g) => (
          <div
            key={g.name}
            style={{
              flex: 1,
              background: 'var(--panel-bg)',
              border: '1px solid var(--border-light)',
              borderRadius: 6,
              padding: '10px 6px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>{g.total}</div>
            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', marginBottom: 4 }}>{g.name} · 总人数</div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 12, fontSize: 'var(--font-size-md)' }}>
              <span style={{ color: '#4a9eff', fontWeight: 700 }}>♂ {g.male}</span>
              <span style={{ color: '#ec4899', fontWeight: 700 }}>♀ {g.female}</span>
            </div>
          </div>
        ))}
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <ChartLabel>年级人数对比</ChartLabel>
        <BarChart
          data={data.grades.map((g) => ({ name: g.name, value: g.total }))}
          height={150}
          horizontal={false}
          color="var(--accent)"
          gridTop={0}
        />
      </div>
    </div>
  )
}
