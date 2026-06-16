import type { ReactNode } from 'react'

interface ScreenLayoutProps {
  topBar: ReactNode
  leftPanel: ReactNode
  scene: ReactNode
  rightPanel: ReactNode
  bottomBar: ReactNode
}

export default function ScreenLayout({
  topBar,
  leftPanel,
  scene,
  rightPanel,
  bottomBar,
}: ScreenLayoutProps) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateAreas: `
          "topbar  topbar  topbar"
          "left    scene   right"
          "bottombar bottombar bottombar"
        `,
        gridTemplateRows: '56px 1fr 32px',
        gridTemplateColumns: '260px 1fr 260px',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      <div style={{ gridArea: 'topbar' }}>{topBar}</div>
      <div style={{ gridArea: 'left', overflow: 'auto' }}>{leftPanel}</div>
      <div style={{ gridArea: 'scene', position: 'relative', overflow: 'hidden' }}>{scene}</div>
      <div style={{ gridArea: 'right', overflow: 'auto' }}>{rightPanel}</div>
      <div style={{ gridArea: 'bottombar' }}>{bottomBar}</div>
    </div>
  )
}
