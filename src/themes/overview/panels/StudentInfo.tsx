import { useStudentInfo } from '@/api/queries/overview'
import BarChart from '@/components/charts/BarChart'
import StatusPanel from '@/components/ui/StatusPanel'
import { useMemo } from 'react'

export default function StudentInfo() {
  const { data, isLoading, error } = useStudentInfo()
  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return <StatusPanel type="empty" />

  const totalMale = useMemo(() => data.grades.reduce((s, g) => s + g.male, 0), [data])
  const totalFemale = useMemo(() => data.grades.reduce((s, g) => s + g.female, 0), [data])

  const chartData = data.grades.map(g => ({
    name: g.name,
    value: g.total
  }))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div style={{ display: 'flex', justifyContent: 'space-around', padding: '4px 0', borderBottom: '1px dashed var(--border)' }}>
        <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
          男生 <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>{totalMale}</span>
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
          女生 <span style={{ color: 'var(--color-warning)', fontWeight: 'bold' }}>{totalFemale}</span>
        </div>
      </div>
      <BarChart data={chartData} height={120} horizontal={false} color="var(--accent)" />
    </div>
  )
}
