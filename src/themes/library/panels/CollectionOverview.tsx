import { useCollection } from '@/api/queries/library'
import CompactStatsRow from '@/components/ui/CompactStatsRow'
import StatusPanel from '@/components/ui/StatusPanel'

export default function CollectionOverview() {
  const { data, isLoading, error } = useCollection()
  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return <StatusPanel type="empty" />

  return (
    <CompactStatsRow items={[
      { id: 'paper', label: '纸质图书', value: data.paperBooks, unit: '册', color: 'var(--accent)' },
      { id: 'ebook', label: '电子图书', value: data.ebooks, unit: '册', color: 'var(--color-success)' },
      { id: 'journal', label: '期刊种类', value: data.journals, unit: '种' },
      { id: 'news', label: '报纸种类', value: data.newspapers, unit: '种' }
    ]} />
  )
}
