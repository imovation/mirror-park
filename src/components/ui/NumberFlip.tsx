import { formatNumber } from '@/utils/format'

interface NumberFlipProps {
  value: number
  unit?: string
  label?: string
  color?: string
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
            transform: `translateY(-${digit * 100}%)`,
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

export default function NumberFlip({ value, unit, label, color = 'var(--accent)' }: NumberFlipProps) {
  const formatted = formatNumber(value)

  return (
    <div style={{ textAlign: 'center' }}>
      {label && (
        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', marginBottom: 4 }}>
          {label}
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 4 }}>
        <span style={{ fontSize: 28, fontWeight: 'bold', color, fontFamily: 'monospace' }}>
          {formatted.split('').map((char, i) => (
            <DigitColumn key={i} char={char} />
          ))}
        </span>
        {unit && (
          <span style={{ fontSize: 'var(--font-size-md)', color: 'var(--text-tertiary)' }}>{unit}</span>
        )}
      </div>
    </div>
  )
}
