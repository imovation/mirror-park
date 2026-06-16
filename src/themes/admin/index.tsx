import type { PanelConfig } from '@/types/panel'
import AdminScene from './AdminScene'

export const adminScene = () => <AdminScene />

export const adminPanels: { left: PanelConfig[]; right: PanelConfig[] } = {
  left: [
    { id: 'admin-overview', title: '办公概况' },
    { id: 'admin-notices', title: '通知公告' },
    { id: 'admin-duty', title: '值班安排' },
  ],
  right: [
    { id: 'admin-calendar', title: '校历日程' },
    { id: 'admin-attendance', title: '教职工考勤' },
    { id: 'admin-meetings', title: '会议管理' },
  ],
}

export function renderAdminPanel(_panelId: string) {
  return <span style={{ color: '#6b7280', fontSize: '0.75rem' }}>待实现</span>
}
