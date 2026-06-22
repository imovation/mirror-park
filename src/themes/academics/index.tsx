import type { PanelConfig } from '@/types/panel'
import AcademicsScene from './AcademicsScene'
import AcademicsTopMetrics from './panels/AcademicsTopMetrics'
import { ScheduleDistribution } from './panels/ScheduleSpace'
import { AttendanceOverview } from './panels/StudentAttendance'
import ClassAttendanceRank from './panels/ClassAttendanceRank'
import ClassroomSpaceUsage from './panels/ClassroomSpaceUsage'
import ExamManagement from './panels/ExamManagement'
import TeachingDevices from './panels/TeachingDevices'

export const academicsScene = () => <AcademicsScene />

export const academicsTopMetrics = () => <AcademicsTopMetrics />

export const academicsPanels: { left: PanelConfig[]; right: PanelConfig[] } = {
  left: [
    { id: 'acad-schedule-dist', title: '课表分布', height: 'flex-0.85' },
    { id: 'acad-devices', title: '教学设备', height: 'flex-0.85' },
    { id: 'acad-space-usage', title: '教室空间使用', height: 'flex-1', collapsible: true, collapsedSummary: '使用率环形图、各楼宇对比' },
  ],
  right: [
    { id: 'acad-attendance-overview', title: '学生出勤概况', height: 'flex-2' },
    { id: 'acad-attendance-rank', title: '出勤排名与趋势', height: 'flex-2', collapsible: true, collapsedSummary: '班级出勤排名、30日趋势' },
    { id: 'acad-exams', title: '考试管理', height: 'flex-2.8', collapsible: true, collapsedSummary: '近期考试、各科均分、成绩分布' },
  ],
}

export function renderAcademicsPanel(panelId: string) {
  switch (panelId) {
    case 'acad-schedule-dist': return <ScheduleDistribution />
    case 'acad-attendance-overview': return <AttendanceOverview />
    case 'acad-attendance-rank': return <ClassAttendanceRank />
    case 'acad-space-usage': return <ClassroomSpaceUsage />
    case 'acad-exams': return <ExamManagement />
    case 'acad-devices': return <TeachingDevices />
    default: return <span style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-size-xs)' }}>待实现</span>
  }
}
