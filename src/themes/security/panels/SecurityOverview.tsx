import { useSecurityOverview } from '@/api/queries/security'
import CompactStatsRow from '@/components/ui/CompactStatsRow'
import StatusPanel from '@/components/ui/StatusPanel'

export default function SecurityOverview() {
  const { data, isLoading, error } = useSecurityOverview()
  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return <StatusPanel type="empty" />

  return (
    <CompactStatsRow items={[
      { id: 'cam', label: '监控摄像头', value: data.cameraCount, unit: '个', color: 'var(--accent)' },
      { id: 'door', label: '门禁设备', value: data.accessDeviceCount, unit: '个' },
      { id: 'alert', label: '今日告警', value: data.todayAlerts, unit: '次', color: 'var(--color-danger)' },
      { id: 'visit', label: '今日访客', value: data.todayVisitors, unit: '人', color: 'var(--color-success)' }
    ]} />
  )
}
