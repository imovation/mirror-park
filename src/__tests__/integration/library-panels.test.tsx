import { renderWithProviders, screen, waitFor } from '@/__tests__/test-utils'
import { QueryClient } from '@tanstack/react-query'

import BookRank from '@/themes/library/panels/BookRank'
import ReadingStars from '@/themes/library/panels/ReadingStars'
import ReadingActivities from '@/themes/library/panels/ReadingActivities'
import VisitorStats from '@/themes/library/panels/VisitorStats'

function fillQueryCache(qc: QueryClient, key: string[], data: unknown) {
  qc.setQueryData(key, data)
}

function createQC() {
  return new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } })
}

function fillBookQueries(qc: QueryClient) {
  fillQueryCache(qc, ['library', 'hotBooks'], {
    top10: [{ name: '三体', author: '刘慈欣', count: 45 }, { name: '活着', author: '余华', count: 38 }],
    categoryRatio: [{ name: '文学', value: 35 }, { name: '科学', value: 25 }],
    recommendBooks: [{ name: '百年孤独', author: '马尔克斯' }],
  })
  fillQueryCache(qc, ['library', 'classRank'], {
    classRank: [{ name: '初二(3)班', value: 120 }, { name: '初三(1)班', value: 98 }],
    gradeComparison: [{ name: '初一', value: 85 }, { name: '初二', value: 92 }],
    readingStars: [{ name: '张三', className: '初二(3)班', count: 15 }],
  })
}

describe('Library Panel Integration', () => {
  describe('BookRank', () => {
    it('renders book rank when loaded', async () => {
      const qc = createQC()
      fillBookQueries(qc)
      renderWithProviders(<BookRank />, { queryClient: qc })
      await waitFor(() => {
        expect(screen.getByText('借阅量 TOP10')).toBeInTheDocument()
        expect(screen.getByText('班级借阅量排行')).toBeInTheDocument()
      })
    })

    it('shows empty state when data is null', async () => {
      const qc = createQC()
      fillQueryCache(qc, ['library', 'hotBooks'], null)
      fillQueryCache(qc, ['library', 'classRank'], null)
      renderWithProviders(<BookRank />, { queryClient: qc })
      await waitFor(() => {
        expect(screen.getByText('暂无数据')).toBeInTheDocument()
      })
    })
  })

  describe('ReadingStars', () => {
    it('renders reading stars when loaded', async () => {
      const qc = createQC()
      fillBookQueries(qc)
      renderWithProviders(<ReadingStars />, { queryClient: qc })
      await waitFor(() => {
        expect(screen.getByText('阅读之星')).toBeInTheDocument()
        expect(screen.getByText('好书推荐')).toBeInTheDocument()
      })
    })

    it('shows empty state when data is null', async () => {
      const qc = createQC()
      fillQueryCache(qc, ['library', 'hotBooks'], null)
      fillQueryCache(qc, ['library', 'classRank'], null)
      renderWithProviders(<ReadingStars />, { queryClient: qc })
      await waitFor(() => {
        expect(screen.getByText('暂无数据')).toBeInTheDocument()
      })
    })
  })

  describe('ReadingActivities', () => {
    it('renders activities when loaded', async () => {
      const qc = createQC()
      fillQueryCache(qc, ['library', 'activities'], {
        activities: [
          { id: '1', title: '经典诵读比赛', date: '2024-01-20', status: '进行中' },
          { id: '2', title: '读书分享会', date: '2024-02-01', status: '即将开始' },
        ],
      })
      renderWithProviders(<ReadingActivities />, { queryClient: qc })
      await waitFor(() => {
        expect(screen.getByText((content) => content.includes('活动'))).toBeInTheDocument()
        expect(screen.getByText('经典诵读比赛')).toBeInTheDocument()
        expect(screen.getByText('读书分享会')).toBeInTheDocument()
      })
    })

    it('shows empty state when data is null', async () => {
      const qc = createQC()
      fillQueryCache(qc, ['library', 'activities'], null)
      renderWithProviders(<ReadingActivities />, { queryClient: qc })
      await waitFor(() => {
        expect(screen.getByText('暂无数据')).toBeInTheDocument()
      })
    })
  })

  describe('VisitorStats', () => {
    it('renders visitor stats when loaded', async () => {
      const qc = createQC()
      fillQueryCache(qc, ['library', 'visitors'], {
        todayVisitors: 320,
        currentVisitors: 85,
        hourlyDistribution: { hours: ['08:00', '10:00', '12:00'], values: [20, 60, 45] },
      })
      renderWithProviders(<VisitorStats />, { queryClient: qc })
      await waitFor(() => {
        expect(screen.getByText('今日入馆')).toBeInTheDocument()
        expect(screen.getByText('实时在馆')).toBeInTheDocument()
        expect(screen.getByText('入馆时段分布')).toBeInTheDocument()
      })
    })

    it('shows empty state when data is null', async () => {
      const qc = createQC()
      fillQueryCache(qc, ['library', 'visitors'], null)
      renderWithProviders(<VisitorStats />, { queryClient: qc })
      await waitFor(() => {
        expect(screen.getByText('暂无数据')).toBeInTheDocument()
      })
    })
  })
})
