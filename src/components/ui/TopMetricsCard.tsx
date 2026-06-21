interface TopMetricsCardProps {
  label: string
  value: string
  title?: string
}

export default function TopMetricsCard({ label, value, title }: TopMetricsCardProps) {
  return (
    <div
      title={title}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '6px 16px',
        borderRadius: 8,
        background: 'var(--panel-bg)',
        backdropFilter: 'blur(8px)',
        minWidth: 90,
        cursor: title ? 'help' : 'default',
      }}>
      <span style={{ fontSize: 'var(--font-size-xxl)', fontWeight: 700, color: 'var(--text-primary)' }}>{value}</span>
      <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)', marginTop: 2 }}>{label}</span>
    </div>
  )
}
