import { useSecurityOverview } from '@/api/queries/security'
import TopMetricsCard from '@/components/ui/TopMetricsCard'

export default function SecurityTopMetrics() {
  const { data } = useSecurityOverview()

  if (!data) return null

  return (
    <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap' }}>
      <TopMetricsCard label="监控设备" value={data.cameraCount?.toString() ?? '-'} />
      <TopMetricsCard label="门禁设备" value={data.accessDeviceCount?.toString() ?? '-'} />
      <TopMetricsCard label="今日告警" value={data.todayAlerts?.toString() ?? '-'} />
      <TopMetricsCard label="今日访客" value={data.todayVisitors?.toString() ?? '-'} />
    </div>
  )
}
