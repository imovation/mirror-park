import { useHotBooks, useClassRank } from '@/api/queries/library'
import BarChart from '@/components/charts/BarChart'
import ScrollList from '@/components/ui/ScrollList'
import StatusPanel from '@/components/ui/StatusPanel'
import ChartLabel from '@/components/ui/ChartLabel'

const TOP3_COLORS = ['var(--color-danger)', 'var(--color-warning)', '#faad14']
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
          <BarChart data={hot.top10.map(b => ({ name: b.name, value: b.count }))} height={200} gridLeft={70} tooltip={false} />
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minHeight: 0 }}>
        <ChartLabel align="center">班级借阅量排行</ChartLabel>
        <div style={{ flexShrink: 0 }}>
          <BarChart
            data={rank.classRank.slice(0, 8)}
            height={130}
            colors={rank.classRank.slice(0, 8).map((_, i) => TOP3_COLORS[i] || undefined)}
            gridLeft="20%"
            tooltip={false}
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
        {hot.recommendBooks?.length > 0 && (
          <div style={{ flexShrink: 0 }}>
            <ChartLabel align="center">好书推荐</ChartLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '0 4px' }}>
              {hot.recommendBooks.slice(0, 3).map((b, i) => (
                <div key={i} style={{ display: 'flex', gap: 6, fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
                  <span style={{ color: 'var(--accent)', flexShrink: 0 }}>《</span>
                  <span style={{ color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.name}</span>
                  <span style={{ flexShrink: 0 }}>》</span>
                  <span style={{ marginLeft: 'auto', flexShrink: 0 }}>{b.author}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
