import { renderWithProviders, screen, waitFor } from '@/__tests__/test-utils'
import { QueryClient } from '@tanstack/react-query'

import StudentInfo from '@/themes/overview/panels/StudentInfo'
import RoomDistribution from '@/themes/overview/panels/RoomDistribution'
import ActivityTimeStats from '@/themes/overview/panels/ActivityTimeStats'

function fillQueryCache(qc: QueryClient, key: string[], data: unknown) {
  qc.setQueryData(key, data)
}

function createQC() {
  return new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } })
}

describe('Overview Panel Integration', () => {
  describe('StudentInfo', () => {
    it('renders grade data when loaded', async () => {
      const qc = createQC()
      fillQueryCache(qc, ['overview', 'studentInfo'], {
        grades: [
          { name: '初一', male: 480, female: 450, total: 930 },
          { name: '初二', male: 470, female: 460, total: 930 },
          { name: '初三', male: 460, female: 480, total: 940 },
        ],
        totalStudents: 2800, maleRatio: 0.5, femaleRatio: 0.5,
      })
      renderWithProviders(<StudentInfo />, { queryClient: qc })
      await waitFor(() => {
        expect(screen.getByText(/初一/)).toBeInTheDocument()
        expect(screen.getByText('年级人数对比')).toBeInTheDocument()
      })
    })

    it('shows empty state when data is null', async () => {
      const qc = createQC()
      fillQueryCache(qc, ['overview', 'studentInfo'], null)
      renderWithProviders(<StudentInfo />, { queryClient: qc })
      await waitFor(() => {
        expect(screen.getByText('暂无数据')).toBeInTheDocument()
      })
    })
  })

  describe('RoomDistribution', () => {
    it('renders room data when loaded', async () => {
      const qc = createQC()
      fillQueryCache(qc, ['overview', 'rooms'], {
        rooms: [{ name: '普通教室', count: 60 }, { name: '实验室', count: 8 }],
      })
      renderWithProviders(<RoomDistribution />, { queryClient: qc })
      await waitFor(() => {
        expect(screen.getByText('功能室分布')).toBeInTheDocument()
      })
    })

    it('shows empty state when data is null', async () => {
      const qc = createQC()
      fillQueryCache(qc, ['overview', 'rooms'], null)
      renderWithProviders(<RoomDistribution />, { queryClient: qc })
      await waitFor(() => {
        expect(screen.getByText('暂无数据')).toBeInTheDocument()
      })
    })
  })

  describe('ActivityTimeStats', () => {
    it('renders activity data when loaded', async () => {
      const qc = createQC()
      fillQueryCache(qc, ['overview', 'activity'], {
        hours: ['08:00', '09:00', '10:00'],
        values: [120, 2600, 3800],
      })
      renderWithProviders(<ActivityTimeStats />, { queryClient: qc })
      await waitFor(() => {
        expect(screen.getByText('各时段活跃度')).toBeInTheDocument()
      })
    })

    it('shows empty state when data is null', async () => {
      const qc = createQC()
      fillQueryCache(qc, ['overview', 'activity'], null)
      renderWithProviders(<ActivityTimeStats />, { queryClient: qc })
      await waitFor(() => {
        expect(screen.getByText('暂无数据')).toBeInTheDocument()
      })
    })
  })
})
