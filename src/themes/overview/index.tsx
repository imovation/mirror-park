import type { PanelConfig } from '@/types/panel'
import OverviewScene from './OverviewScene'
import SchoolInfo from './panels/SchoolInfo'

export const overviewScene = () => <OverviewScene />

export const overviewPanels: { left: PanelConfig[]; right: PanelConfig[] } = {
  left: [
    { id: 'overview-school-info', title: '学校概况' },
    { id: 'overview-personnel', title: '人员构成' },
    { id: 'overview-teacher-dist', title: '师资分布' },
    { id: 'overview-student-info', title: '学生基础信息' },
    { id: 'overview-activity', title: '活跃度统计' },
  ],
  right: [
    { id: 'overview-detail-1', title: '详情面板-1' },
    { id: 'overview-detail-2', title: '详情面板-2' },
  ],
}

export function renderOverviewPanel(panelId: string) {
  switch (panelId) {
    case 'overview-school-info':
      return <SchoolInfo />
    default:
      return <span style={{ color: '#6b7280', fontSize: '0.75rem' }}>待实现</span>
  }
}
