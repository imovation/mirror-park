import { renderHook } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  useCollection,
  useBorrowStats,
  useHotBooks,
  useClassRank,
  useLibraryActivities,
  useLibraryVisitors,
} from '@/api/queries/library'

function createWrapper(qc: QueryClient) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={qc}>{children}</QueryClientProvider>
  }
}

describe('Library Query Hooks', () => {
  it('useCollection returns defined result', () => {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    const { result } = renderHook(() => useCollection(), { wrapper: createWrapper(qc) })
    expect(result.current).toBeDefined()
  })

  it('useBorrowStats returns defined result', () => {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    const { result } = renderHook(() => useBorrowStats(), { wrapper: createWrapper(qc) })
    expect(result.current).toBeDefined()
  })

  it('useHotBooks returns defined result', () => {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    const { result } = renderHook(() => useHotBooks(), { wrapper: createWrapper(qc) })
    expect(result.current).toBeDefined()
  })

  it('useClassRank returns defined result', () => {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    const { result } = renderHook(() => useClassRank(), { wrapper: createWrapper(qc) })
    expect(result.current).toBeDefined()
  })

  it('useLibraryActivities returns defined result', () => {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    const { result } = renderHook(() => useLibraryActivities(), { wrapper: createWrapper(qc) })
    expect(result.current).toBeDefined()
  })

  it('useLibraryVisitors returns defined result', () => {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    const { result } = renderHook(() => useLibraryVisitors(), { wrapper: createWrapper(qc) })
    expect(result.current).toBeDefined()
  })

  it('all library hooks can be called without crashing', () => {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    const hooks = [
      useCollection,
      useBorrowStats,
      useHotBooks,
      useClassRank,
      useLibraryActivities,
      useLibraryVisitors,
    ]
    hooks.forEach(hook => {
      renderHook(() => hook(), { wrapper: createWrapper(qc) })
    })
  })
})
