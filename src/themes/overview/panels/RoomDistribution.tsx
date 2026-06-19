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
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
      <ChartLabel>功能室分布</ChartLabel>
      <div style={{ flex: 1, minHeight: 0 }}>
        <BarChart data={data.rooms.map((r) => ({ name: r.name, value: r.count }))} height={140} gridLeft="25%" gridBottom="12%" />
      </div>
    </div>
  )
}
