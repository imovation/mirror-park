import type { PanelConfig } from '@/types/panel'
import OverviewScene from './OverviewScene'
import PersonnelComposition from './panels/PersonnelComposition'
import TeacherDistribution from './panels/TeacherDistribution'
import StudentInfo from './panels/StudentInfo'
import ActivityTimeStats from './panels/ActivityTimeStats'
import AssetOverview from './panels/AssetOverview'
import RoomDistribution from './panels/RoomDistribution'
import TopMetricsCard from '@/components/ui/TopMetricsCard'

export const overviewScene = () => <OverviewScene />

const metricCards = [
  { label: '占地面积', value: '73' },
  { label: '建筑面积', value: '8.8万' },
  { label: '教学班', value: '60' },
  { label: '在校学生', value: '2800' },
  { label: '教职工', value: '220' },
]

export const overviewTopMetrics = () => (
  <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', justifyContent: 'center' }}>
    {metricCards.map((m) => (
      <TopMetricsCard key={m.label} label={m.label} value={m.value} />
    ))}
  </div>
)

export const overviewPanels: { left: PanelConfig[]; right: PanelConfig[] } = {
  left: [
    { id: 'overview-personnel', title: '人员构成' },
    { id: 'overview-teacher-dist', title: '师资分布' },
    { id: 'overview-student-info', title: '学生基础信息' },
  ],
  right: [
    { id: 'overview-activity-stats', title: '活跃度时段统计' },
    { id: 'overview-asset-overview', title: '资产概况' },
    { id: 'overview-room-dist', title: '功能室分布' },
  ],
}

export function renderOverviewPanel(panelId: string) {
  switch (panelId) {
    case 'overview-personnel':
      return <PersonnelComposition />
    case 'overview-teacher-dist':
      return <TeacherDistribution />
    case 'overview-student-info':
      return <StudentInfo />
    case 'overview-activity-stats':
      return <ActivityTimeStats />
    case 'overview-asset-overview':
      return <AssetOverview />
    case 'overview-room-dist':
      return <RoomDistribution />
    default:
      return <span style={{ color: '#6b7280', fontSize: '0.75rem' }}>待实现</span>
  }
}
