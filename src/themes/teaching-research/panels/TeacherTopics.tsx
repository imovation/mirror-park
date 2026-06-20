import { useTeacherTopics, useResearchProjects } from '@/api/queries/teachingResearch'
import NumberFlip from '@/components/ui/NumberFlip'
import BarChart from '@/components/charts/BarChart'
import StatusPanel from '@/components/ui/StatusPanel'
import ChartLabel from '@/components/ui/ChartLabel'

export default function TeacherTopics() {
  const { data, isLoading, error } = useTeacherTopics()
  const projects = useResearchProjects()

  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return <StatusPanel type="empty" />

  const statusCounts = projects.data?.projects.reduce<Record<string, number>>((acc, p) => {
    acc[p.status] = (acc[p.status] || 0) + 1
    return acc
  }, {}) ?? {}

  const chartData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1, minHeight: 0 }}>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}>
        <NumberFlip label="课例数" value={data.lessonCases} unit="个" color="#4a9eff" />
        <NumberFlip label="公开成果数" value={data.publicAchievements} unit="项" color="#00c853" />
        <NumberFlip label="在研课题数" value={data.ongoingTopics} unit="项" color="var(--color-warning)" />
      </div>
      {chartData.length > 0 && (
        <div style={{ flex: 1, minHeight: 0 }}>
          <ChartLabel>课题项目状态分布</ChartLabel>
          <BarChart data={chartData} height={100} barWidth="60%" />
        </div>
      )}
    </div>
  )
}
