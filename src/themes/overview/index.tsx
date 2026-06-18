import type { PanelConfig } from '@/types/panel'
import OverviewScene from './OverviewScene'
import SchoolInfo from './panels/SchoolInfo'
import PersonnelComposition from './panels/PersonnelComposition'
import TeacherDistribution from './panels/TeacherDistribution'
import StudentInfo from './panels/StudentInfo'
import ActivityHeatmap from './panels/ActivityHeatmap'
import AssetOverview from './panels/AssetOverview'
import FunctionalRooms from './panels/FunctionalRooms'

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
    { id: 'overview-assets', title: '资产概况' },
    { id: 'overview-rooms', title: '功能室分布' },
  ],
}

export function renderOverviewPanel(panelId: string) {
  switch (panelId) {
    case 'overview-school-info':
      return <SchoolInfo />
    case 'overview-personnel':
      return <PersonnelComposition />
    case 'overview-teacher-dist':
      return <TeacherDistribution />
    case 'overview-student-info':
      return <StudentInfo />
    case 'overview-activity':
      return <ActivityHeatmap />
    case 'overview-assets':
      return <AssetOverview />
    case 'overview-rooms':
      return <FunctionalRooms />
    default:
      return <span style={{ color: '#6b7280', fontSize: '0.75rem' }}>待实现</span>
  }
}
