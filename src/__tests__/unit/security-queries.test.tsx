import { renderHook } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  useSecurityOverview,
  useMonitorStatus,
  useAccessData,
  useLeaveData,
  useVisitorData,
  useAlertData,
  useCanteenData,
} from '@/api/queries/security'

function createWrapper(qc: QueryClient) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={qc}>{children}</QueryClientProvider>
  }
}

describe('Security Query Hooks', () => {
  it('useSecurityOverview returns defined result', () => {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    const { result } = renderHook(() => useSecurityOverview(), { wrapper: createWrapper(qc) })
    expect(result.current).toBeDefined()
  })

  it('useMonitorStatus returns defined result', () => {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    const { result } = renderHook(() => useMonitorStatus(), { wrapper: createWrapper(qc) })
    expect(result.current).toBeDefined()
  })

  it('useAccessData returns defined result', () => {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    const { result } = renderHook(() => useAccessData(), { wrapper: createWrapper(qc) })
    expect(result.current).toBeDefined()
  })

  it('useLeaveData returns defined result', () => {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    const { result } = renderHook(() => useLeaveData(), { wrapper: createWrapper(qc) })
    expect(result.current).toBeDefined()
  })

  it('useVisitorData returns defined result', () => {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    const { result } = renderHook(() => useVisitorData(), { wrapper: createWrapper(qc) })
    expect(result.current).toBeDefined()
  })

  it('useAlertData returns defined result', () => {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    const { result } = renderHook(() => useAlertData(), { wrapper: createWrapper(qc) })
    expect(result.current).toBeDefined()
  })

  it('useCanteenData returns defined result', () => {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    const { result } = renderHook(() => useCanteenData(), { wrapper: createWrapper(qc) })
    expect(result.current).toBeDefined()
  })

  it('all security hooks can be called without crashing', () => {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    const hooks = [
      useSecurityOverview,
      useMonitorStatus,
      useAccessData,
      useLeaveData,
      useVisitorData,
      useAlertData,
      useCanteenData,
    ]
    hooks.forEach(hook => {
      renderHook(() => hook(), { wrapper: createWrapper(qc) })
    })
  })
})
