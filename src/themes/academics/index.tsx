import type { PanelConfig } from '@/types/panel'
import AcademicsScene from './AcademicsScene'
import AcademicsTopMetrics from './panels/AcademicsTopMetrics'
import TeachingOverview from './panels/TeachingOverview'
import CourseSchedule from './panels/CourseSchedule'
import ClassroomUsagePanel from './panels/ClassroomUsagePanel'
import StudentAttendance from './panels/StudentAttendance'
import ExamManagement from './panels/ExamManagement'
import ClassManagement from './panels/ClassManagement'
import TeachingDevices from './panels/TeachingDevices'

export const academicsScene = () => <AcademicsScene />

export const academicsTopMetrics = () => <AcademicsTopMetrics />

export const academicsPanels: { left: PanelConfig[]; right: PanelConfig[] } = {
  left: [
    { id: 'acad-schedule', title: '课程安排' },
    { id: 'acad-classroom', title: '教室使用' },
    { id: 'acad-classes', title: '班级管理' },
  ],
  right: [
    { id: 'acad-attendance', title: '学生出勤' },
    { id: 'acad-exams', title: '考试管理' },
    { id: 'acad-devices', title: '教学设备' },
  ],
}

export function renderAcademicsPanel(panelId: string) {
  switch (panelId) {
    case 'acad-overview': return <TeachingOverview />
    case 'acad-schedule': return <CourseSchedule />
    case 'acad-classroom': return <ClassroomUsagePanel />
    case 'acad-attendance': return <StudentAttendance />
    case 'acad-exams': return <ExamManagement />
    case 'acad-classes': return <ClassManagement />
    case 'acad-devices': return <TeachingDevices />
    default: return <span style={{ color: '#6b7280', fontSize: '0.75rem' }}>待实现</span>
  }
}
