import { useQuery } from '@tanstack/react-query'
import { fetchApi } from '../client'
import { REFRESH_INTERVALS } from '@/utils/constants'

export interface SchoolInfo {
  landArea: number
  buildingArea: number
  classCount: number
  buildingCount: number
}

export interface PersonnelComposition {
  totalTeachers: number
  maleCount: number
  femaleCount: number
  maleRatio: number
  femaleRatio: number
  education: { name: string; value: number }[]
}

export interface TeacherDistribution {
  subjects: { name: string; value: number }[]
  titles: { name: string; value: number }[]
}

export interface StudentInfo {
  grades: { name: string; male: number; female: number; total: number }[]
}

export interface ActivityData {
  hours: string[]
  values: number[]
}

export const useSchoolInfo = () =>
  useQuery<SchoolInfo>({
    queryKey: ['overview', 'schoolInfo'],
    queryFn: () => fetchApi<SchoolInfo>('/overview/school-info'),
  })

export const usePersonnelComposition = () =>
  useQuery<PersonnelComposition>({
    queryKey: ['overview', 'personnel'],
    queryFn: () => fetchApi<PersonnelComposition>('/overview/personnel'),
    refetchInterval: REFRESH_INTERVALS.NEAR_REALTIME,
  })

export const useTeacherDistribution = () =>
  useQuery<TeacherDistribution>({
    queryKey: ['overview', 'teacherDistribution'],
    queryFn: () => fetchApi<TeacherDistribution>('/overview/teacher-distribution'),
  })

export const useStudentInfo = () =>
  useQuery<StudentInfo>({
    queryKey: ['overview', 'studentInfo'],
    queryFn: () => fetchApi<StudentInfo>('/overview/student-info'),
  })

export const useActivity = () =>
  useQuery<ActivityData>({
    queryKey: ['overview', 'activity'],
    queryFn: () => fetchApi<ActivityData>('/overview/activity'),
    refetchInterval: REFRESH_INTERVALS.NEAR_REALTIME,
  })

export interface RecentActivityItem {
  id: string
  time: string
  title: string
  status: string
}

export const useRecentActivity = () =>
  useQuery<RecentActivityItem[]>({
    queryKey: ['overview', 'recentActivity'],
    queryFn: () => fetchApi<RecentActivityItem[]>('/overview/recent-activity'),
    refetchInterval: REFRESH_INTERVALS.NEAR_REALTIME,
  })
