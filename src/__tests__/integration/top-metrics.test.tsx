import { renderWithProviders, screen } from '@/__tests__/test-utils'
import { QueryClient } from '@tanstack/react-query'

import OverviewTopMetrics from '@/themes/overview/panels/OverviewTopMetrics'
import TeachingResearchTopMetrics from '@/themes/teaching-research/panels/TeachingResearchTopMetrics'
import AdminTopMetrics from '@/themes/admin/panels/AdminTopMetrics'
import LibraryTopMetrics from '@/themes/library/panels/LibraryTopMetrics'
import AcademicsTopMetrics from '@/themes/academics/panels/AcademicsTopMetrics'
import SecurityTopMetrics from '@/themes/security/panels/SecurityTopMetrics'

function fillQueryCache(qc: QueryClient, key: string[], data: unknown) {
  qc.setQueryData(key, data)
}

function createQC() {
  return new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } })
}

describe('TopMetrics Integration', () => {
  describe('OverviewTopMetrics', () => {
    it('renders school info metrics when loaded', () => {
      const qc = createQC()
      fillQueryCache(qc, ['overview', 'schoolInfo'], {
        landArea: 48700,
        buildingArea: 88000,
        classCount: 60,
        buildingCount: 9,
        totalTeachers: 196,
        totalStudents: 2800,
      })
      renderWithProviders(<OverviewTopMetrics />, { queryClient: qc })
      expect(screen.getByText('占地面积')).toBeInTheDocument()
      expect(screen.getByText('48,700㎡')).toBeInTheDocument()
      expect(screen.getByText('班级数')).toBeInTheDocument()
      expect(screen.getByText('60')).toBeInTheDocument()
    })

    it('shows skeleton when data is null', () => {
      const qc = createQC()
      fillQueryCache(qc, ['overview', 'schoolInfo'], null)
      renderWithProviders(<OverviewTopMetrics />, { queryClient: qc })
      expect(screen.getByText('占地面积')).toBeInTheDocument()
    })
  })

  describe('TeachingResearchTopMetrics', () => {
    it('renders teaching research metrics when loaded', () => {
      const qc = createQC()
      fillQueryCache(qc, ['tr', 'resourceStats'], {
        totalResources: 8500,
        cloudQuestions: 32000,
        cloudResources: 5600,
        recentUpdates: 128,
      })
      fillQueryCache(qc, ['tr', 'topics'], {
        lessonCases: 156,
        publicAchievements: 89,
        ongoingTopics: 24,
      })
      fillQueryCache(qc, ['tr', 'studios'], {
        studios: [
          { id: '1', name: '语文名师工作室', host: '李老师', memberCount: 8, achievementCount: 15, subject: '语文' },
        ],
      })
      renderWithProviders(<TeachingResearchTopMetrics />, { queryClient: qc })
      expect(screen.getByText('资源总量')).toBeInTheDocument()
      expect(screen.getByText('8,500')).toBeInTheDocument()
      expect(screen.getByText('课例成果')).toBeInTheDocument()
      expect(screen.getByText('名师工作室')).toBeInTheDocument()
    })

    it('shows nothing when resourceStats data is null', () => {
      const qc = createQC()
      fillQueryCache(qc, ['tr', 'resourceStats'], null)
      const { container } = renderWithProviders(<TeachingResearchTopMetrics />, { queryClient: qc })
      expect(container.innerHTML).toBe('')
    })
  })

  describe('AdminTopMetrics', () => {
    it('renders admin metrics when loaded', () => {
      const qc = createQC()
      fillQueryCache(qc, ['admin', 'overview'], {
        departmentCount: 12,
        staffCount: 196,
        attendanceRate: 0.96,
        roomCount: 36,
      })
      fillQueryCache(qc, ['admin', 'meetings'], {
        todayCount: 3,
        weekCount: 10,
        rooms: [],
        upcoming: [],
      })
      renderWithProviders(<AdminTopMetrics />, { queryClient: qc })
      expect(screen.getByText('部门数量')).toBeInTheDocument()
      expect(screen.getByText('12')).toBeInTheDocument()
      expect(screen.getByText('教职工总数')).toBeInTheDocument()
      expect(screen.getByText('今日出勤率')).toBeInTheDocument()
      expect(screen.getByText('96%')).toBeInTheDocument()
      expect(screen.getByText('今日会议')).toBeInTheDocument()
    })

    it('shows nothing when data is null', () => {
      const qc = createQC()
      fillQueryCache(qc, ['admin', 'overview'], null)
      const { container } = renderWithProviders(<AdminTopMetrics />, { queryClient: qc })
      expect(container.innerHTML).toBe('')
    })
  })

  describe('LibraryTopMetrics', () => {
    it('renders library metrics when loaded', () => {
      const qc = createQC()
      fillQueryCache(qc, ['library', 'collection'], {
        paperBooks: 85000,
        ebooks: 12000,
        journals: 86,
        newspapers: 12,
      })
      fillQueryCache(qc, ['library', 'borrowStats'], {
        todayBorrow: 5,
        yesterdayBorrow: 8,
        todayReturn: 4,
        totalBorrowed: 1320,
        overdue: 16,
        trend: { days: ['1'], borrow: [1], return: [1] },
      })
      fillQueryCache(qc, ['library', 'visitors'], {
        todayVisitors: 353,
        currentVisitors: 68,
        hourlyDistribution: { hours: ['06:00'], values: [0] },
      })
      renderWithProviders(<LibraryTopMetrics />, { queryClient: qc })
      expect(screen.getByText('馆藏纸质书')).toBeInTheDocument()
      expect(screen.getByText('85,000')).toBeInTheDocument()
      expect(screen.getByText('今日借阅')).toBeInTheDocument()
      expect(screen.getByText('5')).toBeInTheDocument()
      expect(screen.getByText('今日入馆')).toBeInTheDocument()
    })

    it('shows skeleton when data is null', () => {
      const qc = createQC()
      fillQueryCache(qc, ['library', 'collection'], null)
      const { container } = renderWithProviders(<LibraryTopMetrics />, { queryClient: qc })
      expect(container.innerHTML).not.toBe('')
      expect(container.querySelectorAll('[style*="flex: 1"]').length).toBeGreaterThanOrEqual(5)
    })
  })

  describe('AcademicsTopMetrics', () => {
    it('renders academics metrics when loaded', () => {
      const qc = createQC()
      fillQueryCache(qc, ['academics', 'overview'], {
        todayCourses: 180,
        ongoingCourses: 42,
        totalClassrooms: 60,
        usageRate: 0.75,
      })
      fillQueryCache(qc, ['academics', 'classes'], {
        totalClasses: 42,
        gradeClasses: [{ name: '初一', count: 14 }],
        classList: [{ id: '1', name: '初一(1)班', headTeacher: '王老师', studentCount: 48 }],
      })
      renderWithProviders(<AcademicsTopMetrics />, { queryClient: qc })
      expect(screen.getByText('今日课程')).toBeInTheDocument()
      expect(screen.getByText('180')).toBeInTheDocument()
      expect(screen.getByText('正在上课')).toBeInTheDocument()
      expect(screen.getByText('教室总数')).toBeInTheDocument()
      expect(screen.getByText('班级总数')).toBeInTheDocument()
    })

    it('shows nothing when overview data is null', () => {
      const qc = createQC()
      fillQueryCache(qc, ['academics', 'overview'], null)
      const { container } = renderWithProviders(<AcademicsTopMetrics />, { queryClient: qc })
      expect(container.innerHTML).toBe('')
    })
  })

  describe('SecurityTopMetrics', () => {
    it('renders security metrics when loaded', () => {
      const qc = createQC()
      fillQueryCache(qc, ['security', 'overview'], {
        cameraCount: 420,
        accessDeviceCount: 36,
        todayAlerts: 8,
        todayVisitors: 45,
      })
      fillQueryCache(qc, ['security', 'monitor'], {
        total: 256,
        online: 245,
        offline: 6,
        faulty: 5,
        regionDistribution: [],
        coverage: 0.91,
      })
      renderWithProviders(<SecurityTopMetrics />, { queryClient: qc })
      expect(screen.getByText('监控设备')).toBeInTheDocument()
      expect(screen.getByText('420')).toBeInTheDocument()
      expect(screen.getByText('设备在线率')).toBeInTheDocument()
      expect(screen.getByText('96%')).toBeInTheDocument()
      expect(screen.getByText('今日告警')).toBeInTheDocument()
      expect(screen.getByText('今日访客')).toBeInTheDocument()
    })

    it('shows nothing when data is null', () => {
      const qc = createQC()
      fillQueryCache(qc, ['security', 'overview'], null)
      const { container } = renderWithProviders(<SecurityTopMetrics />, { queryClient: qc })
      expect(container.innerHTML).toBe('')
    })
  })
})
