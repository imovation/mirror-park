interface StatusPanelProps {
  type: 'loading' | 'error' | 'empty'
  message?: string
}

export default function StatusPanel({ type, message }: StatusPanelProps) {
  const config = {
    loading: { icon: '⏳', text: '加载中...', color: 'var(--accent)' },
    error: { icon: '⚠️', text: '数据加载失败', color: 'var(--color-warning)' },
    empty: { icon: '📭', text: '暂无数据', color: 'var(--text-muted)' },
  }[type]

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 32,
      gap: 8,
      minHeight: 80,
      animation: type !== 'loading' ? 'fadeInUp 0.35s ease-out' : undefined,
    }}>
      <span style={{
        fontSize: 24,
        animation: type === 'loading' ? 'spin 1.2s linear infinite' : undefined,
        display: 'inline-block',
      }}>
        {config.icon}
      </span>
      <span style={{ fontSize: 'var(--font-size-sm)', color: config.color }}>
        {message || config.text}
      </span>
    </div>
  )
}
