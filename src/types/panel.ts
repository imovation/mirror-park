import type { ReactNode } from 'react'

export interface PanelConfig {
  id: string
  title: string
  height?: string
  collapsible?: boolean
  collapsedSummary?: string
  autoCollapseBelow?: number
}

export function parseFlexGrow(height?: string, viewportHeight?: number): number {
  if (!height || height === 'auto') return 1
  const m = height.match(/^flex-([\d.]+)$/)
  const flex = m ? parseFloat(m[1]) : 1
  if (viewportHeight && viewportHeight < 800) return flex * 0.85
  return flex
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
