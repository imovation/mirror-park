import type { ReactNode } from 'react'

interface RightPanelProps {
  children: ReactNode
}

export default function RightPanel({ children }: RightPanelProps) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      paddingTop: 4,
      backdropFilter: 'blur(6px)',
      WebkitBackdropFilter: 'blur(6px)',
    }}>
      {children}
    </div>
  )
}
