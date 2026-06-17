interface VideoWindowProps {
  visible: boolean
  title: string
  onClose: () => void
}

export default function VideoWindow({ visible, title, onClose }: VideoWindowProps) {
  if (!visible) return null

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 60,
        right: 30,
        width: 400,
        zIndex: 800,
        background: 'var(--panel-bg-solid)',
        border: '1px solid var(--border-strong)',
        borderRadius: 8,
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '8px 14px',
          borderBottom: '1px solid var(--border-light)',
          color: 'var(--accent)',
          fontSize: 13,
          fontWeight: 600,
        }}
      >
        <span>📹 {title}</span>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-tertiary)',
            cursor: 'pointer',
            fontSize: 16,
          }}
        >
          ✕
        </button>
      </div>
      <div
        style={{
          height: 250,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#000',
          color: 'var(--text-muted)',
          fontSize: 13,
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>📹</div>
          <div>监控画面预览</div>
          <div style={{ fontSize: 10, marginTop: 4 }}>
            演示模式 — 实际对接大华ICC后显示实时画面
          </div>
        </div>
      </div>
    </div>
  )
}
