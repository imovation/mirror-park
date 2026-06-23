import type { ReactNode } from 'react'
import { useResponsive } from '@/hooks/useResponsive'
import { useUIThemeStore } from '@/stores/useUIThemeStore'

interface ScreenLayoutProps {
  topBar: ReactNode
  topMetrics?: ReactNode
  leftPanel: ReactNode
  rightPanel: ReactNode
  bottomBar: ReactNode
}

export default function ScreenLayout({
  topBar,
  topMetrics,
  leftPanel,
  rightPanel,
  bottomBar,
}: ScreenLayoutProps) {
  const { panelMaxWidth, isCompact, isUltraWide } = useResponsive()
  const isDark = useUIThemeStore((s) => s.uiTheme) === 'dark'

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateAreas: `
          "topbar       topbar       topbar"
          "left         topmetrics   right"
          "left         .            right"
          "left         hint         right"
          "bottombar    bottombar    bottombar"
        `,
        gridTemplateRows: '90px auto 1fr 1fr 90px',
        gridTemplateColumns: 'minmax(260px, 20vw) 1fr minmax(260px, 20vw)',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      <div style={{ gridArea: 'topbar', pointerEvents: 'auto' }}>{topBar}</div>
      {topMetrics && (
        <div style={{ gridArea: 'topmetrics', pointerEvents: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '6px 0', zIndex: 10, position: 'relative' }}>
          <div style={{ maxWidth: isUltraWide ? panelMaxWidth * 2 : 880, width: '100%', display: 'flex', justifyContent: 'center', padding: '6px 16px', background: 'var(--topmetrics-bg)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', borderLeft: '1px solid var(--border)', borderRight: '1px solid var(--border)', borderRadius: 8, boxShadow: '0 4px 16px rgba(0,0,0,0.4)' }}>
            {topMetrics}
          </div>
        </div>
      )}
      <div style={{ gridArea: 'left', overflow: 'hidden', maxWidth: panelMaxWidth, pointerEvents: 'auto', height: '100%', paddingLeft: 0 }}>{leftPanel}</div>
      <div style={{ gridArea: 'right', overflow: 'hidden', maxWidth: panelMaxWidth, pointerEvents: 'auto', height: '100%', paddingRight: 0 }}>{rightPanel}</div>
      <div
        style={{
          gridArea: 'hint',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'flex-start',
          padding: '0 0 12px 16px',
          fontSize: 11,
          color: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.3)',
          pointerEvents: 'none',
        }}
      >
        🖱 左键旋转 · 滚轮缩放 · 右键平移
      </div>
      <div style={{ gridArea: 'bottombar', pointerEvents: 'auto' }}>{bottomBar}</div>
    </div>
  )
}
