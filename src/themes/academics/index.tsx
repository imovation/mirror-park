import type { PanelConfig } from '@/types/panel'
import AcademicsScene from './AcademicsScene'
import AcademicsTopMetrics from './panels/AcademicsTopMetrics'
import ScheduleSpace from './panels/ScheduleSpace'
import StudentAttendance from './panels/StudentAttendance'
import ExamManagement from './panels/ExamManagement'
import TeachingDevices from './panels/TeachingDevices'

export const academicsScene = () => <AcademicsScene />

export const academicsTopMetrics = () => <AcademicsTopMetrics />

export const academicsPanels: { left: PanelConfig[]; right: PanelConfig[] } = {
  left: [
    { id: 'acad-schedule-space', title: '课表与空间调度', height: 'flex-3', collapsible: true, collapsedSummary: '教室使用率、课程分布、设备利用率' },
    { id: 'acad-devices', title: '教学设备', height: 'flex-2' },
  ],
  right: [
    { id: 'acad-attendance', title: '学生出勤', height: 'flex-3', collapsible: true, collapsedSummary: '出勤率、年级对比、班级排名、30日趋势' },
    { id: 'acad-exams', title: '考试管理', height: 'flex-3', collapsible: true, collapsedSummary: '近期考试、各科均分、成绩分布' },
  ],
}

export function renderAcademicsPanel(panelId: string) {
  switch (panelId) {
    case 'acad-schedule-space': return <ScheduleSpace />
    case 'acad-attendance': return <StudentAttendance />
    case 'acad-exams': return <ExamManagement />
    case 'acad-devices': return <TeachingDevices />
    default: return <span style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-size-xs)' }}>待实现</span>
  }
}
