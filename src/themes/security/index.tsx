import type { PanelConfig } from '@/types/panel'
import SecurityScene from './SecurityScene'

export const securityScene = () => <SecurityScene />

export const securityPanels: { left: PanelConfig[]; right: PanelConfig[] } = {
  left: [
    { id: 'sec-overview', title: '安防概况' },
    { id: 'sec-monitor', title: '监控状态' },
    { id: 'sec-access', title: '门禁管理' },
  ],
  right: [
    { id: 'sec-leave', title: '学生请假管理' },
    { id: 'sec-visitors', title: '访客管理' },
    { id: 'sec-alerts', title: '告警事件' },
    { id: 'sec-canteen', title: '食堂安全' },
  ],
}

export function renderSecurityPanel(_panelId: string) {
  return <span style={{ color: '#6b7280', fontSize: '0.75rem' }}>待实现</span>
}
