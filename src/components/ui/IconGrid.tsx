export interface GridItem {
  id: string
  icon: string
  label: string
  value: number
  unit?: string
}

interface IconGridProps {
  items: GridItem[]
}

export default function IconGrid({ items }: IconGridProps) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
      {items.map(item => (
        <div key={item.id} style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: 'var(--card-carousel-bg)', padding: '6px 10px',
          borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)'
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%', background: 'rgba(74,158,255,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: 'var(--accent)'
          }}>
            {item.icon}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>{item.label}</div>
            <div style={{ fontSize: 14, fontWeight: 'bold', color: 'var(--text-primary)' }}>
              {item.value} <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 'normal' }}>{item.unit}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
