import { useSecurityOverview, useMonitorStatus } from '@/api/queries/security'
import TopMetricsCard from '@/components/ui/TopMetricsCard'
import { formatNumber } from '@/utils/format'

export default function SecurityTopMetrics() {
  const { data } = useSecurityOverview()
  const { data: monitor } = useMonitorStatus()

  if (!data) return null

  const onlineRate = monitor ? Math.round((monitor.online / monitor.total) * 100) : null

  return (
    <div style={{ display: 'flex', gap: 24, justifyContent: 'center' }}>
      <TopMetricsCard label="监控设备" value={formatNumber(data.cameraCount ?? 0)} />
      <TopMetricsCard label="设备在线率" value={onlineRate !== null ? `${onlineRate}%` : '-'} />
      <TopMetricsCard label="今日告警" value={formatNumber(data.todayAlerts ?? 0)} />
      <TopMetricsCard label="今日访客" value={formatNumber(data.todayVisitors ?? 0)} />
      <TopMetricsCard label="门禁设备" value={formatNumber(data.accessDeviceCount ?? 0)} />
    </div>
  )
}
