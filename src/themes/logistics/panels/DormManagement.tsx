import { useDormData } from '@/api/queries/logistics'
import NumberFlip from '@/components/ui/NumberFlip'
import BarChart from '@/components/charts/BarChart'
import StatusPanel from '@/components/ui/StatusPanel'
import ChartLabel from '@/components/ui/ChartLabel'

export default function DormManagement() {
  const { data, isLoading, error } = useDormData()
  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return <StatusPanel type="empty" />

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1, minHeight: 0 }}>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexShrink: 0 }}>
        <NumberFlip label="在住人数" value={data.occupied} unit="人" color="var(--accent)" />
        <NumberFlip label="空床位数" value={data.available} unit="床" color="var(--color-success)" />
        <NumberFlip label="维修中" value={data.maintenance} unit="间" color="var(--color-warning)" />
      </div>
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <ChartLabel align="center">各楼栋入住率</ChartLabel>
        <div style={{ flex: 1, minHeight: 0 }}>
          <BarChart data={data.buildingOccupancy} height={200} />
        </div>
      </div>
    </div>
  )
}
