import { useCollection, useBorrowStats, useLibraryVisitors } from '@/api/queries/library'
import TopMetricsCard from '@/components/ui/TopMetricsCard'
import { formatNumber } from '@/utils/format'

export default function LibraryTopMetrics() {
  const { data: coll } = useCollection()
  const { data: borrow } = useBorrowStats()
  const { data: visitors } = useLibraryVisitors()

  if (!coll) return null

  return (
    <div style={{ display: 'flex', gap: 24, justifyContent: 'center' }}>
      <TopMetricsCard label="馆藏纸质书" value={formatNumber(coll.paperBooks ?? 0)} />
      <TopMetricsCard label="在借图书" value={borrow ? formatNumber(borrow.totalBorrowed) : '-'} />
      <TopMetricsCard label="今日借阅" value={borrow ? formatNumber(borrow.todayBorrow) : '-'} />
      <TopMetricsCard label="今日入馆" value={visitors ? formatNumber(visitors.todayVisitors) : '-'} />
      <TopMetricsCard label="电子图书" value={formatNumber(coll.ebooks ?? 0)} />
    </div>
  )
}
