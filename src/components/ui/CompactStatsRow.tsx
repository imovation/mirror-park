import type { ReactNode } from 'react'

export interface StatItem {
  id: string
  label: string
  value: number
  unit?: string
  color?: string
}

interface CompactStatsRowProps {
  items: StatItem[]
}

export default function CompactStatsRow({ items }: CompactStatsRowProps) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      background: 'var(--card-carousel-bg)',
      borderRadius: 'var(--radius-md)',
      padding: '8px 12px',
      marginBottom: 8,
      border: '1px solid var(--border-light)'
    }}>
      {items.map(item => (
        <div key={item.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>{item.label}</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
            <span style={{ fontSize: 16, fontWeight: 'bold', color: item.color || 'var(--text-primary)', fontFamily: 'monospace' }}>
              {item.value.toLocaleString()}
            </span>
            {item.unit && <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{item.unit}</span>}
          </div>
        </div>
      ))}
    </div>
  )
}
