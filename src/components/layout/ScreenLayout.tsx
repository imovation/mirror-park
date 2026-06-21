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
        "left         topmetrics   right"
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
        <div style={{ gridArea: 'topmetrics', pointerEvents: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'stretch', padding: '6px 16px', zIndex: 10, background: 'var(--overlay-bg)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', boxShadow: '0 2px 12px rgba(0,0,0,0.4)', margin: '4px 12px 0', alignSelf: 'start', justifySelf: 'center', maxWidth: 1000, width: '100%', borderRadius: 8 }}>
          {topMetrics}
        </div>
      )}
      <div style={{ gridArea: 'left', overflow: 'hidden', maxWidth: 460, pointerEvents: 'auto', height: '100%' }}>{leftPanel}</div>
      <div style={{ gridArea: 'right', overflow: 'hidden', maxWidth: 460, pointerEvents: 'auto', height: '100%' }}>{rightPanel}</div>
      <div style={{ gridArea: 'bottombar', pointerEvents: 'auto' }}>{bottomBar}</div>
    </div>
  )
}
