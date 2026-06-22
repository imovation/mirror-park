import { renderHook, act, render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useSSE } from '@/api/useSSEQuery'
import AlertEvents from '@/themes/security/panels/AlertEvents'
import StudentInfo from '@/themes/overview/panels/StudentInfo'
import ActivityTimeStats from '@/themes/overview/panels/ActivityTimeStats'

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

  it('injects all SSE event types into correct query keys', () => {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    renderHook(() => useSSE(), { wrapper: createWrapper(qc) })

    // Connect (500ms) + all 6 staggered events (15000 + 0*3000 through 5*3000)
    act(() => { vi.advanceTimersByTime(35000) })

    const keys = [
      ['overview', 'activity'],
      ['overview', 'personnel'],
      ['overview', 'schoolInfo'],
      ['overview', 'teacherDistribution'],
      ['overview', 'studentInfo'],
      ['security', 'alerts'],
    ]
    for (const key of keys) {
      const data = qc.getQueryData(key)
      expect(data).toBeDefined()
    }
  })
})

describe('SSE data → Panel compatibility', () => {
  it('security.alerts data renders AlertEvents without crash', async () => {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    qc.setQueryData(['security', 'alerts'], {
      todayTotal: 3,
      typeDistribution: [
        { name: '周界入侵', value: 0 },
        { name: '火警预警', value: 0 },
        { name: '设备异常', value: 1 },
        { name: '门禁告警', value: 2 },
        { name: '异常聚集', value: 0 },
      ],
      handledRatio: 2 / 3,
      unhandledRatio: 1 / 3,
      records: [
        { id: 'alert-1', time: '07:35', type: '门禁告警', location: '南门', status: '已处理' },
      ],
    })
    render(<AlertEvents />, { wrapper: createWrapper(qc) })
    expect(screen.getByText('今日告警')).toBeInTheDocument()
    expect(screen.getByText('告警事件列表')).toBeInTheDocument()
  })

  it('overview.activity data renders ActivityTimeStats without crash', async () => {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    qc.setQueryData(['overview', 'activity'], {
      hours: ['08:00', '09:00'],
      values: [100, 200],
    })
    render(<ActivityTimeStats />, { wrapper: createWrapper(qc) })
    expect(screen.getByText('各时段活跃度')).toBeInTheDocument()
  })

  it('overview.studentInfo data renders StudentInfo without crash', async () => {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    qc.setQueryData(['overview', 'studentInfo'], {
      grades: [
        { name: '初一', male: 480, female: 450, total: 930 },
      ],
    })
    render(<StudentInfo />, { wrapper: createWrapper(qc) })
    expect(screen.getByText('初一')).toBeInTheDocument()
    expect(screen.getByText('930')).toBeInTheDocument()
  })
})
