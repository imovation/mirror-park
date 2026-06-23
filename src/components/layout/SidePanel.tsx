import type { ReactNode } from 'react'

interface SidePanelProps {
  children: ReactNode
}

export default function SidePanel({ children }: SidePanelProps) {
  return (
    <div className="panel-scroll" style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      height: '100%',
      paddingTop: 4,
      overflowY: 'hidden',
      backdropFilter: 'blur(6px)',
      WebkitBackdropFilter: 'blur(6px)',
    }}>
      {children}
    </div>
  )
}
