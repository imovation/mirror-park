import { renderWithProviders, screen, waitFor } from '@/__tests__/test-utils'
import { QueryClient } from '@tanstack/react-query'

import MonitorStatus from '@/themes/security/panels/MonitorStatus'
import AccessControl from '@/themes/security/panels/AccessControl'
import StudentLeave from '@/themes/security/panels/StudentLeave'
import VisitorManagement from '@/themes/security/panels/VisitorManagement'
import AlertEvents from '@/themes/security/panels/AlertEvents'
import CanteenSafety from '@/themes/security/panels/CanteenSafety'

function fillQueryCache(qc: QueryClient, key: string[], data: unknown) {
  qc.setQueryData(key, data)
}

function createQC() {
  return new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } })
}

describe('Security Panel Integration', () => {
  describe('MonitorStatus', () => {
    it('renders monitor data when loaded', async () => {
      const qc = createQC()
      fillQueryCache(qc, ['security', 'monitor'], {
        total: 420,
        online: 400,
        offline: 15,
        faulty: 5,
        regionDistribution: [{ name: '教学楼', value: 120 }, { name: '宿舍楼', value: 80 }],
        coverage: 0.95,
      })
      renderWithProviders(<MonitorStatus />, { queryClient: qc })
      await waitFor(() => {
        expect(screen.getByText('监控覆盖率')).toBeInTheDocument()
        expect(screen.getByText('各区域摄像头分布')).toBeInTheDocument()
      })
    })

    it('shows empty state when data is null', async () => {
      const qc = createQC()
      fillQueryCache(qc, ['security', 'monitor'], null)
      renderWithProviders(<MonitorStatus />, { queryClient: qc })
      await waitFor(() => {
        expect(screen.getByText('暂无数据')).toBeInTheDocument()
      })
    })
  })

  describe('AccessControl', () => {
    it('renders access data when loaded', async () => {
      const qc = createQC()
      fillQueryCache(qc, ['security', 'access'], {
        todayTotal: 2800,
        points: [{ name: '校门', value: 1200 }, { name: '教学楼', value: 800 }],
        hourlyDistribution: { hours: ['07:00', '08:00'], values: [200, 600] },
        abnormalRecords: [
          { id: '1', time: '2024-01-15 08:30', location: '校门', type: '非法闯入', status: '已处理' },
        ],
      })
      renderWithProviders(<AccessControl />, { queryClient: qc })
      await waitFor(() => {
        expect(screen.getByText('今日通行')).toBeInTheDocument()
        expect(screen.getByText('各门禁点通行统计')).toBeInTheDocument()
      })
    })

    it('shows empty state when data is null', async () => {
      const qc = createQC()
      fillQueryCache(qc, ['security', 'access'], null)
      renderWithProviders(<AccessControl />, { queryClient: qc })
      await waitFor(() => {
        expect(screen.getByText('暂无数据')).toBeInTheDocument()
      })
    })
  })

  describe('StudentLeave', () => {
    it('renders leave data when loaded', async () => {
      const qc = createQC()
      fillQueryCache(qc, ['security', 'leave'], {
        todayTotal: 32,
        typeDistribution: [{ name: '病假', value: 18 }, { name: '事假', value: 14 }],
        gradeDistribution: [{ name: '初一', value: 12 }, { name: '初三', value: 10 }],
        records: [{ id: '1', name: '小明', className: '初二(3)班', type: '病假', time: '2024-01-15 09:00' }],
      })
      renderWithProviders(<StudentLeave />, { queryClient: qc })
      await waitFor(() => {
        expect(screen.getByText('今日请假人数')).toBeInTheDocument()
        expect(screen.getByText('请假类型')).toBeInTheDocument()
      })
    })

    it('shows empty state when data is null', async () => {
      const qc = createQC()
      fillQueryCache(qc, ['security', 'leave'], null)
      renderWithProviders(<StudentLeave />, { queryClient: qc })
      await waitFor(() => {
        expect(screen.getByText('暂无数据')).toBeInTheDocument()
      })
    })
  })

  describe('VisitorManagement', () => {
    it('renders visitor data when loaded', async () => {
      const qc = createQC()
      fillQueryCache(qc, ['security', 'visitor'], {
        todayVisitors: 45,
        currentVisitors: 12,
        purposeDistribution: [{ name: '家长来访', value: 20 }, { name: '公务', value: 15 }],
        records: [{ id: '1', name: '王强', time: '2024-01-15 10:00', purpose: '家长来访', idNumber: '***' }],
      })
      renderWithProviders(<VisitorManagement />, { queryClient: qc })
      await waitFor(() => {
        expect(screen.getByText('今日访客')).toBeInTheDocument()
        expect(screen.getByText('当前在校')).toBeInTheDocument()
      })
    })

    it('shows empty state when data is null', async () => {
      const qc = createQC()
      fillQueryCache(qc, ['security', 'visitor'], null)
      renderWithProviders(<VisitorManagement />, { queryClient: qc })
      await waitFor(() => {
        expect(screen.getByText('暂无数据')).toBeInTheDocument()
      })
    })
  })

  describe('AlertEvents', () => {
    it('renders alert data when loaded', async () => {
      const qc = createQC()
      fillQueryCache(qc, ['security', 'alerts'], {
        todayTotal: 8,
        typeDistribution: [{ name: '入侵告警', value: 3 }, { name: '设备故障', value: 2 }],
        handledRatio: 0.75,
        unhandledRatio: 0.25,
        records: [{ id: '1', time: '2024-01-15 08:00', type: '入侵告警', location: '校门', status: '已处理' }],
      })
      renderWithProviders(<AlertEvents />, { queryClient: qc })
      await waitFor(() => {
        expect(screen.getByText('今日告警')).toBeInTheDocument()
        expect(screen.getByText('告警类型')).toBeInTheDocument()
        expect(screen.getByText('处理状态')).toBeInTheDocument()
      })
    })

    it('shows empty state when data is null', async () => {
      const qc = createQC()
      fillQueryCache(qc, ['security', 'alerts'], null)
      renderWithProviders(<AlertEvents />, { queryClient: qc })
      await waitFor(() => {
        expect(screen.getByText('暂无数据')).toBeInTheDocument()
      })
    })
  })

  describe('CanteenSafety', () => {
    it('renders canteen data when loaded', async () => {
      const qc = createQC()
      fillQueryCache(qc, ['security', 'canteen'], {
        todayTotal: 2800,
        meals: [{ name: '早餐', value: 800 }, { name: '午餐', value: 1200 }],
        safetyRecords: [{ id: '1', date: '2024-01-15', item: '食材检查', result: '合格' }],
      })
      renderWithProviders(<CanteenSafety />, { queryClient: qc })
      await waitFor(() => {
        expect(screen.getByText('今日就餐 人次')).toBeInTheDocument()
        expect(screen.getByText('各餐次就餐人数')).toBeInTheDocument()
      })
    })

    it('shows empty state when data is null', async () => {
      const qc = createQC()
      fillQueryCache(qc, ['security', 'canteen'], null)
      renderWithProviders(<CanteenSafety />, { queryClient: qc })
      await waitFor(() => {
        expect(screen.getByText('暂无数据')).toBeInTheDocument()
      })
    })
  })
})
