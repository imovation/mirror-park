import type { PanelConfig } from '@/types/panel'
import TeachingResearchScene from './TeachingResearchScene'
import TeachingResourcesPanel from './panels/TeachingResourcesPanel'
import ResourceStatistics from './panels/ResourceStatistics'
import ResourceUpdates from './panels/ResourceUpdates'
import TeacherTopics from './panels/TeacherTopics'
import ResearchProjectsList from './panels/ResearchProjectsList'
import TeacherStudiosPanel from './panels/TeacherStudiosPanel'
import TeachingResearchTopMetrics from './panels/TeachingResearchTopMetrics'

export const teachingResearchScene = () => <TeachingResearchScene />

export const teachingResearchTopMetrics = () => <TeachingResearchTopMetrics />

export const teachingResearchPanels: { left: PanelConfig[]; right: PanelConfig[] } = {
  left: [
    { id: 'tr-resources', title: '教学资源', height: 'flex-1.15' },
    { id: 'tr-resource-stats', title: '资源统计', height: 'flex-1.05' },
    { id: 'tr-updates', title: '资源更新动态', height: 'flex-0.7' },
  ],
  right: [
    { id: 'tr-topics', title: '教师课题', height: 'flex-1.28' },
    { id: 'tr-projects', title: '课题项目', height: 'flex-1.6' },
    { id: 'tr-studios', title: '名师工作室', height: 'flex-1.2' },
  ],
}

export function renderTeachingResearchPanel(panelId: string) {
  switch (panelId) {
    case 'tr-resources':
      return <TeachingResourcesPanel />
    case 'tr-resource-stats':
      return <ResourceStatistics />
    case 'tr-updates':
      return <ResourceUpdates />
    case 'tr-topics':
      return <TeacherTopics />
    case 'tr-projects':
      return <ResearchProjectsList />
    case 'tr-studios':
      return <TeacherStudiosPanel />
    default:
      return <span style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-size-xs)' }}>待实现</span>
  }
}
