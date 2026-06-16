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
  maleRatio: number
  femaleRatio: number
  education: { name: string; value: number }[]
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
