import { type ReactNode, useState, useEffect } from 'react'

interface ModalProps {
  visible: boolean
  title: string
  onClose: () => void
  children: ReactNode
  width?: number
}

export default function Modal({ visible, title, onClose, children, width = 600 }: ModalProps) {
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
      }, 200)
      return () => clearTimeout(timer)
    }
  }, [visible, show])

  if (!show) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--overlay-bg)',
        backdropFilter: 'blur(4px)',
        opacity: closing ? 0 : 1,
        transition: 'opacity 0.2s ease',
      }}
      onClick={onClose}
    >
      <div
        className="panel-enter"
        style={{
          width,
          maxHeight: '80vh',
          background: 'var(--panel-bg-solid)',
          border: '1px solid var(--border-strong)',
          borderRadius: 8,
          overflow: 'hidden',
          boxShadow: 'var(--shadow-modal)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 20px',
            borderBottom: '1px solid var(--border-light)',
            color: 'var(--accent)',
            fontSize: 'var(--font-size-md)',
            fontWeight: 600,
          }}
        >
          <span>{title}</span>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-tertiary)',
              cursor: 'pointer',
              fontSize: 18,
            }}
          >
            ✕
          </button>
        </div>
        <div style={{ padding: 20, color: 'var(--text-secondary)', fontSize: 'var(--font-size-md)' }}>
          {children}
        </div>
      </div>
    </div>
  )
}
