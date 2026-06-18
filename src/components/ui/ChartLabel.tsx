import type { ReactNode } from 'react'

interface ChartLabelProps {
  children: ReactNode
  align?: 'left' | 'center'
}

export default function ChartLabel({ children, align = 'left' }: ChartLabelProps) {
  return (
    <div style={{
      fontSize: 11,
      color: 'var(--text-tertiary)',
      marginBottom: 4,
      textAlign: align,
    }}>
      {children}
    </div>
  )
}
