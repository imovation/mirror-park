import type { ReactNode } from 'react'

export interface PanelConfig {
  id: string
  title: string
  height?: 'auto' | 'flex-1' | 'flex-2' | 'flex-3'
  collapsible?: boolean
  collapsedSummary?: string
}

export interface DashboardPanelProps {
  title?: string
  flexGrow?: number
  collapsible?: boolean
  collapsedSummary?: string
  className?: string
  children: ReactNode
}
