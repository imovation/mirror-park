import type { ReactNode } from 'react'

export interface PanelConfig {
  id: string
  title: string
  height?: string
  collapsible?: boolean
  collapsedSummary?: string
  autoCollapseBelow?: number
}

export function parseFlexGrow(height?: string): number {
  if (!height || height === 'auto') return 1
  const m = height.match(/^flex-([\d.]+)$/)
  return m ? parseFloat(m[1]) : 1
}

export interface PanelGroup {
  id: string
  label: string
  left: PanelConfig[]
  right: PanelConfig[]
}

export interface DashboardPanelProps {
  title?: string
  flexGrow?: number
  collapsible?: boolean
  collapsedSummary?: string
  className?: string
  children: ReactNode
}
