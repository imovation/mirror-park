import type { PanelConfig } from '@/types/panel'
import AcademicsScene from './AcademicsScene'
import AcademicsTopMetrics from './panels/AcademicsTopMetrics'
import { ScheduleDistribution } from './panels/ScheduleSpace'
import { AttendanceOverview } from './panels/StudentAttendance'
import AttendanceAndSpace from './panels/AttendanceAndSpace'
import ExamManagement from './panels/ExamManagement'
import TeachingDevices from './panels/TeachingDevices'

export const academicsScene = () => <AcademicsScene />

export const academicsTopMetrics = () => <AcademicsTopMetrics />

export const academicsPanels: { left: PanelConfig[]; right: PanelConfig[] } = {
  left: [
    { id: 'acad-schedule-dist', title: '课表分布', height: 'flex-2' },
    { id: 'acad-devices', title: '教学设备', height: 'flex-2' },
  ],
  right: [
    { id: 'acad-attendance-overview', title: '学生出勤概况', height: 'flex-2' },
    { id: 'acad-attendance-space', title: '出勤排名与空间使用', height: 'flex-2', collapsible: true, collapsedSummary: '班级出勤排名、30日趋势、教室使用率' },
    { id: 'acad-exams', title: '考试管理', height: 'flex-2', collapsible: true, collapsedSummary: '近期考试、各科均分、成绩分布' },
  ],
}

export function renderAcademicsPanel(panelId: string) {
  switch (panelId) {
    case 'acad-schedule-dist': return <ScheduleDistribution />
    case 'acad-attendance-overview': return <AttendanceOverview />
    case 'acad-attendance-space': return <AttendanceAndSpace />
    case 'acad-exams': return <ExamManagement />
    case 'acad-devices': return <TeachingDevices />
    default: return <span style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-size-xs)' }}>待实现</span>
  }
}
