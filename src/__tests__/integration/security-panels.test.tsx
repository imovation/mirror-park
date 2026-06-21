import { renderWithProviders, screen, waitFor } from '@/__tests__/test-utils'
import { QueryClient } from '@tanstack/react-query'

import MonitorStatus from '@/themes/security/panels/MonitorStatus'
import AccessControl from '@/themes/security/panels/AccessControl'
import AlertEvents from '@/themes/security/panels/AlertEvents'
import SecurityOverview from '@/themes/security/panels/SecurityOverview'

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

  describe('AlertEvents', () => {
    it('renders alert data when loaded', async () => {
      const qc = createQC()
      fillQueryCache(qc, ['security', 'alerts'], {
        todayTotal: 8,
        yesterdayTotal: 5,
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

  describe('SecurityOverview', () => {
    it('renders overview when loaded', async () => {
      const qc = createQC()
      fillQueryCache(qc, ['security', 'alerts'], {
        todayTotal: 8,
        yesterdayTotal: 5,
        typeDistribution: [{ name: '入侵告警', value: 3 }, { name: '设备故障', value: 2 }],
        handledRatio: 0.75,
        unhandledRatio: 0.25,
        records: [{ id: '1', time: '08:00', type: '入侵告警', location: '校门', status: '已处理' }],
      })
      fillQueryCache(qc, ['security', 'monitor'], {
        total: 256, online: 240, offline: 10, faulty: 6,
        regionDistribution: [{ name: '教学楼', value: 120 }],
        coverage: 0.92,
      })
      renderWithProviders(<SecurityOverview />, { queryClient: qc })
      await waitFor(() => {
        expect(screen.getByText('已处理')).toBeInTheDocument()
        expect(screen.getByText('待处理')).toBeInTheDocument()
        expect(screen.getByText('设备在线率')).toBeInTheDocument()
        expect(screen.getByText('近 7 日告警趋势')).toBeInTheDocument()
      })
    })

    it('shows empty state when data is null', async () => {
      const qc = createQC()
      fillQueryCache(qc, ['security', 'alerts'], null)
      fillQueryCache(qc, ['security', 'monitor'], { total: 256, online: 240, offline: 10, faulty: 6, regionDistribution: [], coverage: 0.92 })
      renderWithProviders(<SecurityOverview />, { queryClient: qc })
      await waitFor(() => {
        expect(screen.getByText('暂无数据')).toBeInTheDocument()
      })
    })
  })
})
