import { useHotBooks } from '@/api/queries/library'
import BarChart from '@/components/charts/BarChart'
import PieChart from '@/components/charts/PieChart'
import CardCarousel from '@/components/ui/CardCarousel'

export default function HotBooks() {
  const { data, isLoading, error } = useHotBooks()
  if (isLoading) return <div style={{ color: '#6b7280', fontSize: '0.75rem' }}>加载中...</div>
  if (error) return <div style={{ color: '#ef4444', fontSize: '0.75rem' }}>数据加载失败</div>
  if (!data) return null
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 2 }}>借阅量 TOP10</div>
        <BarChart data={data.top10.map(b => ({ name: b.name, value: b.count }))} height={160} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 2 }}>各类别借阅占比</div>
        <PieChart data={data.categoryRatio} height={150} />
      </div>
      <div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 2 }}>推荐图书</div>
        <CardCarousel
          items={data.recommendBooks.map((b, i) => ({
            id: `rec-${i}`,
            title: b.name,
            subtitle: `作者: ${b.author}`,
          }))}
          maxHeight={120}
        />
      </div>
    </div>
  )
}
