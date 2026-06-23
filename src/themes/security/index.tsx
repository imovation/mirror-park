import type { PanelConfig } from '@/types/panel'
import SecurityScene from './SecurityScene'
import MonitorStatus from './panels/MonitorStatus'
import AccessControl from './panels/AccessControl'
import AlertEvents from './panels/AlertEvents'
import SecurityOverview from './panels/SecurityOverview'
import SecurityTopMetrics from './panels/SecurityTopMetrics'

export const securityScene = () => <SecurityScene />

export const securityTopMetrics = () => <SecurityTopMetrics />

export const securityPanels: { left: PanelConfig[]; right: PanelConfig[] } = {
  left: [
    { id: 'sec-monitor', title: '监控状态', height: 'flex-1.33' },
    { id: 'sec-access', title: '门禁管理', height: 'flex-1.3', collapsible: true, collapsedSummary: '今日通行、异常记录、各门禁点统计' },
  ],
  right: [
    { id: 'sec-overview', title: '安防态势总览', height: 'flex-1' },
    { id: 'sec-alerts', title: '告警事件', height: 'flex-1.9', collapsible: true, collapsedSummary: '今日告警、告警类型、处理状态、告警列表' },
  ],
}

export function renderSecurityPanel(panelId: string) {
  switch (panelId) {
    case 'sec-monitor': return <MonitorStatus />
    case 'sec-access': return <AccessControl />
    case 'sec-overview': return <SecurityOverview />
    case 'sec-alerts': return <AlertEvents />
    default: return <span style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-size-xs)' }}>待实现</span>
  }
}
