import { useAssetData } from '@/api/queries/overview'
import type { AssetData } from '@/api/queries/overview'
import RingChart from '@/components/charts/RingChart'
import StatusPanel from '@/components/ui/StatusPanel'
import ChartLabel from '@/components/ui/ChartLabel'

const ASSETS: { key: keyof AssetData; label: string; color: string }[] = [
  { key: 'computers', label: '电脑', color: 'var(--accent)' },
  { key: 'projectors', label: '投影仪', color: 'var(--color-success)' },
  { key: 'airConditioners', label: '空调', color: 'var(--color-warning)' },
  { key: 'cameras', label: '摄像头', color: 'var(--color-chart-7)' },
  { key: 'printers', label: '打印机', color: 'var(--color-pending)' },
  { key: 'doorLocks', label: '门禁锁', color: 'var(--color-chart-1)' },
]

export default function AssetOverview() {
  const { data, isLoading, error } = useAssetData()

  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return <StatusPanel type="empty" />

  const total = ASSETS.reduce((sum, asset) => sum + data[asset.key], 0)
  const ringData = ASSETS.map((asset) => ({
    name: asset.label,
    value: data[asset.key],
  }))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1, minHeight: 0 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, flexShrink: 0 }}>
        {ASSETS.map((asset) => {
          const pct = total > 0 ? Math.round((data[asset.key] / total) * 100) : 0
          return (
            <div key={asset.key} style={{ background: 'var(--panel-bg)', border: '1px solid var(--border-light)', borderRadius: 6, padding: '8px 8px', textAlign: 'center' }}>
              <div style={{ height: 3, background: asset.color, borderRadius: 2, marginBottom: 4, opacity: 0.6 }} />
              <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, color: 'var(--text-primary)' }}>{String(data[asset.key])}</div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>{asset.label}</div>
              <div style={{ fontSize: 'var(--font-size-2xs)', color: 'var(--text-muted)', opacity: 0.7 }}>{pct}%</div>
            </div>
          )
        })}
      </div>
      <div style={{ flexShrink: 0, marginTop: 4 }}>
        <ChartLabel>设备类型占比</ChartLabel>
        <RingChart data={ringData} height={180} />
      </div>
    </div>
  )
}
