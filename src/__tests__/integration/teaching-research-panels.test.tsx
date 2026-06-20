import { renderWithProviders, screen, waitFor } from '@/__tests__/test-utils'
import { QueryClient } from '@tanstack/react-query'

import TeachingResourcesPanel from '@/themes/teaching-research/panels/TeachingResourcesPanel'
import ResourceStatistics from '@/themes/teaching-research/panels/ResourceStatistics'
import ResourceUpdates from '@/themes/teaching-research/panels/ResourceUpdates'
import TeacherTopics from '@/themes/teaching-research/panels/TeacherTopics'
import ResearchProjectsList from '@/themes/teaching-research/panels/ResearchProjectsList'
import TeacherStudiosPanel from '@/themes/teaching-research/panels/TeacherStudiosPanel'

function fillQueryCache(qc: QueryClient, key: string[], data: unknown) {
  qc.setQueryData(key, data)
}

function createQC() {
  return new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0, staleTime: Infinity } } })
}

describe('Teaching Research Panel Integration', () => {
  describe('TeachingResourcesPanel', () => {
    it('renders resource data when loaded', async () => {
      const qc = createQC()
      fillQueryCache(qc, ['tr', 'resources'], {
        resources: [
          { name: '课件', value: 1200, color: '#1890ff' },
          { name: '学案', value: 800, color: '#52c41a' },
        ],
      })
      renderWithProviders(<TeachingResourcesPanel />, { queryClient: qc })
      await waitFor(() => {
        expect(screen.getByText('教学资源分类占比')).toBeInTheDocument()
        expect(screen.getByText('课件')).toBeInTheDocument()
      })
    })

    it('shows empty state when data is null', async () => {
      const qc = createQC()
      fillQueryCache(qc, ['tr', 'resources'], null)
      renderWithProviders(<TeachingResourcesPanel />, { queryClient: qc })
      await waitFor(() => {
        expect(screen.getByText('暂无数据')).toBeInTheDocument()
      })
    })
  })

  describe('ResourceStatistics', () => {
    it('renders stats when loaded', async () => {
      const qc = createQC()
      fillQueryCache(qc, ['tr', 'resourceStats'], {
        totalResources: 8500,
        cloudQuestions: 32000,
        cloudResources: 5600,
        recentUpdates: 128,
      })
      renderWithProviders(<ResourceStatistics />, { queryClient: qc })
      await waitFor(() => {
        expect(screen.getByText('8,500')).toBeInTheDocument()
        expect(screen.getByText('32,000')).toBeInTheDocument()
      })
    })

    it('shows empty state when data is null', async () => {
      const qc = createQC()
      fillQueryCache(qc, ['tr', 'resourceStats'], null)
      renderWithProviders(<ResourceStatistics />, { queryClient: qc })
      await waitFor(() => {
        expect(screen.getByText('暂无数据')).toBeInTheDocument()
      })
    })
  })

  describe('ResourceUpdates', () => {
    it('renders updates when loaded', async () => {
      const qc = createQC()
      fillQueryCache(qc, ['tr', 'updates'], {
        recentItems: [
          { id: '1', name: '二次函数教案', subject: '数学', teacher: '张老师', time: '2024-01-15' },
        ],
      })
      renderWithProviders(<ResourceUpdates />, { queryClient: qc })
      await waitFor(() => {
        expect(screen.getByText('二次函数教案')).toBeInTheDocument()
        expect(screen.getByText('数学')).toBeInTheDocument()
      })
    })

    it('shows empty state when data is null', async () => {
      const qc = createQC()
      fillQueryCache(qc, ['tr', 'updates'], null)
      renderWithProviders(<ResourceUpdates />, { queryClient: qc })
      await waitFor(() => {
        expect(screen.getByText('暂无数据')).toBeInTheDocument()
      })
    })
  })

  describe('TeacherTopics', () => {
    it('renders topics when loaded', async () => {
      const qc = createQC()
      fillQueryCache(qc, ['tr', 'topics'], {
        lessonCases: 156,
        publicAchievements: 89,
        ongoingTopics: 24,
      })
      renderWithProviders(<TeacherTopics />, { queryClient: qc })
      await waitFor(() => {
        expect(screen.getByText('课例数')).toBeInTheDocument()
        expect(screen.getByText('公开成果数')).toBeInTheDocument()
      })
    })

    it('shows empty state when data is null', async () => {
      const qc = createQC()
      fillQueryCache(qc, ['tr', 'topics'], null)
      renderWithProviders(<TeacherTopics />, { queryClient: qc })
      await waitFor(() => {
        expect(screen.getByText('暂无数据')).toBeInTheDocument()
      })
    })
  })

  describe('ResearchProjectsList', () => {
    it('renders projects when loaded', async () => {
      const qc = createQC()
      fillQueryCache(qc, ['tr', 'projects'], {
        projects: [
          { id: '1', name: '智慧课堂研究', leader: '王老师', status: '在研', members: 6 },
        ],
      })
      renderWithProviders(<ResearchProjectsList />, { queryClient: qc })
      await waitFor(() => {
        expect(screen.getByText(/负责人:/)).toBeInTheDocument()
        expect(screen.getByText('在研')).toBeInTheDocument()
      })
    })

    it('shows empty state when data is null', async () => {
      const qc = createQC()
      fillQueryCache(qc, ['tr', 'projects'], null)
      renderWithProviders(<ResearchProjectsList />, { queryClient: qc })
      await waitFor(() => {
        expect(screen.getByText('暂无数据')).toBeInTheDocument()
      })
    })
  })

  describe('TeacherStudiosPanel', () => {
    it('renders studios when loaded', async () => {
      const qc = createQC()
      fillQueryCache(qc, ['tr', 'studios'], {
        studios: [
          { id: '1', name: '语文名师工作室', host: '李老师', memberCount: 8, achievementCount: 15, subject: '语文' },
        ],
      })
      renderWithProviders(<TeacherStudiosPanel />, { queryClient: qc })
      await waitFor(() => {
        expect(screen.getByText('语文名师工作室')).toBeInTheDocument()
        expect(screen.getByText('语文')).toBeInTheDocument()
      })
    })

    it('shows empty state when data is null', async () => {
      const qc = createQC()
      fillQueryCache(qc, ['tr', 'studios'], null)
      renderWithProviders(<TeacherStudiosPanel />, { queryClient: qc })
      await waitFor(() => {
        expect(screen.getByText('暂无数据')).toBeInTheDocument()
      })
    })
  })
})
