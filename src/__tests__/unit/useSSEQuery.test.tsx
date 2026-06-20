import { renderHook, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useSSE } from '@/api/useSSEQuery'

function createWrapper(qc: QueryClient) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={qc}>{children}</QueryClientProvider>
  }
}

describe('useSSE', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('starts with connecting status', () => {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    const { result } = renderHook(() => useSSE(), { wrapper: createWrapper(qc) })
    expect(result.current.status).toBe('connecting')
  })

  it('returns connected status after mock client connects', () => {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    const { result } = renderHook(() => useSSE(), { wrapper: createWrapper(qc) })

    act(() => { vi.advanceTimersByTime(600) })
    expect(result.current.status).toBe('connected')
  })

  it('injects data into QueryClient via setQueryData', () => {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    renderHook(() => useSSE(), { wrapper: createWrapper(qc) })

    act(() => { vi.advanceTimersByTime(600) })
    act(() => { vi.advanceTimersByTime(16000) })

    const activityData = qc.getQueryData(['overview', 'activity'])
    expect(activityData).toBeDefined()
    expect(activityData).toHaveProperty('hours')
    expect(activityData).toHaveProperty('values')
  })
})
