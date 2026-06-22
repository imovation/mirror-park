import { CHART_PALETTE, HUE_ROTATION } from '@/config/chartTheme'
import { useMonitorStatus } from '@/api/queries/security'
import RingChart from '@/components/charts/RingChart'
import BarChart from '@/components/charts/BarChart'
import GaugeChart from '@/components/charts/GaugeChart'
import NumberFlip from '@/components/ui/NumberFlip'
import StatusPanel from '@/components/ui/StatusPanel'
import ChartLabel from '@/components/ui/ChartLabel'

export default function MonitorStatus() {
  const { data, isLoading, error } = useMonitorStatus()
  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return <StatusPanel type="empty" />

  const onlineRate = data.total > 0 ? Math.round((data.online / data.total) * 100) : 0
  return (
    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexShrink: 0 }}>
        <NumberFlip label="设备总数" value={data.total} unit="台" color="var(--accent)" fontSize="var(--font-size-lg)" />
        <NumberFlip label="在线设备" value={data.online} unit="台" color="var(--color-success)" fontSize="var(--font-size-lg)" />
        <NumberFlip label="在线率" value={onlineRate} unit="%" color="var(--color-warning)" fontSize="var(--font-size-lg)" />
      </div>
      <div style={{ display: 'flex', gap: 6, flex: 1, minHeight: 0 }}>
        <div style={{ flex: 1, minHeight: 0 }}>
          <ChartLabel align="center">设备状态</ChartLabel>
          <RingChart
            data={[
              { name: '在线', value: data.online },
              { name: '离线', value: data.offline },
              { name: '故障', value: data.faulty },
            ]}
            colors={[CHART_PALETTE.semantic.success, CHART_PALETTE.semantic.warning, CHART_PALETTE.semantic.danger]}
            centerLabel={`${data.online}/${data.total}`}
            height={120}
            legendPosition="bottom"
          />
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <ChartLabel align="center">监控覆盖率</ChartLabel>
          <GaugeChart value={Math.round(data.coverage * 100)} name="覆盖率" height={120} />
        </div>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <ChartLabel>各区域摄像头分布</ChartLabel>
        <div style={{ flex: 1, minHeight: 0 }}>
          <BarChart data={data.regionDistribution} color={HUE_ROTATION.r3[2]} height={140} barWidth="50%" />
        </div>
      </div>
    </div>
  )
}
