interface StatusPanelProps {
  type: 'loading' | 'error' | 'empty'
  message?: string
}

export default function StatusPanel({ type, message }: StatusPanelProps) {
  const config = {
    loading: { icon: '⏳', text: '加载中...', color: '#4a9eff' },
    error: { icon: '⚠️', text: '数据加载失败', color: '#ff6d00' },
    empty: { icon: '📭', text: '暂无数据', color: 'rgba(255,255,255,0.3)' },
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
    }}>
      <span style={{
        fontSize: 24,
        animation: type === 'loading' ? 'spin 1.2s linear infinite' : undefined,
        display: 'inline-block',
      }}>
        {config.icon}
      </span>
      <span style={{ fontSize: '0.75rem', color: config.color }}>
        {message || config.text}
      </span>
    </div>
  )
}
