import { formatNumber } from '@/utils/format'

interface NumberFlipProps {
  value: number
  unit?: string
  label?: string
  color?: string
  trend?: { direction: 'up' | 'down' | 'same'; percent: number }
}

function DigitColumn({ char }: { char: string }) {
  const digit = parseInt(char, 10)
  const isDigit = !isNaN(digit)

  return (
    <span
      style={{
        display: 'inline-block',
        overflow: 'hidden',
        height: '1em',
        verticalAlign: 'top',
        whiteSpace: 'pre',
      }}
    >
      {isDigit ? (
        <span
          style={{
            display: 'block',
            transform: `translateY(-${digit * 10}%)`,
            transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            willChange: 'transform',
          }}
        >
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
            <span key={n} style={{ display: 'block', height: '1em', lineHeight: 1 }}>{n}</span>
          ))}
        </span>
      ) : (
        <span>{char}</span>
      )}
    </span>
  )
}

export default function NumberFlip({ value, unit, label, color = 'var(--accent)', trend }: NumberFlipProps) {
  const formatted = formatNumber(value)

  const trendColor = trend?.direction === 'up' ? '#f44336' : trend?.direction === 'down' ? '#4caf50' : 'var(--text-tertiary)'
  const trendArrow = trend?.direction === 'up' ? '↑' : trend?.direction === 'down' ? '↓' : '→'

  return (
    <div style={{ textAlign: 'center' }}>
      {label && (
        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', marginBottom: 4 }}>
          {label}
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 4 }}>
        <span style={{ fontSize: 'var(--font-size-xxl)', fontWeight: 'bold', color, fontFamily: 'monospace' }}>
          {formatted.split('').map((char, i) => (
            <DigitColumn key={i} char={char} />
          ))}
        </span>
        {unit && (
          <span style={{ fontSize: 'var(--font-size-md)', color: 'var(--text-tertiary)' }}>{unit}</span>
        )}
      </div>
      {trend && (
        <div style={{ fontSize: 'var(--font-size-2xs)', color: trendColor, marginTop: 2 }}>
          {trendArrow} {trend.percent}%
        </div>
      )}
    </div>
  )
}
