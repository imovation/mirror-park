import type { PanelConfig } from '@/types/panel'
import AcademicsScene from './AcademicsScene'

export const academicsScene = () => <AcademicsScene />

export const academicsPanels: { left: PanelConfig[]; right: PanelConfig[] } = {
  left: [
    { id: 'acad-overview', title: '教学概况' },
    { id: 'acad-schedule', title: '课程安排' },
    { id: 'acad-classroom', title: '教室使用' },
  ],
  right: [
    { id: 'acad-attendance', title: '学生出勤' },
    { id: 'acad-exams', title: '考试管理' },
    { id: 'acad-classes', title: '班级管理' },
    { id: 'acad-devices', title: '教学设备' },
  ],
}

export function renderAcademicsPanel(_panelId: string) {
  return <span style={{ color: '#6b7280', fontSize: '0.75rem' }}>待实现</span>
}
