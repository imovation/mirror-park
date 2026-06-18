import { useAssetOverview } from '@/api/queries/overview'
import IconGrid from '@/components/ui/IconGrid'
import StatusPanel from '@/components/ui/StatusPanel'

export default function AssetOverview() {
  const { data, isLoading, error } = useAssetOverview()
  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return <StatusPanel type="empty" />

  return (
    <IconGrid items={[
      { id: 'pc', icon: '💻', label: '电脑', value: data.computers, unit: '台' },
      { id: 'proj', icon: '📽️', label: '投影仪', value: data.projectors, unit: '台' },
      { id: 'ac', icon: '❄️', label: '空调', value: data.acs, unit: '台' },
      { id: 'cam', icon: '📹', label: '摄像头', value: data.cameras, unit: '个' },
      { id: 'print', icon: '🖨️', label: '打印机', value: data.printers, unit: '台' },
      { id: 'door', icon: '🚪', label: '门禁', value: data.accessControls, unit: '个' }
    ]} />
  )
}
