import { useCollection } from '@/api/queries/library'
import TopMetricsCard from '@/components/ui/TopMetricsCard'
import { formatNumber } from '@/utils/format'

export default function LibraryTopMetrics() {
  const { data } = useCollection()

  if (!data) return null

  return (
    <div style={{ display: 'flex', gap: 24, justifyContent: 'center' }}>
      <TopMetricsCard label="纸质图书" value={formatNumber(data.paperBooks ?? 0)} />
      <TopMetricsCard label="电子图书" value={formatNumber(data.ebooks ?? 0)} />
      <TopMetricsCard label="期刊种类" value={formatNumber(data.journals ?? 0)} />
      <TopMetricsCard label="报纸种类" value={formatNumber(data.newspapers ?? 0)} />
    </div>
  )
}
