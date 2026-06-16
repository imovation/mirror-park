import { useQuery } from '@tanstack/react-query'
import { fetchApi } from '../client'
import { REFRESH_INTERVALS } from '@/utils/constants'

export interface TeachingResources { resources: { name: string; value: number; color: string }[] }
export interface ResourceStats { totalResources: number; cloudQuestions: number; cloudResources: number; recentUpdates: number }
export interface ResourceUpdates { recentItems: { id: string; name: string; subject: string; teacher: string; time: string }[] }
export interface TeacherTopics { lessonCases: number; publicAchievements: number; ongoingTopics: number }
export interface ResearchProjects { projects: { id: string; name: string; leader: string; status: string; members: number }[] }
export interface TeacherStudios { studios: { id: string; name: string; host: string; memberCount: number; achievementCount: number; subject: string }[] }

export const useTeachingResources = () => useQuery<TeachingResources>({ queryKey: ['tr', 'resources'], queryFn: () => fetchApi('/teaching-research/resources') })
export const useResourceStats = () => useQuery<ResourceStats>({ queryKey: ['tr', 'resourceStats'], queryFn: () => fetchApi('/teaching-research/resource-stats') })
export const useResourceUpdates = () => useQuery<ResourceUpdates>({ queryKey: ['tr', 'updates'], queryFn: () => fetchApi('/teaching-research/updates'), refetchInterval: REFRESH_INTERVALS.PERIODIC })
export const useTeacherTopics = () => useQuery<TeacherTopics>({ queryKey: ['tr', 'topics'], queryFn: () => fetchApi('/teaching-research/topics') })
export const useResearchProjects = () => useQuery<ResearchProjects>({ queryKey: ['tr', 'projects'], queryFn: () => fetchApi('/teaching-research/projects') })
export const useTeacherStudios = () => useQuery<TeacherStudios>({ queryKey: ['tr', 'studios'], queryFn: () => fetchApi('/teaching-research/studios') })
