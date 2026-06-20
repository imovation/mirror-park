interface StatCardProps {
  icon?: string
  iconColor?: string
  value: string
  label: string
  labelColor?: string
  sublabel?: string
  sublabelColor?: string
}

export default function StatCard({ icon, iconColor, value, label, labelColor, sublabel, sublabelColor }: StatCardProps) {
  return (
    <div
      style={{
        background: 'rgba(74,158,255,0.06)',
        border: '1px solid var(--border-light)',
        borderRadius: 8,
        padding: '10px 8px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 3,
        textAlign: 'center',
      }}
    >
      {icon && (
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: `${iconColor || '#4a9eff'}22`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 'var(--font-size-xs)',
            fontWeight: 700,
            color: iconColor || '#4a9eff',
            flexShrink: 0,
          }}
        >
          {icon}
        </div>
      )}
      {label && (
        <div style={{ fontSize: 'var(--font-size-xs)', color: labelColor || 'var(--accent)', fontWeight: 500, letterSpacing: 1 }}>
          {label}
        </div>
      )}
      <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>
        {value}
      </div>
      {sublabel && (
        <div style={{ fontSize: 'var(--font-size-xs)', color: sublabelColor || 'var(--text-tertiary)' }}>
          {sublabel}
        </div>
      )}
    </div>
  )
}
