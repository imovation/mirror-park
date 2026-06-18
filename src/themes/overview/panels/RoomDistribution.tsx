import { useRoomDistribution } from '@/api/queries/overview'
import BarChart from '@/components/charts/BarChart'
import StatusPanel from '@/components/ui/StatusPanel'
import ChartLabel from '@/components/ui/ChartLabel'

export default function RoomDistribution() {
  const { data, isLoading, error } = useRoomDistribution()

  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return <StatusPanel type="empty" />

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <ChartLabel>功能室分布</ChartLabel>
      <div style={{ flex: 1 }}>
        <BarChart data={data.rooms.map((r) => ({ name: r.name, value: r.count }))} height={200} color="#00c853" />
      </div>
    </div>
  )
}
