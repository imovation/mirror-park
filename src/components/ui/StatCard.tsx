interface StatCardProps {
  icon?: string
  iconColor?: string
  value: string
  label: string
  labelColor?: string
  sublabel?: string
  sublabelColor?: string
  compact?: boolean
  style?: React.CSSProperties
}

export default function StatCard({ icon, iconColor, value, label, labelColor, sublabel, sublabelColor, compact, style }: StatCardProps) {
  return (
    <div
      style={{
        background: 'rgba(74,158,255,0.06)',
        ...style,
        border: '1px solid var(--border-light)',
        borderRadius: compact ? 4 : 8,
        padding: compact ? '5px 4px' : '10px 8px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: compact ? 1 : 3,
        textAlign: 'center',
      }}
    >
      {icon && (
        <div
          style={{
            width: compact ? 18 : 28,
            height: compact ? 18 : 28,
            borderRadius: '50%',
            background: `${iconColor || '#4a9eff'}22`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: compact ? 'var(--font-size-2xs)' : 'var(--font-size-xs)',
            fontWeight: 700,
            color: iconColor || '#4a9eff',
            flexShrink: 0,
          }}
        >
          {icon}
        </div>
      )}
      {label && (
        <div style={{ fontSize: compact ? 'var(--font-size-2xs)' : 'var(--font-size-xs)', color: labelColor || 'var(--accent)', fontWeight: 500, letterSpacing: compact ? 0 : 1 }}>
          {label}
        </div>
      )}
      <div style={{ fontSize: compact ? 'var(--font-size-sm)' : 'var(--font-size-xl)', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>
        {value}
      </div>
      {sublabel && (
        <div style={{ fontSize: compact ? 'var(--font-size-2xs)' : 'var(--font-size-xs)', color: sublabelColor || 'var(--text-tertiary)' }}>
          {sublabel}
        </div>
      )}
    </div>
  )
}
