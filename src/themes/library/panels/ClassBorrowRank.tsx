import { useClassRank } from '@/api/queries/library'
import BarChart from '@/components/charts/BarChart'
import ScrollList from '@/components/ui/ScrollList'
import StatusPanel from '@/components/ui/StatusPanel'
import ChartLabel from '@/components/ui/ChartLabel'

const TOP3_COLORS = ['#f5222d', '#fa8c16', '#faad14']
const rankLabel = ['🥇', '🥈', '🥉']

const rankColor = (i: number) => TOP3_COLORS[i] || undefined

export default function ClassBorrowRank() {
  const { data, isLoading, error } = useClassRank()
  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return <StatusPanel type="empty" />
  const barData = data.classRank.slice(0, 8)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1, minHeight: 0, overflow: 'auto' }}>
      <div style={{ flex: 1, minHeight: 0 }}>
        <ChartLabel>班级借阅量排行</ChartLabel>
        <BarChart data={barData} height={130} colors={barData.map((_, i) => rankColor(i))} />
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <ChartLabel>阅读之星</ChartLabel>
        <ScrollList
          items={data.readingStars.map((s, i) => ({
            id: `star-${i}`,
            content: (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{
                    width: 18, height: 18, borderRadius: '50%',
                    background: TOP3_COLORS[i] || 'var(--text-muted)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontSize: 10, fontWeight: 700, flexShrink: 0,
                  }}>{i + 1}</span>
                  <span style={{ fontWeight: i < 3 ? 700 : 400, fontSize: i < 3 ? 13 : 12 }}>
                    {rankLabel[i] && <span style={{ marginRight: 2 }}>{rankLabel[i]}</span>}
                    {s.name}
                  </span>
                </div>
                <span style={{ color: 'var(--text-muted)', fontSize: 10, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.className} · {s.count}册</span>
              </div>
            ),
          }))}
        />
      </div>
    </div>
  )
}
