import type { ReactNode } from 'react'

interface DashboardPanelProps {
  title: string
  children: ReactNode
}

export default function DashboardPanel({ title, children }: DashboardPanelProps) {
  return (
    <div
      style={{
        margin: '6px 8px',
        background: 'rgba(0, 0, 0, 0.35)',
        border: '1px solid rgba(74, 158, 255, 0.12)',
        borderRadius: 6,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 120,
      }}
    >
      <div
        style={{
          padding: '8px 14px',
          fontSize: 13,
          fontWeight: 600,
          color: '#4a9eff',
          borderBottom: '1px solid rgba(74, 158, 255, 0.1)',
          flexShrink: 0,
        }}
      >
        {title}
      </div>
      <div style={{ padding: 10, flex: 1, display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
    </div>
  )
}
