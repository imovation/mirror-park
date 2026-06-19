import { useHotBooks, useClassRank } from '@/api/queries/library'
import BarChart from '@/components/charts/BarChart'
import PieChart from '@/components/charts/PieChart'
import ScrollList from '@/components/ui/ScrollList'
import StatusPanel from '@/components/ui/StatusPanel'
import ChartLabel from '@/components/ui/ChartLabel'

const TOP3_COLORS = ['#f5222d', '#fa8c16', '#faad14']
const rankLabel = ['🥇', '🥈', '🥉']

export default function BookBorrowRank() {
  const hotQuery = useHotBooks()
  const rankQuery = useClassRank()

  if (hotQuery.isLoading || rankQuery.isLoading) return <StatusPanel type="loading" />
  if (hotQuery.error || rankQuery.error) return <StatusPanel type="error" />
  if (!hotQuery.data || !rankQuery.data) return <StatusPanel type="empty" />

  const hot = hotQuery.data
  const rank = rankQuery.data

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, flex: 1, minHeight: 0 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minHeight: 0 }}>
        <ChartLabel align="center">借阅量 TOP10</ChartLabel>
        <div style={{ flex: 1, minHeight: 0 }}>
          <BarChart data={hot.top10.map(b => ({ name: b.name, value: b.count }))} height={120} gridLeft={70} />
        </div>
        <ChartLabel align="center">各类别借阅占比</ChartLabel>
        <div style={{ flex: 1, minHeight: 0 }}>
          <PieChart data={hot.categoryRatio} height={120} radius={['0', '40%']} />
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minHeight: 0 }}>
        <ChartLabel align="center">班级借阅量排行</ChartLabel>
        <div style={{ flex: 1, minHeight: 0 }}>
          <BarChart
            data={rank.classRank.slice(0, 8)}
            height={130}
            colors={rank.classRank.slice(0, 8).map((_, i) => TOP3_COLORS[i] || undefined)}
            gridLeft="20%"
          />
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <ChartLabel align="center">阅读之星</ChartLabel>
          <ScrollList
            maxHeight={100}
            items={rank.readingStars.slice(0, 4).map((s, i) => ({
              id: `star-${i}`,
              content: (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{
                      width: 16, height: 16, borderRadius: '50%',
                      background: TOP3_COLORS[i] || 'var(--text-muted)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#fff', fontSize: 'var(--font-size-2xs)', fontWeight: 700, flexShrink: 0,
                    }}>{i + 1}</span>
                    <span>{rankLabel[i]}{s.name}</span>
                  </div>
                  <span style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-xs)' }}>{s.className} · {s.count}册</span>
                </div>
              ),
            }))}
          />
        </div>
      </div>
    </div>
  )
}
