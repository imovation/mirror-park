import type { ReactNode } from 'react'

interface ModalProps {
  visible: boolean
  title: string
  onClose: () => void
  children: ReactNode
  width?: number
}

export default function Modal({ visible, title, onClose, children, width = 600 }: ModalProps) {
  if (!visible) return null

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
      }}
      onClick={onClose}
    >
      <div
        style={{
          width,
          maxHeight: '80vh',
          background: 'var(--panel-bg-solid)',
          border: '1px solid var(--border-strong)',
          borderRadius: 8,
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
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
            fontSize: 15,
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
        <div style={{ padding: 20, color: 'var(--text-secondary)', fontSize: 13 }}>
          {children}
        </div>
      </div>
    </div>
  )
}
