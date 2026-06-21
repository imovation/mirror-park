interface TopMetricsCardProps {
  label: string
  value: string
  unit?: string
  title?: string
}

export default function TopMetricsCard({ label, value, unit, title }: TopMetricsCardProps) {
  return (
    <div
      title={title}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '6px 12px 5px',
        borderRadius: 6,
        background: 'var(--theme-gradient), var(--panel-bg)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        minWidth: 84,
        cursor: title ? 'help' : 'default',
        overflow: 'hidden',
      }}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 4,
          bottom: 4,
          width: 3,
          background: 'var(--theme-primary)',
          boxShadow: '0 0 6px var(--theme-glow)',
          borderRadius: 2,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          background: 'linear-gradient(90deg, var(--theme-primary), transparent 60%)',
          opacity: 0.7,
        }}
      />
      <div
        style={{
          fontSize: 'var(--font-size-lg)',
          fontWeight: 700,
          color: 'var(--text-primary)',
          lineHeight: 1.1,
          textShadow: '0 0 8px var(--theme-glow)',
          fontFamily: 'monospace',
        }}>
        {value}
        {unit && (
          <span style={{ fontSize: 'var(--font-size-2xs)', color: 'var(--theme-primary)', marginLeft: 3, fontWeight: 500, textShadow: 'none' }}>
            {unit}
          </span>
        )}
      </div>
      <div style={{ fontSize: 'var(--font-size-2xs)', color: 'var(--text-tertiary)', marginTop: 3, letterSpacing: 0.5 }}>
        {label}
      </div>
    </div>
  )
}
