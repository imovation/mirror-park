import { useClassRank, useHotBooks } from '@/api/queries/library'
import ScrollList from '@/components/ui/ScrollList'
import StatusPanel from '@/components/ui/StatusPanel'
import ChartLabel from '@/components/ui/ChartLabel'

const TOP3_COLORS = ['var(--color-danger)', 'var(--color-warning)', '#faad14']
const rankLabel = ['🥇', '🥈', '🥉']

export default function ReadingStars() {
  const rankQuery = useClassRank()
  const hotQuery = useHotBooks()

  if (rankQuery.isLoading || hotQuery.isLoading) return <StatusPanel type="loading" />
  if (rankQuery.error || hotQuery.error) return <StatusPanel type="error" />
  if (!rankQuery.data || !hotQuery.data) return <StatusPanel type="empty" />

  const rank = rankQuery.data
  const hot = hotQuery.data

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1, minHeight: 0 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minHeight: 0 }}>
        <ChartLabel align="center">阅读之星</ChartLabel>
        <div style={{ flexShrink: 0 }}>
          <ScrollList
            maxHeight={160}
            items={rank.readingStars.slice(0, 4).map((s, i) => ({
              id: `star-${i}`,
              content: (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{
                      width: 16, height: 16, borderRadius: '50%',
                      background: TOP3_COLORS[i] || 'var(--text-muted)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'var(--text-primary)', fontSize: 'var(--font-size-2xs)', fontWeight: 700, flexShrink: 0,
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
      <div style={{ height: 1, background: 'var(--border)', margin: '4px 0' }} />
      {hot.recommendBooks?.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minHeight: 0 }}>
          <ChartLabel align="center">好书推荐</ChartLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '0 4px', flex: 1 }}>
            {hot.recommendBooks.slice(0, 5).map((b, i) => (
              <div key={i} style={{ display: 'flex', gap: 6, fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', padding: '4px 0' }}>
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
  )
}
