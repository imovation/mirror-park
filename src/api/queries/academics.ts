import { useQuery } from '@tanstack/react-query'
import { fetchApi } from '../client'
import { REFRESH_INTERVALS } from '@/utils/constants'

export interface AcademicsOverview { todayCourses: number; activeCourses: number; totalClassrooms: number; usageRate: number }
export interface ScheduleData { gradeDistribution: {name:string;value:number}[]; subjectDistribution: {name:string;value:number}[]; timeDistribution: {hours:string[];values:number[]} }
export interface ClassroomUsage { inUse: number; available: number; buildingUsage: {name:string;value:number}[]; typeDistribution: {name:string;value:number}[] }
export interface AttendanceData { todayRate: number; gradeRates: {name:string;value:number}[]; classRank: {name:string;value:number}[]; trend: {days:string[];values:number[]} }
export interface ExamData { upcomingExams: {id:string;subject:string;date:string;grade:string}[]; semesterExamCount: number; gradeAverages: {name:string;value:number}[]; scoreDistribution: {name:string;value:number}[] }
export interface ClassData { totalClasses: number; gradeClasses: {name:string;count:number}[]; classList: {id:string;name:string;headTeacher:string;studentCount:number}[] }
export interface DeviceData { total: number; online: number; offline: number; faulty: number; typeDistribution: {name:string;value:number}[] }

export const useAcademicsOverview = () => useQuery<AcademicsOverview>({ queryKey: ['academics','overview'], queryFn: () => fetchApi('/academics/overview'), refetchInterval: REFRESH_INTERVALS.NEAR_REALTIME })
export const useScheduleData = () => useQuery<ScheduleData>({ queryKey: ['academics','schedule'], queryFn: () => fetchApi('/academics/schedule') })
export const useClassroomUsage = () => useQuery<ClassroomUsage>({ queryKey: ['academics','classroomUsage'], queryFn: () => fetchApi('/academics/classroom-usage'), refetchInterval: REFRESH_INTERVALS.NEAR_REALTIME })
export const useAttendanceData = () => useQuery<AttendanceData>({ queryKey: ['academics','attendance'], queryFn: () => fetchApi('/academics/attendance'), refetchInterval: REFRESH_INTERVALS.NEAR_REALTIME })
export const useExamData = () => useQuery<ExamData>({ queryKey: ['academics','exam'], queryFn: () => fetchApi('/academics/exam') })
export const useClassData = () => useQuery<ClassData>({ queryKey: ['academics','classes'], queryFn: () => fetchApi('/academics/classes') })
export const useDeviceData = () => useQuery<DeviceData>({ queryKey: ['academics','devices'], queryFn: () => fetchApi('/academics/devices'), refetchInterval: REFRESH_INTERVALS.REALTIME })
