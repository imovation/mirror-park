import { useSecurityOverview, useMonitorStatus } from '@/api/queries/security'
import TopMetricsCard from '@/components/ui/TopMetricsCard'
import { TOP_METRIC_PALETTE } from '@/config/metricColors'
import { formatNumber } from '@/utils/format'

const COLORS = [
  TOP_METRIC_PALETTE.orange,
  TOP_METRIC_PALETTE.green,
  TOP_METRIC_PALETTE.red,
  TOP_METRIC_PALETTE.purple,
  TOP_METRIC_PALETTE.yellow,
]

export default function SecurityTopMetrics() {
  const { data } = useSecurityOverview()
  const { data: monitor } = useMonitorStatus()

  if (!data) return null

  const onlineRate = monitor ? Math.round((monitor.online / monitor.total) * 100) : null

  return (
    <div style={{ display: 'flex', gap: 10, justifyContent: 'space-between', width: '100%' }}>
      <TopMetricsCard icon="camera" label="监控设备" value={formatNumber(data.cameraCount ?? 0)} valueColor={COLORS[0]} />
      <TopMetricsCard icon="signal" label="设备在线率" value={onlineRate !== null ? `${onlineRate}%` : '-'} valueColor={COLORS[1]} />
      <TopMetricsCard
        icon="alert"
        label="今日告警"
        value={formatNumber(data.todayAlerts ?? 0)}
        title="今日需要处理的实时告警事件数（不含已处理的设备离线提示）"
        valueColor={COLORS[2]}
      />
      <TopMetricsCard icon="users" label="今日访客" value={formatNumber(data.todayVisitors ?? 0)} valueColor={COLORS[3]} />
      <TopMetricsCard icon="lock" label="门禁设备" value={formatNumber(data.accessDeviceCount ?? 0)} valueColor={COLORS[4]} />
    </div>
  )
}
