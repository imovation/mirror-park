import type { PanelConfig } from '@/types/panel'
import AdminScene from './AdminScene'
import AdminTopMetrics from './panels/AdminTopMetrics'
import AdminOverview from './panels/AdminOverview'
import NoticeBoard from './panels/NoticeBoard'
import DutySchedule from './panels/DutySchedule'
import SchoolCalendar from './panels/SchoolCalendar'
import StaffAttendance from './panels/StaffAttendance'
import MeetingManagement from './panels/MeetingManagement'

export const adminScene = () => <AdminScene />

export const adminTopMetrics = () => <AdminTopMetrics />

export const adminPanels: { left: PanelConfig[]; right: PanelConfig[] } = {
  left: [
    { id: 'admin-notices', title: '通知公告' },
    { id: 'admin-duty', title: '值班安排' },
  ],
  right: [
    { id: 'admin-calendar', title: '校历日程' },
    { id: 'admin-attendance', title: '教职工考勤' },
    { id: 'admin-meetings', title: '会议管理' },
  ],
}

export function renderAdminPanel(panelId: string) {
  switch (panelId) {
    case 'admin-overview': return <AdminOverview />
    case 'admin-notices': return <NoticeBoard />
    case 'admin-duty': return <DutySchedule />
    case 'admin-calendar': return <SchoolCalendar />
    case 'admin-attendance': return <StaffAttendance />
    case 'admin-meetings': return <MeetingManagement />
    default: return <span style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-size-xs)' }}>待实现</span>
  }
}
