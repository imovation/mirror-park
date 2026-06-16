import type { ReactNode } from 'react'

interface LeftPanelProps {
  children: ReactNode
}

export default function LeftPanel({ children }: LeftPanelProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', paddingTop: 4 }}>
      {children}
    </div>
  )
}
