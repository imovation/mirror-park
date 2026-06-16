import { useClassRank } from '@/api/queries/library'
import BarChart from '@/components/charts/BarChart'
import ScrollList from '@/components/ui/ScrollList'

export default function ClassBorrowRank() {
  const { data, isLoading, error } = useClassRank()
  if (isLoading) return <div style={{ color: '#6b7280', fontSize: '0.75rem' }}>加载中...</div>
  if (error) return <div style={{ color: '#ef4444', fontSize: '0.75rem' }}>数据加载失败</div>
  if (!data) return null
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 2 }}>班级借阅量排行</div>
        <BarChart data={data.classRank.slice(0, 8)} height={130} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 2 }}>阅读之星</div>
        <ScrollList
          items={data.readingStars.map((s, i) => ({
            id: `star-${i}`,
            content: (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{s.name}</span>
                <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10 }}>{s.className} · {s.count}册</span>
              </div>
            ),
          }))}
          maxHeight={90}
        />
      </div>
    </div>
  )
}
