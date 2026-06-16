import { useQuery } from '@tanstack/react-query'
import { fetchApi } from '../client'
import { REFRESH_INTERVALS } from '@/utils/constants'

export interface AdminOverview { departmentCount: number; staffCount: number; attendanceRate: number; roomCount: number }
export interface NoticeData { notices: { id: string; title: string; department: string; date: string; type: string }[] }
export interface DutyData { staffs: { role: string; name: string; phone: string }[] }
export interface CalendarData { thisWeek: { date: string; event: string; type: string }[]; upcomingEvents: { date: string; event: string }[]; holidays: { date: string; event: string }[] }
export interface AdminAttendance { todayPresent: number; todayLeave: number; todayAbsent: number; departmentRates: { name: string; value: number }[]; monthlyTrend: { days: string[]; values: number[] } }
export interface MeetingData { todayCount: number; weekCount: number; rooms: { name: string; status: string }[]; upcoming: { id: string; title: string; time: string; room: string; date: string }[] }

export const useAdminOverview = () => useQuery<AdminOverview>({ queryKey: ['admin', 'overview'], queryFn: () => fetchApi('/admin/overview'), refetchInterval: REFRESH_INTERVALS.NEAR_REALTIME })
export const useNoticeData = () => useQuery<NoticeData>({ queryKey: ['admin', 'notices'], queryFn: () => fetchApi('/admin/notices') })
export const useDutyData = () => useQuery<DutyData>({ queryKey: ['admin', 'duty'], queryFn: () => fetchApi('/admin/duty') })
export const useCalendarData = () => useQuery<CalendarData>({ queryKey: ['admin', 'calendar'], queryFn: () => fetchApi('/admin/calendar') })
export const useAdminAttendance = () => useQuery<AdminAttendance>({ queryKey: ['admin', 'attendance'], queryFn: () => fetchApi('/admin/attendance'), refetchInterval: REFRESH_INTERVALS.NEAR_REALTIME })
export const useMeetingData = () => useQuery<MeetingData>({ queryKey: ['admin', 'meetings'], queryFn: () => fetchApi('/admin/meetings'), refetchInterval: REFRESH_INTERVALS.NEAR_REALTIME })
