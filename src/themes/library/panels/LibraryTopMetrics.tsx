import { useCollection } from '@/api/queries/library'
import TopMetricsCard from '@/components/ui/TopMetricsCard'

export default function LibraryTopMetrics() {
  const { data } = useCollection()

  if (!data) return null

  return (
    <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap' }}>
      <TopMetricsCard label="纸质图书" value={data.paperBooks?.toLocaleString() ?? '-'} />
      <TopMetricsCard label="电子图书" value={data.ebooks?.toLocaleString() ?? '-'} />
      <TopMetricsCard label="期刊种类" value={data.journals?.toString() ?? '-'} />
      <TopMetricsCard label="报纸种类" value={data.newspapers?.toString() ?? '-'} />
    </div>
  )
}
