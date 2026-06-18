import type { ReactNode } from 'react'

interface DashboardPanelProps {
  title: string
  children: ReactNode
}

export default function DashboardPanel({ title, children }: DashboardPanelProps) {
  return (
    <div
      className="panel-enter"
      style={{
        marginBottom: 6,
        background: 'var(--panel-bg)',
        border: '1px solid var(--border)',
        borderRadius: 6,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 120,
      }}
    >
      <div
        style={{
          padding: 'var(--panel-padding-y) var(--panel-padding-x)',
          fontSize: 13,
          fontWeight: 600,
          color: 'var(--accent)',
          borderBottom: '1px solid var(--border-light)',
          flexShrink: 0,
        }}
      >
        {title}
      </div>
      <div style={{ padding: 'var(--panel-padding-y) var(--panel-padding-x)', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
    </div>
  )
}
