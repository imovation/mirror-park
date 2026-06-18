import { useAssetData } from '@/api/queries/overview'
import type { AssetData } from '@/api/queries/overview'
import StatusPanel from '@/components/ui/StatusPanel'

const ASSETS: { key: keyof AssetData; label: string; color: string }[] = [
  { key: 'computers', label: '电脑', color: '#4a9eff' },
  { key: 'projectors', label: '投影仪', color: '#00c853' },
  { key: 'airConditioners', label: '空调', color: '#ff6d00' },
  { key: 'cameras', label: '摄像头', color: '#aa00ff' },
  { key: 'printers', label: '打印机', color: '#ffc107' },
  { key: 'doorLocks', label: '门禁锁', color: '#00bcd4' },
]

export default function AssetOverview() {
  const { data, isLoading, error } = useAssetData()

  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return <StatusPanel type="empty" />

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, flex: 1, minHeight: 0, overflow: 'auto' }}>
      {ASSETS.map((asset) => (
        <div
          key={asset.key}
          style={{
            background: 'var(--panel-bg)',
            border: '1px solid var(--border-light)',
            borderRadius: 6,
            padding: '10px 8px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: `${asset.color}22`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 13,
              fontWeight: 700,
              color: asset.color,
            }}
          >
            {asset.label[0]}
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>
            {data[asset.key]}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
            {asset.label}
          </div>
        </div>
      ))}
    </div>
  )
}
