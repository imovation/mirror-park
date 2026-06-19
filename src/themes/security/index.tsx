import type { PanelConfig } from '@/types/panel'
import SecurityScene from './SecurityScene'
import MonitorStatus from './panels/MonitorStatus'
import AccessControl from './panels/AccessControl'
import StudentLeave from './panels/StudentLeave'
import VisitorManagement from './panels/VisitorManagement'
import AlertEvents from './panels/AlertEvents'
import CanteenSafety from './panels/CanteenSafety'
import SecurityTopMetrics from './panels/SecurityTopMetrics'

export const securityScene = () => <SecurityScene />

export const securityTopMetrics = () => <SecurityTopMetrics />

export const securityPanels: { left: PanelConfig[]; right: PanelConfig[] } = {
  left: [
    { id: 'sec-monitor', title: '监控状态', height: 'flex-2' },
    { id: 'sec-access', title: '门禁管理', height: 'flex-2' },
    { id: 'sec-leave', title: '学生请假管理', height: 'flex-3', collapsible: true, collapsedSummary: '今日请假、类型分布、各年级对比、请假记录' },
  ],
  right: [
    { id: 'sec-visitors', title: '访客管理', height: 'flex-2' },
    { id: 'sec-alerts', title: '告警事件', height: 'flex-2' },
    { id: 'sec-canteen', title: '食堂安全', height: 'flex-2' },
  ],
}

export function renderSecurityPanel(panelId: string) {
  switch (panelId) {
    case 'sec-monitor': return <MonitorStatus />
    case 'sec-access': return <AccessControl />
    case 'sec-leave': return <StudentLeave />
    case 'sec-visitors': return <VisitorManagement />
    case 'sec-alerts': return <AlertEvents />
    case 'sec-canteen': return <CanteenSafety />
    default: return <span style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-size-xs)' }}>待实现</span>
  }
}
