import { useStudentInfo } from '@/api/queries/overview'
import SankeyChart from '@/components/charts/SankeyChart'
import StatusPanel from '@/components/ui/StatusPanel'
import ChartLabel from '@/components/ui/ChartLabel'

export default function StudentInfo() {
  const { data, isLoading, error } = useStudentInfo()

  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return null

  const sankeyLinks = data.grades.flatMap((g) => [
    { source: '全校学生', target: g.name, value: g.total },
    { source: g.name, target: `男 (${g.name})`, value: g.male },
    { source: g.name, target: `女 (${g.name})`, value: g.female },
  ])
  const categories = ['全校学生', ...data.grades.map(g => g.name), ...data.grades.map(g => `男 (${g.name})`), ...data.grades.map(g => `女 (${g.name})`)]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ flex: 1 }}>
        <ChartLabel>学生分布</ChartLabel>
        <SankeyChart data={sankeyLinks} categories={categories} height={220} />
      </div>
    </div>
  )
}
