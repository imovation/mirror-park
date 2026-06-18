import type { ReactNode } from 'react'

interface SidePanelProps {
  children: ReactNode
}

export default function SidePanel({ children }: SidePanelProps) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      height: '100%',
      paddingTop: 4,
      backdropFilter: 'blur(6px)',
      WebkitBackdropFilter: 'blur(6px)',
    }}>
      {children}
    </div>
  )
}
