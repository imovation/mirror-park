import { useSecurityOverview } from '@/api/queries/security'
import NumberFlip from '@/components/ui/NumberFlip'

export default function SecurityOverview() {
  const { data, isLoading, error } = useSecurityOverview()
  if (isLoading) return <div style={{ color: '#6b7280', fontSize: '0.75rem' }}>加载中...</div>
  if (error) return <div style={{ color: '#ef4444', fontSize: '0.75rem' }}>数据加载失败</div>
  if (!data) return null
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
      <NumberFlip label="监控摄像头" value={data.cameraCount} unit="个" />
      <NumberFlip label="门禁设备" value={data.accessDeviceCount} unit="个" />
      <NumberFlip label="今日告警" value={data.todayAlerts} unit="次" color="#ff6d00" />
      <NumberFlip label="今日访客" value={data.todayVisitors} unit="人" color="#00c853" />
    </div>
  )
}
