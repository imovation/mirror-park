import type { ReactNode } from 'react'

export interface PanelConfig {
  id: string
  title: string
  height?: 'auto' | 'flex-1' | 'flex-2'
}

export interface DashboardPanelProps {
  config: PanelConfig
  children: ReactNode
}
