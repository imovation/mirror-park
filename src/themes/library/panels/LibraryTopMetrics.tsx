import { useCollection, useBorrowStats, useLibraryVisitors } from '@/api/queries/library'
import TopMetricsCard from '@/components/ui/TopMetricsCard'
import { TOP_METRIC_PALETTE } from '@/config/metricColors'
import { formatNumber } from '@/utils/format'

const COLORS = [
  TOP_METRIC_PALETTE.yellow,
  TOP_METRIC_PALETTE.orange,
  TOP_METRIC_PALETTE.cyan,
  TOP_METRIC_PALETTE.pink,
  TOP_METRIC_PALETTE.lime,
]

export default function LibraryTopMetrics() {
  const { data: coll } = useCollection()
  const { data: borrow } = useBorrowStats()
  const { data: visitors } = useLibraryVisitors()

  if (!coll) return (
    <div style={{ display: 'flex', gap: 10, justifyContent: 'space-between', width: '100%' }}>
      {[1,2,3,4,5].map(i => (
        <div key={i} style={{ flex: 1, height: 64, background: 'var(--panel-bg)', borderRadius: 8, opacity: 0.4, borderLeft: `3px solid ${COLORS[i-1]}` }} />
      ))}
    </div>
  )

  return (
    <div style={{ display: 'flex', gap: 10, justifyContent: 'space-between', width: '100%' }}>
      <TopMetricsCard icon="book" label="馆藏纸质书" value={formatNumber(coll.paperBooks ?? 0)} valueColor={COLORS[0]} />
      <TopMetricsCard icon="library" label="在借图书" value={borrow ? formatNumber(borrow.totalBorrowed) : '-'} valueColor={COLORS[1]} />
      <TopMetricsCard icon="arrow-up" label="今日借阅" value={borrow ? formatNumber(borrow.todayBorrow) : '-'} valueColor={COLORS[2]} />
      <TopMetricsCard icon="enter" label="今日入馆" value={visitors ? formatNumber(visitors.todayVisitors) : '-'} valueColor={COLORS[3]} />
      <TopMetricsCard icon="tablet" label="电子图书" value={formatNumber(coll.ebooks ?? 0)} valueColor={COLORS[4]} />
    </div>
  )
}
