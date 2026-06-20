import { useQuery } from '@tanstack/react-query'
import { fetchApi } from '../client'
import { REFRESH_INTERVALS } from '@/utils/constants'

export interface LeaveData {
  todayTotal: number
  typeDistribution: { name: string; value: number }[]
  gradeDistribution: { name: string; value: number }[]
  records: { id: string; name: string; className: string; type: string; time: string }[]
}

export interface VisitorData {
  todayVisitors: number
  currentVisitors: number
  purposeDistribution: { name: string; value: number }[]
  records: { id: string; name: string; time: string; purpose: string }[]
}

export interface CanteenData {
  todayTotal: number
  meals: { name: string; value: number }[]
  safetyRecords: { id: string; date: string; item: string; result: string }[]
}

export const useLogisticsLeave = () =>
  useQuery<LeaveData>({
    queryKey: ['logistics', 'leave'],
    queryFn: () => fetchApi<LeaveData>('/logistics/leave'),
    refetchInterval: REFRESH_INTERVALS.NEAR_REALTIME,
  })

export const useLogisticsVisitors = () =>
  useQuery<VisitorData>({
    queryKey: ['logistics', 'visitors'],
    queryFn: () => fetchApi<VisitorData>('/logistics/visitors'),
    refetchInterval: REFRESH_INTERVALS.NEAR_REALTIME,
  })

export const useLogisticsCanteen = () =>
  useQuery<CanteenData>({
    queryKey: ['logistics', 'canteen'],
    queryFn: () => fetchApi<CanteenData>('/logistics/canteen'),
    refetchInterval: REFRESH_INTERVALS.REALTIME,
  })
