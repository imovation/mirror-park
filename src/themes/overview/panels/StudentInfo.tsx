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
      <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
        {data.grades.map((g) => (
          <div
            key={g.name}
            style={{
              flex: 1,
              background: 'rgba(74,158,255,0.06)',
              border: '1px solid var(--border-light)',
              borderRadius: 6,
              padding: '8px 6px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>{g.total}</div>
            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', marginBottom: 4 }}>{g.name} · 总人数</div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 12, fontSize: 'var(--font-size-md)' }}>
              <span style={{ color: '#60a5fa', fontWeight: 700 }}>♂ {g.male}</span>
              <span style={{ color: '#f472b6', fontWeight: 700 }}>♀ {g.female}</span>
            </div>
          </div>
        ))}
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <ChartLabel>年级人数对比</ChartLabel>
        <BarChart
          data={data.grades.map((g) => ({ name: g.name, value: g.total }))}
          height={120}
          horizontal={false}
          color="#4a9eff"
          gridTop={0}
        />
      </div>
    </div>
  )
}
