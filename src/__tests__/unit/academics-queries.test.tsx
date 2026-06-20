import { renderHook } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  useAcademicsOverview,
  useScheduleData,
  useClassroomUsage,
  useAttendanceData,
  useExamData,
  useClassData,
  useDeviceData,
} from '@/api/queries/academics'

function createWrapper(qc: QueryClient) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={qc}>{children}</QueryClientProvider>
  }
}

describe('Academics Query Hooks', () => {
  it('useAcademicsOverview returns defined result', () => {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    const { result } = renderHook(() => useAcademicsOverview(), { wrapper: createWrapper(qc) })
    expect(result.current).toBeDefined()
  })

  it('useScheduleData returns defined result', () => {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    const { result } = renderHook(() => useScheduleData(), { wrapper: createWrapper(qc) })
    expect(result.current).toBeDefined()
  })

  it('useClassroomUsage returns defined result', () => {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    const { result } = renderHook(() => useClassroomUsage(), { wrapper: createWrapper(qc) })
    expect(result.current).toBeDefined()
  })

  it('useAttendanceData returns defined result', () => {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    const { result } = renderHook(() => useAttendanceData(), { wrapper: createWrapper(qc) })
    expect(result.current).toBeDefined()
  })

  it('useExamData returns defined result', () => {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    const { result } = renderHook(() => useExamData(), { wrapper: createWrapper(qc) })
    expect(result.current).toBeDefined()
  })

  it('useClassData returns defined result', () => {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    const { result } = renderHook(() => useClassData(), { wrapper: createWrapper(qc) })
    expect(result.current).toBeDefined()
  })

  it('useDeviceData returns defined result', () => {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    const { result } = renderHook(() => useDeviceData(), { wrapper: createWrapper(qc) })
    expect(result.current).toBeDefined()
  })

  it('all academics hooks can be called without crashing', () => {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    const hooks = [
      useAcademicsOverview,
      useScheduleData,
      useClassroomUsage,
      useAttendanceData,
      useExamData,
      useClassData,
      useDeviceData,
    ]
    hooks.forEach(hook => {
      renderHook(() => hook(), { wrapper: createWrapper(qc) })
    })
  })
})
