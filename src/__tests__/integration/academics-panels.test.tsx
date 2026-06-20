import { renderWithProviders, screen, waitFor } from '@/__tests__/test-utils'
import { QueryClient } from '@tanstack/react-query'

import ScheduleSpace from '@/themes/academics/panels/ScheduleSpace'
import StudentAttendance from '@/themes/academics/panels/StudentAttendance'
import ExamManagement from '@/themes/academics/panels/ExamManagement'
import TeachingDevices from '@/themes/academics/panels/TeachingDevices'

function fillQueryCache(qc: QueryClient, key: string[], data: unknown) {
  qc.setQueryData(key, data)
}

function createQC() {
  return new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0, staleTime: Infinity } } })
}

describe('Academics Panel Integration', () => {
  describe('ScheduleSpace', () => {
    it('renders schedule data when loaded', async () => {
      const qc = createQC()
      fillQueryCache(qc, ['academics', 'schedule'], {
        gradeDistribution: [{ name: '初一', value: 6 }, { name: '初二', value: 6 }],
        subjectDistribution: [{ name: '语文', value: 8 }, { name: '数学', value: 8 }],
        timeDistribution: { hours: ['08:00', '10:00'], values: [30, 28] },
      })
      fillQueryCache(qc, ['academics', 'classroomUsage'], {
        inUse: 45,
        available: 15,
        buildingUsage: [{ name: '教学楼A', value: 20 }],
        typeDistribution: [{ name: '普通教室', value: 50 }],
      })
      renderWithProviders(<ScheduleSpace />, { queryClient: qc })
      await waitFor(() => {
        expect(screen.getByText('使用中')).toBeInTheDocument()
        expect(screen.getByText('空闲')).toBeInTheDocument()
        expect(screen.getByText('使用率')).toBeInTheDocument()
      })
    })

    it('shows empty state when data is null', async () => {
      const qc = createQC()
      fillQueryCache(qc, ['academics', 'schedule'], null)
      fillQueryCache(qc, ['academics', 'classroomUsage'], null)
      renderWithProviders(<ScheduleSpace />, { queryClient: qc })
      await waitFor(() => {
        expect(screen.getByText('暂无数据')).toBeInTheDocument()
      })
    })
  })

  describe('StudentAttendance', () => {
    it('renders attendance data when loaded', async () => {
      const qc = createQC()
      fillQueryCache(qc, ['academics', 'attendance'], {
        todayRate: 0.97,
        gradeRates: [{ name: '初一', value: 98 }, { name: '初二', value: 96 }],
        classRank: [{ name: '初一(1)班', value: 99 }],
        trend: { days: ['01', '02'], values: [97, 98] },
      })
      renderWithProviders(<StudentAttendance />, { queryClient: qc })
      await waitFor(() => {
        expect(screen.getByText('今日出勤率')).toBeInTheDocument()
        expect(screen.getByText('各年级出勤率')).toBeInTheDocument()
      })
    })

    it('shows empty state when data is null', async () => {
      const qc = createQC()
      fillQueryCache(qc, ['academics', 'attendance'], null)
      renderWithProviders(<StudentAttendance />, { queryClient: qc })
      await waitFor(() => {
        expect(screen.getByText('暂无数据')).toBeInTheDocument()
      })
    })
  })

  describe('ExamManagement', () => {
    it('renders exam data when loaded', async () => {
      const qc = createQC()
      fillQueryCache(qc, ['academics', 'exam'], {
        upcomingExams: [{ id: '1', subject: '数学', date: '2024-01-20', grade: '初三' }],
        semesterExamCount: 6,
        gradeAverages: [{ name: '初一', value: 85 }, { name: '初三', value: 82 }],
        scoreDistribution: [{ name: '优秀', value: 25 }, { name: '良好', value: 40 }],
      })
      renderWithProviders(<ExamManagement />, { queryClient: qc })
      await waitFor(() => {
        expect(screen.getByText('近期考试')).toBeInTheDocument()
        expect(screen.getByText(/本学期考试/)).toBeInTheDocument()
      })
    })

    it('shows empty state when data is null', async () => {
      const qc = createQC()
      fillQueryCache(qc, ['academics', 'exam'], null)
      renderWithProviders(<ExamManagement />, { queryClient: qc })
      await waitFor(() => {
        expect(screen.getByText('暂无数据')).toBeInTheDocument()
      })
    })
  })

  describe('TeachingDevices', () => {
    it('renders device data when loaded', async () => {
      const qc = createQC()
      fillQueryCache(qc, ['academics', 'devices'], {
        total: 200,
        online: 185,
        offline: 12,
        faulty: 3,
        typeDistribution: [{ name: '投影仪', value: 72 }, { name: '电脑', value: 128 }],
      })
      renderWithProviders(<TeachingDevices />, { queryClient: qc })
      await waitFor(() => {
        expect(screen.getByText('设备状态')).toBeInTheDocument()
        expect(screen.getByText('设备类型分布')).toBeInTheDocument()
      })
    })

    it('shows empty state when data is null', async () => {
      const qc = createQC()
      fillQueryCache(qc, ['academics', 'devices'], null)
      renderWithProviders(<TeachingDevices />, { queryClient: qc })
      await waitFor(() => {
        expect(screen.getByText('暂无数据')).toBeInTheDocument()
      })
    })
  })
})
