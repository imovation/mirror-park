import { useFunctionalRoomDist } from '@/api/queries/overview'
import RankList from '@/components/ui/RankList'
import StatusPanel from '@/components/ui/StatusPanel'

export default function FunctionalRooms() {
  const { data, isLoading, error } = useFunctionalRoomDist()
  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return <StatusPanel type="empty" />

  const rankItems = data.rooms.map((r, i) => ({
    id: `room-${i}`,
    name: r.name,
    value: r.value,
    unit: '间',
    color: 'var(--accent)'
  }))

  return <RankList items={rankItems} maxHeight={120} />
}
