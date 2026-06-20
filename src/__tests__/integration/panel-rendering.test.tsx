// src/__tests__/integration/panel-rendering.test.tsx
import { renderWithProviders, screen, waitFor } from '@/__tests__/test-utils'
import { QueryClient } from '@tanstack/react-query'

import AssetOverview from '@/themes/overview/panels/AssetOverview'
import BorrowStats from '@/themes/library/panels/BorrowStats'
import FacultyPanorama from '@/themes/overview/panels/FacultyPanorama'

function fillQueryCache(qc: QueryClient, key: string[], data: unknown) {
  qc.setQueryData(key, data)
}

describe('Panel Integration', () => {
  let qc: QueryClient

  beforeEach(() => {
    qc = new QueryClient({
      defaultOptions: {
        queries: { retry: false, gcTime: 0, staleTime: Infinity },
        mutations: { retry: false },
      },
    })
  })

  describe('AssetOverview', () => {
    it('renders asset cards when data is loaded', async () => {
      fillQueryCache(qc, ['overview', 'assets'], {
        computers: 680,
        projectors: 72,
        airConditioners: 320,
        cameras: 420,
        printers: 36,
        doorLocks: 240,
      })
      renderWithProviders(<AssetOverview />, { queryClient: qc })
      await waitFor(() => {
        expect(screen.getByText('680')).toBeInTheDocument()
        expect(screen.getByText('电脑')).toBeInTheDocument()
        expect(screen.getByText('投影仪')).toBeInTheDocument()
      })
    })

    it('shows empty state when data is null', async () => {
      fillQueryCache(qc, ['overview', 'assets'], null)
      renderWithProviders(<AssetOverview />, { queryClient: qc })
      await waitFor(() => {
        expect(screen.getByText('暂无数据')).toBeInTheDocument()
      })
    })
  })

  describe('BorrowStats', () => {
    it('renders borrow stats when data is loaded', async () => {
      fillQueryCache(qc, ['library', 'borrowStats'], {
        todayBorrow: 5,
        todayReturn: 4,
        totalBorrowed: 1320,
        overdue: 16,
        trend: {
          days: ['01', '02'],
          borrow: [30, 40],
          return: [25, 35],
        },
      })
      renderWithProviders(<BorrowStats />, { queryClient: qc })
      await waitFor(() => {
        expect(screen.getByText('今日借阅')).toBeInTheDocument()
        expect(screen.getByText('今日归还')).toBeInTheDocument()
      })
    })

    it('shows empty state when data is null', async () => {
      fillQueryCache(qc, ['library', 'borrowStats'], null)
      renderWithProviders(<BorrowStats />, { queryClient: qc })
      await waitFor(() => {
        expect(screen.getByText('暂无数据')).toBeInTheDocument()
      })
    })
  })

  describe('FacultyPanorama', () => {
    it('renders when data is set', async () => {
      fillQueryCache(qc, ['overview', 'schoolInfo'], {
        landArea: 48700,
        buildingArea: 88000,
        classCount: 60,
        buildingCount: 9,
        totalTeachers: 196,
        totalStudents: 2800,
      })
      fillQueryCache(qc, ['overview', 'personnel'], {
        totalTeachers: 196,
        maleCount: 82,
        femaleCount: 114,
        maleRatio: 0.418,
        femaleRatio: 0.582,
        education: [
          { name: '硕士', value: 87 },
          { name: '本科', value: 109 },
        ],
      })
      fillQueryCache(qc, ['overview', 'teacherDistribution'], {
        subjects: [
          { name: '语文', value: 42 },
          { name: '数学', value: 38 },
        ],
        titles: [
          { name: '高级', value: 28 },
          { name: '一级', value: 67 },
        ],
        ageDistribution: [
          { name: '30以下', value: 52 },
          { name: '30-45', value: 101 },
        ],
      })
      renderWithProviders(<FacultyPanorama />, { queryClient: qc })
      await waitFor(() => {
        expect(screen.getByText('性别比例')).toBeInTheDocument()
      })
    })
  })
})
