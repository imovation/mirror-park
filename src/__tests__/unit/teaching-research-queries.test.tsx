import { renderHook } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  useTeachingResources,
  useResourceStats,
  useResourceUpdates,
  useTeacherTopics,
  useResearchProjects,
  useTeacherStudios,
} from '@/api/queries/teachingResearch'

function createWrapper(qc: QueryClient) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={qc}>{children}</QueryClientProvider>
  }
}

describe('Teaching Research Query Hooks', () => {
  it('useTeachingResources returns defined result', () => {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    const { result } = renderHook(() => useTeachingResources(), { wrapper: createWrapper(qc) })
    expect(result.current).toBeDefined()
  })

  it('useResourceStats returns defined result', () => {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    const { result } = renderHook(() => useResourceStats(), { wrapper: createWrapper(qc) })
    expect(result.current).toBeDefined()
  })

  it('useResourceUpdates returns defined result', () => {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    const { result } = renderHook(() => useResourceUpdates(), { wrapper: createWrapper(qc) })
    expect(result.current).toBeDefined()
  })

  it('useTeacherTopics returns defined result', () => {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    const { result } = renderHook(() => useTeacherTopics(), { wrapper: createWrapper(qc) })
    expect(result.current).toBeDefined()
  })

  it('useResearchProjects returns defined result', () => {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    const { result } = renderHook(() => useResearchProjects(), { wrapper: createWrapper(qc) })
    expect(result.current).toBeDefined()
  })

  it('useTeacherStudios returns defined result', () => {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    const { result } = renderHook(() => useTeacherStudios(), { wrapper: createWrapper(qc) })
    expect(result.current).toBeDefined()
  })

  it('all teaching-research hooks can be called without crashing', () => {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    const hooks = [
      useTeachingResources,
      useResourceStats,
      useResourceUpdates,
      useTeacherTopics,
      useResearchProjects,
      useTeacherStudios,
    ]
    hooks.forEach(hook => {
      renderHook(() => hook(), { wrapper: createWrapper(qc) })
    })
  })
})
