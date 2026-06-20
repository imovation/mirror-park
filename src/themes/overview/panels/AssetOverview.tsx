import { useAssetData } from '@/api/queries/overview'
import type { AssetData } from '@/api/queries/overview'
import StatCard from '@/components/ui/StatCard'
import RingChart from '@/components/charts/RingChart'
import StatusPanel from '@/components/ui/StatusPanel'
import ChartLabel from '@/components/ui/ChartLabel'

const ASSETS: { key: keyof AssetData; label: string; color: string }[] = [
  { key: 'computers', label: '电脑', color: '#4a9eff' },
  { key: 'projectors', label: '投影仪', color: '#00c853' },
  { key: 'airConditioners', label: '空调', color: '#ff6d00' },
  { key: 'cameras', label: '摄像头', color: '#aa00ff' },
  { key: 'printers', label: '打印机', color: '#ffc107' },
  { key: 'doorLocks', label: '门禁锁', color: '#00bcd4' },
]

const RING_DATA = [
  { name: '电脑', value: 580 },
  { name: '投影仪', value: 120 },
  { name: '空调', value: 260 },
  { name: '摄像头', value: 430 },
  { name: '打印机', value: 85 },
  { name: '门禁锁', value: 65 },
]

export default function AssetOverview() {
  const { data, isLoading, error } = useAssetData()

  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return <StatusPanel type="empty" />

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1, minHeight: 0 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, flexShrink: 0, padding: 4 }}>
        {ASSETS.map((asset) => (
          <StatCard
            key={asset.key}
            icon={asset.label[0]}
            iconColor={asset.color}
            value={String(data[asset.key])}
            label=""
            sublabel={asset.label}
          />
        ))}
      </div>
      <div style={{ flexShrink: 0 }}>
        <ChartLabel>设备类型占比</ChartLabel>
        <RingChart data={RING_DATA} height={130} />
      </div>
    </div>
  )
}
