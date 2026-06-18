import type { ReactNode } from 'react'

interface ScreenLayoutProps {
  topBar: ReactNode
  leftPanel: ReactNode
  rightPanel: ReactNode
  bottomBar: ReactNode
}

export default function ScreenLayout({
  topBar,
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
          "left    .       right"
          "bottombar bottombar bottombar"
        `,
        gridTemplateRows: 'minmax(48px, 4vh) 1fr minmax(28px, 2.5vh)',
        gridTemplateColumns: 'minmax(240px, 18vw) 1fr minmax(240px, 18vw)',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      <div style={{ gridArea: 'topbar', pointerEvents: 'auto' }}>{topBar}</div>
      <div style={{ gridArea: 'left', overflow: 'auto', maxWidth: 420, pointerEvents: 'auto' }}>{leftPanel}</div>
      <div style={{ gridArea: 'right', overflow: 'auto', maxWidth: 420, pointerEvents: 'auto' }}>{rightPanel}</div>
      <div style={{ gridArea: 'bottombar', pointerEvents: 'auto' }}>{bottomBar}</div>
    </div>
  )
}
