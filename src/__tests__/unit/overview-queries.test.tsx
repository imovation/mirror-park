import { renderHook } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  useSchoolInfo,
  usePersonnelComposition,
  useTeacherDistribution,
  useStudentInfo,
  useActivity,
  useRecentActivity,
  useAssetData,
  useRoomDistribution,
} from '@/api/queries/overview'

function createWrapper(qc: QueryClient) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={qc}>{children}</QueryClientProvider>
  }
}

describe('Overview Query Hooks', () => {
  it('useSchoolInfo returns defined result', () => {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    const { result } = renderHook(() => useSchoolInfo(), { wrapper: createWrapper(qc) })
    expect(result.current).toBeDefined()
  })

  it('usePersonnelComposition returns defined result', () => {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    const { result } = renderHook(() => usePersonnelComposition(), { wrapper: createWrapper(qc) })
    expect(result.current).toBeDefined()
  })

  it('useTeacherDistribution returns defined result', () => {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    const { result } = renderHook(() => useTeacherDistribution(), { wrapper: createWrapper(qc) })
    expect(result.current).toBeDefined()
  })

  it('useStudentInfo returns defined result', () => {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    const { result } = renderHook(() => useStudentInfo(), { wrapper: createWrapper(qc) })
    expect(result.current).toBeDefined()
  })

  it('useActivity returns defined result', () => {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    const { result } = renderHook(() => useActivity(), { wrapper: createWrapper(qc) })
    expect(result.current).toBeDefined()
  })

  it('useRecentActivity returns defined result', () => {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    const { result } = renderHook(() => useRecentActivity(), { wrapper: createWrapper(qc) })
    expect(result.current).toBeDefined()
  })

  it('useAssetData returns defined result', () => {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    const { result } = renderHook(() => useAssetData(), { wrapper: createWrapper(qc) })
    expect(result.current).toBeDefined()
  })

  it('useRoomDistribution returns defined result', () => {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    const { result } = renderHook(() => useRoomDistribution(), { wrapper: createWrapper(qc) })
    expect(result.current).toBeDefined()
  })

  it('all overview hooks can be called without crashing', () => {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    const hooks = [
      useSchoolInfo,
      usePersonnelComposition,
      useTeacherDistribution,
      useStudentInfo,
      useActivity,
      useRecentActivity,
      useAssetData,
      useRoomDistribution,
    ]
    hooks.forEach(hook => {
      renderHook(() => hook(), { wrapper: createWrapper(qc) })
    })
  })
})
