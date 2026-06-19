import type { PanelConfig } from '@/types/panel'
import OverviewScene from './OverviewScene'
import FacultyPanorama from './panels/FacultyPanorama'
import StudentInfo from './panels/StudentInfo'
import ActivityTimeStats from './panels/ActivityTimeStats'
import AssetOverview from './panels/AssetOverview'
import RoomDistribution from './panels/RoomDistribution'
import OverviewTopMetrics from './panels/OverviewTopMetrics'

export const overviewScene = () => <OverviewScene />

export const overviewTopMetrics = () => <OverviewTopMetrics />

export const overviewPanels: { left: PanelConfig[]; right: PanelConfig[] } = {
  left: [
    { id: 'overview-faculty', title: '教职工全景态势', height: 'flex-3', collapsible: true, collapsedSummary: '教职工组成、学历、职称、学科分布' },
    { id: 'overview-student-info', title: '学生基础信息', height: 'flex-1' },
  ],
  right: [
    { id: 'overview-activity-stats', title: '活跃度时段统计', height: 'flex-1' },
    { id: 'overview-asset-overview', title: '资产概况', height: 'flex-1' },
    { id: 'overview-room-dist', title: '功能室分布', height: 'flex-1' },
  ],
}

export function renderOverviewPanel(panelId: string) {
  switch (panelId) {
    case 'overview-faculty':
      return <FacultyPanorama />
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