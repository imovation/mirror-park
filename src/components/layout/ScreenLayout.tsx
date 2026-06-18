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
          "topbar  topbar  topbar"
          "left    topmetrics right"
          "left    bottommids right"
          "bottombar bottombar bottombar"
        `,
        gridTemplateRows: 'minmax(48px, 4vh) auto 1fr minmax(28px, 2.5vh)',
        gridTemplateColumns: 'minmax(240px, 18vw) 1fr minmax(240px, 18vw)',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      <div style={{ gridArea: 'topbar', pointerEvents: 'auto' }}>{topBar}</div>
      {topMetrics && (
        <div style={{ gridArea: 'topmetrics', pointerEvents: 'auto', display: 'flex', justifyContent: 'center', padding: '12px', zIndex: 10, overflow: 'hidden' }}>
          {topMetrics}
        </div>
      )}
      <div style={{ gridArea: 'left', overflow: 'hidden', maxWidth: 420, pointerEvents: 'auto' }}>{leftPanel}</div>
      <div style={{ gridArea: 'right', overflow: 'hidden', maxWidth: 420, pointerEvents: 'auto' }}>{rightPanel}</div>
      <div style={{ gridArea: 'bottombar', pointerEvents: 'auto' }}>{bottomBar}</div>
    </div>
  )
}
