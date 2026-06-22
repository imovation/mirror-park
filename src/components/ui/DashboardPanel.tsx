import { useState } from 'react'
import type { ReactNode } from 'react'
import { useResponsive } from '@/hooks/useResponsive'

interface DashboardPanelProps {
  title?: string
  flexGrow?: number
  collapsible?: boolean
  collapsedSummary?: string
  className?: string
  style?: React.CSSProperties
  children: ReactNode
}

export default function DashboardPanel({
  title,
  flexGrow = 1,
  collapsible = false,
  collapsedSummary,
  className = '',
  style = {},
  children,
}: DashboardPanelProps) {
  const [collapsed, setCollapsed] = useState(false)
  const { isCompact, isShortHeight } = useResponsive()
  const showCollapse = collapsible
  const scrollMode = 'auto'

  return (
    <div
      className={`panel-enter relative flex flex-col backdrop-blur-md border rounded-md overflow-hidden ${className}`}
      style={{
        flex: collapsed && showCollapse ? '0 0 auto' : flexGrow,
        minHeight: collapsed && showCollapse ? 'auto' : isShortHeight ? 'clamp(100px, 16vh, 180px)' : 'clamp(80px, 15vh, 200px)',
        height: collapsed && showCollapse ? 48 : undefined,
        background: 'var(--panel-bg)',
        borderColor: 'var(--border-strong)',
        transition: 'flex 0.3s ease, min-height 0.3s ease, height 0.3s ease, background 0.3s ease, border-color 0.3s ease',
        animationDelay: 'var(--stagger-delay, 0s)',
        ...style,
      }}
    >
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2" style={{ borderColor: 'var(--theme-primary)' }} />
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2" style={{ borderColor: 'var(--theme-primary)' }} />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2" style={{ borderColor: 'var(--theme-primary)' }} />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2" style={{ borderColor: 'var(--theme-primary)' }} />

      {title && (
        <div
          className="flex items-center px-3 py-1 border-b flex-shrink-0"
          style={{
            borderBottomColor: 'var(--border-light)',
            background: 'linear-gradient(90deg, rgba(var(--theme-primary-rgb), 0.15), transparent)',
          }}
        >
          <div
            className="w-1 h-3 mr-1"
            style={{
              background: 'var(--theme-primary)',
              boxShadow: '0 0 8px var(--theme-glow)',
            }}
          />
          <h3
            className="font-bold tracking-wide flex-1"
            style={{
              color: 'var(--text-primary)',
            }}
          >
            {title}
          </h3>
          {showCollapse && (
            <button
              onClick={() => setCollapsed((v) => !v)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--accent)',
                cursor: 'pointer',
                fontSize: 'var(--font-size-md)',
                padding: '2px 6px',
                lineHeight: 1,
                marginLeft: 'auto',
              }}
            >
              {collapsed ? '▶' : '▼'}
            </button>
          )}
        </div>
      )}
      {(!collapsed || !showCollapse) && (
        <div
          className={`flex-1 relative ${scrollMode === 'auto' ? 'panel-scroll' : ''}`}
          style={{
            padding: isCompact ? '0.5rem' : 'var(--panel-padding)',
            overflowY: scrollMode,
            overflowX: 'hidden',
          }}
        >
          {children}
        </div>
      )}
      {collapsed && showCollapse && collapsedSummary && (
        <div
          style={{
            fontSize: 'var(--font-size-xs)',
            color: 'var(--text-tertiary)',
            padding: '0 16px 4px',
          }}
        >
          {collapsedSummary}
        </div>
      )}
    </div>
  )
}
