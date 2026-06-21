import { useDeviceData } from '@/api/queries/academics'
import RingChart from '@/components/charts/RingChart'
import PieChart from '@/components/charts/PieChart'
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
            colors={['var(--color-success)', 'var(--color-warning)', 'var(--color-danger)']}
            centerLabel={`${data.online}/${data.total}`}
            height={120}
          />
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <ChartLabel align="center">设备类型分布</ChartLabel>
          <PieChart data={data.typeDistribution} height={120} legendPosition="bottom" />
        </div>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <ChartLabel>设备状态概览</ChartLabel>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, padding: '0 4px' }}>
          <div style={{ textAlign: 'center', background: 'var(--panel-bg)', borderRadius: 6, padding: 8 }}>
            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>总设备</div>
            <div style={{ fontSize: 'var(--font-size-xxl)', fontWeight: 700, color: 'var(--text-primary)' }}>{data.total}</div>
          </div>
          <div style={{ textAlign: 'center', background: 'var(--panel-bg)', borderRadius: 6, padding: 8 }}>
            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>在线率</div>
            <div style={{ fontSize: 'var(--font-size-xxl)', fontWeight: 700, color: 'var(--color-success)' }}>{Math.round((data.online / data.total) * 100)}%</div>
          </div>
        </div>
      </div>
    </div>
  )
}
