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
        background: 'rgba(10,22,40,0.95)',
        border: '1px solid rgba(74,158,255,0.3)',
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
          borderBottom: '1px solid rgba(74,158,255,0.15)',
          color: '#4a9eff',
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
            color: 'rgba(255,255,255,0.5)',
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
          color: 'rgba(255,255,255,0.3)',
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
