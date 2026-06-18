import type { ReactNode } from 'react'

interface DashboardPanelProps {
  title?: string
  children: ReactNode
  className?: string
}

export default function DashboardPanel({ title, children, className = '' }: DashboardPanelProps) {
  return (
    <div
      className={`panel-enter relative flex flex-col backdrop-blur-md border rounded-md overflow-hidden ${className}`}
      style={{
        background: 'var(--panel-bg)',
        borderColor: 'var(--border-strong)',
        minHeight: 0,
        flex: 1,
      }}
    >
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2" style={{ borderColor: 'var(--accent)' }} />
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2" style={{ borderColor: 'var(--accent)' }} />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2" style={{ borderColor: 'var(--accent)' }} />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2" style={{ borderColor: 'var(--accent)' }} />

      {title && (
        <div
          className="flex items-center px-4 py-2 border-b flex-shrink-0"
          style={{
            borderBottomColor: 'var(--border-light)',
            background: 'linear-gradient(90deg, rgba(var(--accent-rgb), 0.15), transparent)',
          }}
        >
          <div
            className="w-1 h-4 mr-2 flex-shrink-0"
            style={{
              background: 'var(--accent)',
              boxShadow: '0 0 8px rgba(var(--accent-rgb), 0.8)',
            }}
          />
          <h3
            className="font-bold tracking-wide"
            style={{
              color: 'var(--text-primary)',
              filter: 'drop-shadow(0 0 2px rgba(var(--accent-rgb), 0.5))',
            }}
          >
            {title}
          </h3>
        </div>
      )}
      <div className="flex-1 p-4 overflow-hidden relative" style={{ minHeight: 0 }}>
        {children}
      </div>
    </div>
  )
}
