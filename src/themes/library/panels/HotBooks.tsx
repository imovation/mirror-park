import { useHotBooks } from '@/api/queries/library'
import BarChart from '@/components/charts/BarChart'
import PieChart from '@/components/charts/PieChart'
import CardCarousel from '@/components/ui/CardCarousel'
import StatusPanel from '@/components/ui/StatusPanel'
import ChartLabel from '@/components/ui/ChartLabel'

export default function HotBooks() {
  const { data, isLoading, error } = useHotBooks()
  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return <StatusPanel type="empty" />
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, height: '100%' }}>
      <div style={{ flex: 1, minHeight: 0 }}>
        <ChartLabel>借阅量 TOP10</ChartLabel>
        <BarChart data={data.top10.map(b => ({ name: b.name, value: b.count }))} />
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <ChartLabel>各类别借阅占比</ChartLabel>
        <PieChart data={data.categoryRatio} />
      </div>
      <ChartLabel>推荐图书</ChartLabel>
      <CardCarousel
        items={data.recommendBooks.map((b, i) => ({
          id: `rec-${i}`,
          title: b.name,
          subtitle: `作者: ${b.author}`,
        }))}
        maxHeight={90}
      />
    </div>
  )
}
