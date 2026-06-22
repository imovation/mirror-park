import type { PanelConfig } from '@/types/panel'
import OverviewScene from './OverviewScene'
import FacultyPanorama, { FacultyComposition, FacultyStructure } from './panels/FacultyPanorama'
import StudentInfo from './panels/StudentInfo'
import ActivityTimeStats from './panels/ActivityTimeStats'
import AssetOverview from './panels/AssetOverview'
import RoomDistribution from './panels/RoomDistribution'
import OverviewTopMetrics from './panels/OverviewTopMetrics'

export const overviewScene = () => <OverviewScene />

export const overviewTopMetrics = () => <OverviewTopMetrics />

export const overviewPanels: { left: PanelConfig[]; right: PanelConfig[] } = {
  left: [
    { id: 'overview-student-info', title: '学生基础信息', height: 'flex-0.8' },
    { id: 'overview-faculty-composition', title: '教职工组成', height: 'flex-1' },
    { id: 'overview-faculty-structure', title: '教职工结构', height: 'flex-1.6' },
  ],
  right: [
    { id: 'overview-activity-stats', title: '活跃度时段统计', height: 'flex-1.5' },
    { id: 'overview-room-dist', title: '功能室分布', height: 'flex-1.3' },
    { id: 'overview-asset-overview', title: '资产概况', height: 'flex-1.9' },
  ],
}

export function renderOverviewPanel(panelId: string) {
  switch (panelId) {
    case 'overview-faculty':
      return <FacultyPanorama />
    case 'overview-faculty-composition':
      return <FacultyComposition />
    case 'overview-faculty-structure':
      return <FacultyStructure />
    case 'overview-student-info':
      return <StudentInfo />
    case 'overview-activity-stats':
      return <ActivityTimeStats />
    case 'overview-asset-overview':
      return <AssetOverview />
    case 'overview-room-dist':
      return <RoomDistribution />
    default:
      return <span style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-size-xs)' }}>待实现</span>
  }
}