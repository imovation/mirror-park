import { useState, useEffect } from 'react'

interface VideoWindowProps {
  visible: boolean
  title: string
  onClose: () => void
}

export default function VideoWindow({ visible, title, onClose }: VideoWindowProps) {
  const [show, setShow] = useState(false)
  const [closing, setClosing] = useState(false)

  useEffect(() => {
    if (visible) {
      setShow(true)
      setClosing(false)
    } else if (show) {
      setClosing(true)
      const timer = setTimeout(() => {
        setShow(false)
        setClosing(false)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [visible, show])

  if (!show) return null

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
        boxShadow: 'var(--shadow-modal)',
        animation: closing ? 'slideOutRight 0.3s ease-out forwards' : 'slideInRight 0.3s ease-out',
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
          fontSize: 'var(--font-size-md)',
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
          background: 'var(--panel-bg-solid)',
          color: 'var(--text-muted)',
          fontSize: 'var(--font-size-md)',
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
