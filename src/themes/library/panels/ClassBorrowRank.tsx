import { useClassRank } from '@/api/queries/library'
import BarChart from '@/components/charts/BarChart'
import ScrollList from '@/components/ui/ScrollList'
import StatusPanel from '@/components/ui/StatusPanel'
import ChartLabel from '@/components/ui/ChartLabel'

export default function ClassBorrowRank() {
  const { data, isLoading, error } = useClassRank()
  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return <StatusPanel type="empty" />
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ flex: 1 }}>
        <ChartLabel>班级借阅量排行</ChartLabel>
        <BarChart data={data.classRank.slice(0, 8)} />
      </div>
      <div style={{ flex: 1 }}>
        <ChartLabel>阅读之星</ChartLabel>
        <ScrollList
          items={data.readingStars.map((s, i) => ({
            id: `star-${i}`,
            content: (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{s.name}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: 10 }}>{s.className} · {s.count}册</span>
              </div>
            ),
          }))}
          maxHeight={90}
        />
      </div>
    </div>
  )
}
