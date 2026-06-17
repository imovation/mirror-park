import { formatNumber } from '@/utils/format'

interface NumberFlipProps {
  value: number
  unit?: string
  label?: string
  color?: string
}

export default function NumberFlip({ value, unit, label, color = 'var(--accent)' }: NumberFlipProps) {
  return (
    <div style={{ textAlign: 'center' }}>
      {label && (
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>
          {label}
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 4 }}>
        <span style={{ fontSize: 28, fontWeight: 'bold', color, fontFamily: 'monospace' }}>
          {formatNumber(value)}
        </span>
        {unit && (
          <span style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>{unit}</span>
        )}
      </div>
    </div>
  )
}
