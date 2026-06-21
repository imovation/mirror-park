import { useSecurityOverview, useMonitorStatus } from '@/api/queries/security'
import TopMetricsCard from '@/components/ui/TopMetricsCard'
import { getMetricShades } from '@/config/metricColors'
import { formatNumber } from '@/utils/format'

const SHADES = getMetricShades()

export default function SecurityTopMetrics() {
  const { data } = useSecurityOverview()
  const { data: monitor } = useMonitorStatus()

  if (!data) return null

  const onlineRate = monitor ? Math.round((monitor.online / monitor.total) * 100) : null

  return (
    <div style={{ display: 'flex', gap: 10, justifyContent: 'space-between', width: '100%' }}>
      <TopMetricsCard icon="camera" label="监控设备" value={formatNumber(data.cameraCount ?? 0)} valueColor={SHADES[0]} />
      <TopMetricsCard icon="signal" label="设备在线率" value={onlineRate !== null ? `${onlineRate}%` : '-'} valueColor={SHADES[1]} />
      <TopMetricsCard
        icon="alert"
        label="今日告警"
        value={formatNumber(data.todayAlerts ?? 0)}
        title="今日需要处理的实时告警事件数（不含已处理的设备离线提示）"
        valueColor={SHADES[2]}
      />
      <TopMetricsCard icon="users" label="今日访客" value={formatNumber(data.todayVisitors ?? 0)} valueColor={SHADES[3]} />
      <TopMetricsCard icon="lock" label="门禁设备" value={formatNumber(data.accessDeviceCount ?? 0)} valueColor={SHADES[4]} />
    </div>
  )
}
