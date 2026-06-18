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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, height: '100%' }}>
      <div style={{ display: 'flex', gap: 8 }}>
        {data.grades.map((g) => (
          <div
            key={g.name}
            style={{
              flex: 1,
              background: 'var(--panel-bg)',
              border: '1px solid var(--border-light)',
              borderRadius: 6,
              padding: '8px 10px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>{g.name}</div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 12, fontSize: 11, color: 'var(--text-tertiary)' }}>
              <span>男 <span style={{ color: '#4a9eff', fontWeight: 600 }}>{g.male}</span></span>
              <span>女 <span style={{ color: '#ff6d00', fontWeight: 600 }}>{g.female}</span></span>
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--accent)', marginTop: 4 }}>{g.total}</div>
          </div>
        ))}
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <ChartLabel>年级人数对比</ChartLabel>
        <BarChart
          data={data.grades.map((g) => ({ name: g.name, value: g.total }))}
          horizontal={false}
          color="#4a9eff"
        />
      </div>
    </div>
  )
}
