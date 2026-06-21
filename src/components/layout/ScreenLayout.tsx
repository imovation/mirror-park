import type { ReactNode } from 'react'

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
  return (
    <div
      style={{
        display: 'grid',
      gridTemplateAreas: `
        "topbar       topbar       topbar"
        "topmetrics   topmetrics   topmetrics"
        "left         .            right"
        "bottombar    bottombar    bottombar"
      `,
        gridTemplateRows: 'minmax(48px, 4vh) auto 1fr minmax(28px, 2.5vh)',
        gridTemplateColumns: 'minmax(260px, 20vw) 1fr minmax(260px, 20vw)',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      <div style={{ gridArea: 'topbar', pointerEvents: 'auto' }}>{topBar}</div>
      {topMetrics && (
        <div style={{ gridArea: 'topmetrics', pointerEvents: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'stretch', padding: '6px 20px', zIndex: 10, background: 'var(--overlay-bg)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', borderBottom: '1px solid var(--border)', margin: '4px 12px 0', borderRadius: 6 }}>
          {topMetrics}
        </div>
      )}
      <div style={{ gridArea: 'left', overflow: 'hidden', maxWidth: 460, pointerEvents: 'auto', height: '100%' }}>{leftPanel}</div>
      <div style={{ gridArea: 'right', overflow: 'hidden', maxWidth: 460, pointerEvents: 'auto', height: '100%' }}>{rightPanel}</div>
      <div style={{ gridArea: 'bottombar', pointerEvents: 'auto' }}>{bottomBar}</div>
    </div>
  )
}
