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
      minWidth: 100,
    }}>
      <span style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>{value}</span>
      <span style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2 }}>{label}</span>
    </div>
  )
}
