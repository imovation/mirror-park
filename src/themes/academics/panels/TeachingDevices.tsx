import { useDeviceData } from '@/api/queries/academics'
import RingChart from '@/components/charts/RingChart'
import PieChart from '@/components/charts/PieChart'
import ScrollList from '@/components/ui/ScrollList'
import StatusPanel from '@/components/ui/StatusPanel'
import ChartLabel from '@/components/ui/ChartLabel'

export default function TeachingDevices() {
  const { data, isLoading, error } = useDeviceData()
  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return <StatusPanel type="empty" />
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1, minHeight: 0 }}>
      <div style={{ display: 'flex', gap: 6, flex: 1, minHeight: 0 }}>
        <div style={{ flex: 1, minHeight: 0 }}>
          <ChartLabel align="center">设备状态</ChartLabel>
          <RingChart
            data={[
              { name: '在线', value: data.online },
              { name: '离线', value: data.offline },
              { name: '故障', value: data.faulty },
            ]}
            colors={['#00c853', '#ffc107', '#ff1744']}
            centerLabel={`${data.online}/${data.total}`}
            height={120}
          />
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <ChartLabel align="center">设备类型分布</ChartLabel>
          <PieChart data={data.typeDistribution} height={120} />
        </div>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <ChartLabel>设备明细</ChartLabel>
        <ScrollList
          maxHeight={120}
          items={data.typeDistribution.map((d, i) => ({
            id: `dev-${i}`,
            content: (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{d.name}</span>
                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>{d.value} 台</span>
              </div>
            ),
          }))}
        />
      </div>
    </div>
  )
}
