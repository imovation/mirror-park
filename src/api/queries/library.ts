import { useQuery } from '@tanstack/react-query'
import { fetchApi } from '../client'
import { REFRESH_INTERVALS } from '@/utils/constants'

export interface Collection {
  paperBooks: number
  ebooks: number
  journals: number
  newspapers: number
}

export interface BorrowStats {
  todayBorrow: number
  yesterdayBorrow: number
  todayReturn: number
  totalBorrowed: number
  overdue: number
  trend: {
    days: string[]
    borrow: number[]
    return: number[]
  }
}

export interface HotBooks {
  top10: { name: string; author: string; count: number }[]
  categoryRatio: { name: string; value: number }[]
  recommendBooks: { name: string; author: string }[]
}

export interface ClassRank {
  classRank: { name: string; value: number }[]
  gradeComparison: { name: string; value: number }[]
  readingStars: { name: string; className: string; count: number }[]
}

export interface LibraryActivities {
  activities: { id: string; title: string; date: string; status: string }[]
}

export interface LibraryVisitors {
  todayVisitors: number
  currentVisitors: number
  hourlyDistribution: { hours: string[]; values: number[] }
}

export const useCollection = () =>
  useQuery<Collection>({ queryKey: ['library', 'collection'], queryFn: () => fetchApi('/library/collection') })

export const useBorrowStats = () =>
  useQuery<BorrowStats>({ queryKey: ['library', 'borrowStats'], queryFn: () => fetchApi('/library/borrow-stats'), refetchInterval: REFRESH_INTERVALS.NEAR_REALTIME })

export const useHotBooks = () =>
  useQuery<HotBooks>({ queryKey: ['library', 'hotBooks'], queryFn: () => fetchApi('/library/hot-books') })

export const useClassRank = () =>
  useQuery<ClassRank>({ queryKey: ['library', 'classRank'], queryFn: () => fetchApi('/library/class-rank') })

export const useLibraryActivities = () =>
  useQuery<LibraryActivities>({ queryKey: ['library', 'activities'], queryFn: () => fetchApi('/library/activities') })

export const useLibraryVisitors = () =>
  useQuery<LibraryVisitors>({ queryKey: ['library', 'visitors'], queryFn: () => fetchApi('/library/visitors'), refetchInterval: REFRESH_INTERVALS.NEAR_REALTIME })

export interface NewArrivals {
  weeklyCount: number
  categories: { name: string; value: number }[]
  books: { id: string; title: string; author: string; category: string; date: string }[]
}

export const useNewArrivals = () =>
  useQuery<NewArrivals>({ queryKey: ['library', 'newArrivals'], queryFn: () => fetchApi('/library/new-arrivals') })
