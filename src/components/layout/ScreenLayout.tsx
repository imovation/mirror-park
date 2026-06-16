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
        gridTemplateRows: 'minmax(48px, 4vh) 1fr minmax(28px, 2.5vh)',
        gridTemplateColumns: 'minmax(240px, 18vw) 1fr minmax(240px, 18vw)',
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
