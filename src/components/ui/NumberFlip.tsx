import { formatNumber } from '@/utils/format'

interface NumberFlipProps {
  value: number
  unit?: string
  label?: string
  color?: string
}

export default function NumberFlip({ value, unit, label, color = '#4a9eff' }: NumberFlipProps) {
  return (
    <div style={{ textAlign: 'center' }}>
      {label && (
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>
          {label}
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 4 }}>
        <span style={{ fontSize: 28, fontWeight: 'bold', color, fontFamily: 'monospace' }}>
          {formatNumber(value)}
        </span>
        {unit && (
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{unit}</span>
        )}
      </div>
    </div>
  )
}
