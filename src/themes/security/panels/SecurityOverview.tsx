import { useSecurityOverview } from '@/api/queries/security'
import NumberFlip from '@/components/ui/NumberFlip'
import StatusPanel from '@/components/ui/StatusPanel'

export default function SecurityOverview() {
  const { data, isLoading, error } = useSecurityOverview()
  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return <StatusPanel type="empty" />
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
      <NumberFlip label="监控摄像头" value={data.cameraCount} unit="个" />
      <NumberFlip label="门禁设备" value={data.accessDeviceCount} unit="个" />
      <NumberFlip label="今日告警" value={data.todayAlerts} unit="次" color="#ff6d00" />
      <NumberFlip label="今日访客" value={data.todayVisitors} unit="人" color="#00c853" />
    </div>
  )
}
