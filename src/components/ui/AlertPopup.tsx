import { useEffect, useState } from 'react'
import { useUIStore } from '@/stores/useUIStore'
import { useSceneStore } from '@/stores/useSceneStore'

export default function AlertPopup() {
  const alerts = useUIStore((s) => s.alertQueue)
  const dismissAlert = useUIStore((s) => s.dismissAlert)
  const selectObject = useSceneStore((s) => s.selectObject)

  const [visibleAlerts, setVisibleAlerts] = useState<typeof alerts>([])

  useEffect(() => {
    const sorted = [...alerts].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    setVisibleAlerts(sorted.slice(0, 5))
  }, [alerts])

  if (visibleAlerts.length === 0) return null

  return (
    <div className="panel-scroll" style={{
      position: 'fixed',
      bottom: 56,
      right: 24,
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      width: 220,
      maxWidth: 'calc(100vw - 48px)',
      maxHeight: '28vh',
      overflowY: 'auto',
      pointerEvents: 'none',
    }}>
      {visibleAlerts.map((alert) => (
        <div
          key={alert.id}
          style={{
            background: alert.type === 'error' ? 'rgba(var(--color-danger-rgb), 0.9)' : alert.type === 'warning' ? 'rgba(var(--color-warning-rgb), 0.9)' : 'rgba(var(--accent-rgb), 0.9)',
            borderRadius: 8,
            padding: '12px 16px',
            color: 'var(--text-primary)',
            fontSize: 13,
            boxShadow: 'var(--shadow-toast)',
            animation: 'slideInUp 0.4s ease-out',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 8,
            cursor: 'pointer',
            pointerEvents: 'auto',
          }}
          onClick={() => {
            selectObject(alert.id)
            dismissAlert(alert.id)
          }}
        >
          <div>
            <div style={{ fontWeight: 600, marginBottom: 2 }}>
              {alert.type === 'error' ? '🚨' : alert.type === 'warning' ? '⚠️' : 'ℹ️'} {alert.message}
            </div>
            <div style={{ fontSize: 10, opacity: 0.7 }}>
              {alert.timestamp.toLocaleTimeString('zh-CN', { hour12: false })}
            </div>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); dismissAlert(alert.id) }}
            style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', fontSize: 16, opacity: 0.6 }}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  )
}
