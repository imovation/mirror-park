import { useSecurityOverview } from '@/api/queries/security'
import TopMetricsCard from '@/components/ui/TopMetricsCard'
import { formatNumber } from '@/utils/format'

export default function SecurityTopMetrics() {
  const { data } = useSecurityOverview()

  if (!data) return null

  return (
    <div style={{ display: 'flex', gap: 24, justifyContent: 'center' }}>
      <TopMetricsCard label="监控设备" value={formatNumber(data.cameraCount ?? 0)} />
      <TopMetricsCard label="门禁设备" value={formatNumber(data.accessDeviceCount ?? 0)} />
      <TopMetricsCard label="今日告警" value={formatNumber(data.todayAlerts ?? 0)} />
      <TopMetricsCard label="今日访客" value={formatNumber(data.todayVisitors ?? 0)} />
    </div>
  )
}
