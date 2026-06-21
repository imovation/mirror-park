import { renderWithProviders, screen, waitFor } from '@/__tests__/test-utils'
import { QueryClient } from '@tanstack/react-query'

import LogisticsLeave from '@/themes/logistics/panels/LogisticsLeave'
import DormManagement from '@/themes/logistics/panels/DormManagement'
import LogisticsVisitors from '@/themes/logistics/panels/LogisticsVisitors'
import LogisticsCanteen from '@/themes/logistics/panels/LogisticsCanteen'

function fillQueryCache(qc: QueryClient, key: string[], data: unknown) {
  qc.setQueryData(key, data)
}

function createQC() {
  return new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } })
}

describe('Logistics Panel Integration', () => {
  describe('LogisticsLeave', () => {
    it('renders leave data when loaded', async () => {
      const qc = createQC()
      fillQueryCache(qc, ['logistics', 'leave'], {
        todayTotal: 22,
        typeDistribution: [{ name: '事假', value: 12 }, { name: '病假', value: 8 }, { name: '其他', value: 2 }],
        gradeDistribution: [{ name: '初一', value: 9 }, { name: '初二', value: 7 }, { name: '初三', value: 6 }],
        records: [{ id: '1', name: '张明轩', className: '初一(3)班', type: '事假', time: '08:15' }],
      })
      renderWithProviders(<LogisticsLeave />, { queryClient: qc })
      await waitFor(() => {
        expect(screen.getByText('今日请假')).toBeInTheDocument()
        expect(screen.getByText('请假类型分布')).toBeInTheDocument()
        expect(screen.getByText('各年级请假')).toBeInTheDocument()
      })
    })

    it('shows empty state when data is null', async () => {
      const qc = createQC()
      fillQueryCache(qc, ['logistics', 'leave'], null)
      renderWithProviders(<LogisticsLeave />, { queryClient: qc })
      await waitFor(() => {
        expect(screen.getByText('暂无数据')).toBeInTheDocument()
      })
    })
  })

  describe('DormManagement', () => {
    it('renders dorm data when loaded', async () => {
      const qc = createQC()
      fillQueryCache(qc, ['logistics', 'dorm'], {
        occupied: 2100,
        available: 500,
        maintenance: 20,
        buildingOccupancy: [{ name: '1号楼', value: 92 }, { name: '2号楼', value: 85 }],
      })
      renderWithProviders(<DormManagement />, { queryClient: qc })
      await waitFor(() => {
        expect(screen.getByText('在住人数')).toBeInTheDocument()
        expect(screen.getByText('空床位数')).toBeInTheDocument()
        expect(screen.getByText('维修中')).toBeInTheDocument()
        expect(screen.getByText('各楼栋入住率')).toBeInTheDocument()
      })
    })

    it('shows empty state when data is null', async () => {
      const qc = createQC()
      fillQueryCache(qc, ['logistics', 'dorm'], null)
      renderWithProviders(<DormManagement />, { queryClient: qc })
      await waitFor(() => {
        expect(screen.getByText('暂无数据')).toBeInTheDocument()
      })
    })
  })

  describe('LogisticsVisitors', () => {
    it('renders visitor data when loaded', async () => {
      const qc = createQC()
      fillQueryCache(qc, ['logistics', 'visitors'], {
        todayVisitors: 32,
        currentVisitors: 6,
        purposeDistribution: [{ name: '办事', value: 14 }, { name: '会议', value: 4 }],
        records: [{ id: '1', name: '黄建国', time: '08:30', purpose: '办事' }],
      })
      renderWithProviders(<LogisticsVisitors />, { queryClient: qc })
      await waitFor(() => {
        expect(screen.getByText('今日访客')).toBeInTheDocument()
        expect(screen.getByText('当前在校')).toBeInTheDocument()
        expect(screen.getByText('来访目的分布')).toBeInTheDocument()
      })
    })

    it('shows empty state when data is null', async () => {
      const qc = createQC()
      fillQueryCache(qc, ['logistics', 'visitors'], null)
      renderWithProviders(<LogisticsVisitors />, { queryClient: qc })
      await waitFor(() => {
        expect(screen.getByText('暂无数据')).toBeInTheDocument()
      })
    })
  })

  describe('LogisticsCanteen', () => {
    it('renders canteen data when loaded', async () => {
      const qc = createQC()
      fillQueryCache(qc, ['logistics', 'canteen'], {
        todayTotal: 3520,
        meals: [{ name: '早餐', value: 1100 }, { name: '午餐', value: 1680 }, { name: '晚餐', value: 740 }],
        safetyRecords: [{ id: '1', date: '2026/6/15', item: '食材抽检', result: '合格' }],
      })
      renderWithProviders(<LogisticsCanteen />, { queryClient: qc })
      await waitFor(() => {
        expect(screen.getByText((c) => c.includes('今日就餐'))).toBeInTheDocument()
      })
    })

    it('shows empty state when data is null', async () => {
      const qc = createQC()
      fillQueryCache(qc, ['logistics', 'canteen'], null)
      renderWithProviders(<LogisticsCanteen />, { queryClient: qc })
      await waitFor(() => {
        expect(screen.getByText('暂无数据')).toBeInTheDocument()
      })
    })
  })
})
