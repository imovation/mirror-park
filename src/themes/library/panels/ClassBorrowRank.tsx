import { useClassRank } from '@/api/queries/library'
import RankList from '@/components/ui/RankList'
import StatusPanel from '@/components/ui/StatusPanel'

export default function ClassBorrowRank() {
  const { data, isLoading, error } = useClassRank()
  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return <StatusPanel type="empty" />

  const rankItems = data.classRank.slice(0, 8).map((c, i) => ({
    id: `class-${i}`,
    name: c.name,
    value: c.value,
    unit: '册',
    color: 'var(--accent)'
  }))

  return <RankList items={rankItems} maxHeight={220} />
}
