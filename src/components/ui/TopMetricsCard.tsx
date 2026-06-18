interface TopMetricsCardProps {
  label: string
  value: string
}

export default function TopMetricsCard({ label, value }: TopMetricsCardProps) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '8px 20px',
      borderRadius: 8,
      background: 'var(--panel-bg)',
      backdropFilter: 'blur(8px)',
      minWidth: 120,
    }}>
      <span style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%' }}>{value}</span>
      <span style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2 }}>{label}</span>
    </div>
  )
}
