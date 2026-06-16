import type { PanelConfig } from '@/types/panel'
import TeachingResearchScene from './TeachingResearchScene'

export const teachingResearchScene = () => <TeachingResearchScene />

export const teachingResearchPanels: { left: PanelConfig[]; right: PanelConfig[] } = {
  left: [
    { id: 'tr-resources', title: '教学资源' },
    { id: 'tr-resource-stats', title: '资源统计' },
    { id: 'tr-updates', title: '资源更新动态' },
  ],
  right: [
    { id: 'tr-topics', title: '教师课题' },
    { id: 'tr-projects', title: '课题项目' },
    { id: 'tr-studios', title: '名师工作室' },
  ],
}

export function renderTeachingResearchPanel(_panelId: string) {
  return <span style={{ color: '#6b7280', fontSize: '0.75rem' }}>待实现</span>
}
