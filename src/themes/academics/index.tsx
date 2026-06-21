import type { PanelConfig } from '@/types/panel'
import AcademicsScene from './AcademicsScene'
import AcademicsTopMetrics from './panels/AcademicsTopMetrics'
import { ScheduleDistribution, SpaceUsage } from './panels/ScheduleSpace'
import { AttendanceOverview, AttendanceTrend } from './panels/StudentAttendance'
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
    { id: 'acad-attendance-trend', title: '出勤排名与趋势', height: 'flex-2', collapsible: true, collapsedSummary: '班级出勤排名、30日趋势' },
    { id: 'acad-space-usage', title: '空间使用率', height: 'flex-2', collapsible: true, collapsedSummary: '教室类型、空间利用率、实时冲突' },
    { id: 'acad-exams', title: '考试管理', height: 'flex-2', collapsible: true, collapsedSummary: '近期考试、各科均分、成绩分布' },
  ],
}

export function renderAcademicsPanel(panelId: string) {
  switch (panelId) {
    case 'acad-schedule-dist': return <ScheduleDistribution />
    case 'acad-space-usage': return <SpaceUsage />
    case 'acad-attendance-overview': return <AttendanceOverview />
    case 'acad-attendance-trend': return <AttendanceTrend />
    case 'acad-exams': return <ExamManagement />
    case 'acad-devices': return <TeachingDevices />
    default: return <span style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-size-xs)' }}>待实现</span>
  }
}
