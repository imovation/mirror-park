import { renderWithProviders, screen, waitFor } from '@/__tests__/test-utils'
import { QueryClient } from '@tanstack/react-query'

import NoticeBoard from '@/themes/admin/panels/NoticeBoard'
import DutySchedule from '@/themes/admin/panels/DutySchedule'
import SchoolCalendar from '@/themes/admin/panels/SchoolCalendar'
import StaffAttendance from '@/themes/admin/panels/StaffAttendance'
import MeetingManagement from '@/themes/admin/panels/MeetingManagement'

function fillQueryCache(qc: QueryClient, key: string[], data: unknown) {
  qc.setQueryData(key, data)
}

function createQC() {
  return new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } })
}

describe('Admin Panel Integration', () => {
  describe('NoticeBoard', () => {
    it('renders notices when loaded', async () => {
      const qc = createQC()
      fillQueryCache(qc, ['admin', 'notices'], {
        notices: [
          { id: '1', title: '关于召开教职工大会的通知', department: '校办', date: '2024-01-20', type: '行政' },
        ],
      })
      renderWithProviders(<NoticeBoard />, { queryClient: qc })
      await waitFor(() => {
        expect(screen.getByText('行政')).toBeInTheDocument()
      })
    })

    it('shows empty state when data is null', async () => {
      const qc = createQC()
      fillQueryCache(qc, ['admin', 'notices'], null)
      renderWithProviders(<NoticeBoard />, { queryClient: qc })
      await waitFor(() => {
        expect(screen.getByText('暂无数据')).toBeInTheDocument()
      })
    })
  })

  describe('DutySchedule', () => {
    it('renders duty data when loaded', async () => {
      const qc = createQC()
      fillQueryCache(qc, ['admin', 'duty'], {
        staffs: [
          { role: '行政值班', name: '张校长', phone: '13800000001' },
          { role: '教师值班', name: '李老师', phone: '13800000002' },
        ],
      })
      renderWithProviders(<DutySchedule />, { queryClient: qc })
      await waitFor(() => {
        expect(screen.getByText('行政值班')).toBeInTheDocument()
        expect(screen.getByText('教师值班')).toBeInTheDocument()
      })
    })

    it('shows empty state when data is null', async () => {
      const qc = createQC()
      fillQueryCache(qc, ['admin', 'duty'], null)
      renderWithProviders(<DutySchedule />, { queryClient: qc })
      await waitFor(() => {
        expect(screen.getByText('暂无数据')).toBeInTheDocument()
      })
    })
  })

  describe('SchoolCalendar', () => {
    it('renders calendar when loaded', async () => {
      const qc = createQC()
      fillQueryCache(qc, ['admin', 'calendar'], {
        thisWeek: [{ date: '2024-01-15', event: '行政办公会', type: '会议' }],
        upcomingEvents: [{ date: '2024-01-22', event: '期末考试' }],
        holidays: [{ date: '2024-02-10', event: '春节放假' }],
      })
      renderWithProviders(<SchoolCalendar />, { queryClient: qc })
      await waitFor(() => {
        expect(screen.getByText('会议')).toBeInTheDocument()
      })
    })

    it('shows empty state when data is null', async () => {
      const qc = createQC()
      fillQueryCache(qc, ['admin', 'calendar'], null)
      renderWithProviders(<SchoolCalendar />, { queryClient: qc })
      await waitFor(() => {
        expect(screen.getByText('暂无数据')).toBeInTheDocument()
      })
    })
  })

  describe('StaffAttendance', () => {
    it('renders attendance when loaded', async () => {
      const qc = createQC()
      fillQueryCache(qc, ['admin', 'attendance'], {
        todayPresent: 185,
        todayLeave: 8,
        todayAbsent: 3,
        departmentRates: [{ name: '教务处', value: 98 }],
        monthlyTrend: { days: ['01', '02'], values: [96, 97] },
      })
      renderWithProviders(<StaffAttendance />, { queryClient: qc })
      await waitFor(() => {
        expect(screen.getByText('今日出勤')).toBeInTheDocument()
        expect(screen.getByText('请假')).toBeInTheDocument()
        expect(screen.getByText('各部门出勤率')).toBeInTheDocument()
      })
    })

    it('shows empty state when data is null', async () => {
      const qc = createQC()
      fillQueryCache(qc, ['admin', 'attendance'], null)
      renderWithProviders(<StaffAttendance />, { queryClient: qc })
      await waitFor(() => {
        expect(screen.getByText('暂无数据')).toBeInTheDocument()
      })
    })
  })

  describe('MeetingManagement', () => {
    it('renders meeting data when loaded', async () => {
      const qc = createQC()
      fillQueryCache(qc, ['admin', 'meetings'], {
        todayCount: 3,
        weekCount: 12,
        rooms: [
          { name: '会议室A', status: '使用中' },
          { name: '会议室B', status: '空闲' },
        ],
        upcoming: [{ id: '1', title: '教研组长会议', time: '14:00', room: '会议室A', date: '2024-01-15' }],
      })
      renderWithProviders(<MeetingManagement />, { queryClient: qc })
      await waitFor(() => {
        expect(screen.getByText('今日会议 / 场')).toBeInTheDocument()
        expect(screen.getByText('会议室状态')).toBeInTheDocument()
      })
    })

    it('shows empty state when data is null', async () => {
      const qc = createQC()
      fillQueryCache(qc, ['admin', 'meetings'], null)
      renderWithProviders(<MeetingManagement />, { queryClient: qc })
      await waitFor(() => {
        expect(screen.getByText('暂无数据')).toBeInTheDocument()
      })
    })
  })
})
