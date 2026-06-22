import type { PanelConfig } from '@/types/panel'
import AdminScene from './AdminScene'
import AdminTopMetrics from './panels/AdminTopMetrics'
import NoticeBoard from './panels/NoticeBoard'
import DutySchedule from './panels/DutySchedule'
import SchoolCalendar from './panels/SchoolCalendar'
import StaffAttendance from './panels/StaffAttendance'
import MeetingManagement from './panels/MeetingManagement'
import RecentMeetings from './panels/RecentMeetings'

export const adminScene = () => <AdminScene />

export const adminTopMetrics = () => <AdminTopMetrics />

export const adminPanels: { left: PanelConfig[]; right: PanelConfig[] } = {
  left: [
    { id: 'admin-notices', title: '通知公告', height: 'flex-1' },
    { id: 'admin-duty', title: '值班安排', height: 'flex-2' },
    { id: 'admin-meetings', title: '会议管理', height: 'flex-2' },
  ],
  right: [
    { id: 'admin-calendar', title: '校历日程', height: 'flex-2' },
    { id: 'admin-recent-meetings', title: '近期会议', height: 'flex-1' },
    { id: 'admin-attendance', title: '教职工考勤', height: 'flex-3' },
  ],
}

export function renderAdminPanel(panelId: string) {
  switch (panelId) {
    case 'admin-notices': return <NoticeBoard />
    case 'admin-duty': return <DutySchedule />
    case 'admin-calendar': return <SchoolCalendar />
    case 'admin-attendance': return <StaffAttendance />
    case 'admin-meetings': return <MeetingManagement />
    case 'admin-recent-meetings': return <RecentMeetings />
    default: return <span style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-size-xs)' }}>待实现</span>
  }
}
