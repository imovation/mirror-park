import { useQuery } from '@tanstack/react-query'
import { fetchApi } from '../client'
import { REFRESH_INTERVALS } from '@/utils/constants'

export interface SecurityOverview { cameraCount: number; accessDeviceCount: number; todayAlerts: number; todayVisitors: number }
export interface MonitorStatus { total: number; online: number; offline: number; faulty: number; regionDistribution: {name:string;value:number}[]; coverage: number }
export interface AccessData { todayTotal: number; points: {name:string;value:number}[]; hourlyDistribution: {hours:string[];values:number[]}; abnormalRecords: {id:string;time:string;location:string;type:string;status:string}[] }
export interface LeaveData { todayTotal: number; typeDistribution: {name:string;value:number}[]; gradeDistribution: {name:string;value:number}[]; records: {id:string;name:string;className:string;type:string;time:string}[] }
export interface VisitorData { todayVisitors: number; currentVisitors: number; purposeDistribution: {name:string;value:number}[]; records: {id:string;name:string;time:string;purpose:string;idNumber:string}[] }
export interface AlertData { todayTotal: number; typeDistribution: {name:string;value:number}[]; handledRatio: number; unhandledRatio: number; records: {id:string;time:string;type:string;location:string;status:string}[] }
export interface CanteenData { todayTotal: number; meals: {name:string;value:number}[]; safetyRecords: {id:string;date:string;item:string;result:string}[] }

export const useSecurityOverview = () => useQuery<SecurityOverview>({ queryKey: ['security','overview'], queryFn: () => fetchApi('/security/overview'), refetchInterval: REFRESH_INTERVALS.REALTIME })
export const useMonitorStatus = () => useQuery<MonitorStatus>({ queryKey: ['security','monitor'], queryFn: () => fetchApi('/security/monitor'), refetchInterval: REFRESH_INTERVALS.REALTIME })
export const useAccessData = () => useQuery<AccessData>({ queryKey: ['security','access'], queryFn: () => fetchApi('/security/access'), refetchInterval: REFRESH_INTERVALS.REALTIME })
export const useLeaveData = () => useQuery<LeaveData>({ queryKey: ['security','leave'], queryFn: () => fetchApi('/security/leave'), refetchInterval: REFRESH_INTERVALS.NEAR_REALTIME })
export const useVisitorData = () => useQuery<VisitorData>({ queryKey: ['security','visitor'], queryFn: () => fetchApi('/security/visitor'), refetchInterval: REFRESH_INTERVALS.REALTIME })
export const useAlertData = () => useQuery<AlertData>({ queryKey: ['security','alerts'], queryFn: () => fetchApi('/security/alerts'), refetchInterval: REFRESH_INTERVALS.REALTIME })
export const useCanteenData = () => useQuery<CanteenData>({ queryKey: ['security','canteen'], queryFn: () => fetchApi('/security/canteen'), refetchInterval: REFRESH_INTERVALS.REALTIME })
