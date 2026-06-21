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
        "left         .            right"
        "bottombar    bottombar    bottombar"
      `,
        gridTemplateRows: 'minmax(48px, 4vh) auto 1fr 1fr minmax(28px, 2.5vh)',
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
          <div style={{ maxWidth: 880, width: '100%', display: 'flex', justifyContent: 'center', padding: '6px 16px', background: 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.3) 100%)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', borderLeft: '1px solid var(--border)', borderRight: '1px solid var(--border)', borderRadius: 8, boxShadow: '0 4px 16px rgba(0,0,0,0.4)' }}>
            {topMetrics}
          </div>
        </div>
      )}
      <div style={{ gridArea: 'left', overflow: 'hidden', maxWidth: 460, pointerEvents: 'auto', height: '100%' }}>{leftPanel}</div>
      <div style={{ gridArea: 'right', overflow: 'hidden', maxWidth: 460, pointerEvents: 'auto', height: '100%' }}>{rightPanel}</div>
      <div style={{ gridArea: 'bottombar', pointerEvents: 'auto' }}>{bottomBar}</div>
    </div>
  )
}
