import type { PanelConfig } from '@/types/panel'
import LogisticsScene from './LogisticsScene'
import LogisticsLeave from './panels/LogisticsLeave'
import LogisticsVisitors from './panels/LogisticsVisitors'
import LogisticsCanteen from './panels/LogisticsCanteen'
import LogisticsTopMetrics from './panels/LogisticsTopMetrics'

export const logisticsScene = () => <LogisticsScene />

export const logisticsTopMetrics = () => <LogisticsTopMetrics />

export const logisticsPanels: { left: PanelConfig[]; right: PanelConfig[] } = {
  left: [
    { id: 'log-leave', title: '学生请假管理', height: 'flex-1', collapsible: true, collapsedSummary: '今日请假、类型分布、各年级对比、请假记录' },
  ],
  right: [
    { id: 'log-visitors', title: '访客管理', height: 'flex-1', collapsible: true, collapsedSummary: '今日访客、当前在校、来访目的分布' },
    { id: 'log-canteen', title: '食堂安全', height: 'flex-1' },
  ],
}

export function renderLogisticsPanel(panelId: string) {
  switch (panelId) {
    case 'log-leave': return <LogisticsLeave />
    case 'log-visitors': return <LogisticsVisitors />
    case 'log-canteen': return <LogisticsCanteen />
    default: return <span style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-size-xs)' }}>待实现</span>
  }
}
