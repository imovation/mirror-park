import { useMonitorStatus } from '@/api/queries/security'
import RingChart from '@/components/charts/RingChart'
import BarChart from '@/components/charts/BarChart'
import GaugeChart from '@/components/charts/GaugeChart'
import StatusPanel from '@/components/ui/StatusPanel'
import ChartLabel from '@/components/ui/ChartLabel'

export default function MonitorStatus() {
  const { data, isLoading, error } = useMonitorStatus()
  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return <StatusPanel type="empty" />
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', gap: 8 }}>
        <div style={{ flex: 1 }}>
          <RingChart
            data={[{ name: '在线', value: data.online }, { name: '离线', value: data.offline }, { name: '故障', value: data.faulty }]}
            colors={['#00c853', '#ffc107', '#ff1744']}
            centerLabel={`${data.online}/${data.total}`}
          />
        </div>
        <div style={{ flex: 1 }}>
          <ChartLabel align="center">监控覆盖率</ChartLabel>
          <GaugeChart value={Math.round(data.coverage * 100)} name="覆盖率" />
        </div>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <ChartLabel>各区域摄像头分布</ChartLabel>
        <BarChart data={data.regionDistribution} />
      </div>
    </div>
  )
}
