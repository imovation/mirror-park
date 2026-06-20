import { renderHook } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  useAdminOverview,
  useNoticeData,
  useDutyData,
  useCalendarData,
  useAdminAttendance,
  useMeetingData,
} from '@/api/queries/admin'

function createWrapper(qc: QueryClient) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={qc}>{children}</QueryClientProvider>
  }
}

describe('Admin Query Hooks', () => {
  it('useAdminOverview returns defined result', () => {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    const { result } = renderHook(() => useAdminOverview(), { wrapper: createWrapper(qc) })
    expect(result.current).toBeDefined()
  })

  it('useNoticeData returns defined result', () => {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    const { result } = renderHook(() => useNoticeData(), { wrapper: createWrapper(qc) })
    expect(result.current).toBeDefined()
  })

  it('useDutyData returns defined result', () => {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    const { result } = renderHook(() => useDutyData(), { wrapper: createWrapper(qc) })
    expect(result.current).toBeDefined()
  })

  it('useCalendarData returns defined result', () => {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    const { result } = renderHook(() => useCalendarData(), { wrapper: createWrapper(qc) })
    expect(result.current).toBeDefined()
  })

  it('useAdminAttendance returns defined result', () => {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    const { result } = renderHook(() => useAdminAttendance(), { wrapper: createWrapper(qc) })
    expect(result.current).toBeDefined()
  })

  it('useMeetingData returns defined result', () => {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    const { result } = renderHook(() => useMeetingData(), { wrapper: createWrapper(qc) })
    expect(result.current).toBeDefined()
  })

  it('all admin hooks can be called without crashing', () => {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    const hooks = [
      useAdminOverview,
      useNoticeData,
      useDutyData,
      useCalendarData,
      useAdminAttendance,
      useMeetingData,
    ]
    hooks.forEach(hook => {
      renderHook(() => hook(), { wrapper: createWrapper(qc) })
    })
  })
})
