import { CHART_PALETTE, HUE_ROTATION } from '@/config/chartTheme'
import { useTeacherTopics, useResearchProjects } from '@/api/queries/teachingResearch'
import NumberFlip from '@/components/ui/NumberFlip'
import StatusPanel from '@/components/ui/StatusPanel'
import ChartLabel from '@/components/ui/ChartLabel'
import RingChart from '@/components/charts/RingChart'
import BarChart from '@/components/charts/BarChart'

export default function TeacherTopics() {
  const topicsQuery = useTeacherTopics()
  const projectsQuery = useResearchProjects()

  if (topicsQuery.isLoading || projectsQuery.isLoading) return <StatusPanel type="loading" />
  if (topicsQuery.error || projectsQuery.error) return <StatusPanel type="error" />
  if (!topicsQuery.data || !projectsQuery.data) return <StatusPanel type="empty" />

  const t = topicsQuery.data
  const p = projectsQuery.data.projects
  const statusCount: Record<string, number> = {}
  p.forEach((proj) => {
    statusCount[proj.status] = (statusCount[proj.status] ?? 0) + 1
  })
  const statusData = Object.entries(statusCount).map(([name, value]) => ({ name, value }))
  const memberCount = p.map((proj) => ({ name: proj.name.slice(0, 6), value: proj.members }))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1, minHeight: 0 }}>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexShrink: 0 }}>
        <NumberFlip label="课例数" value={t.lessonCases} unit="个" color="var(--accent)" />
        <NumberFlip label="公开成果数" value={t.publicAchievements} unit="项" color="var(--color-success)" />
        <NumberFlip label="在研课题" value={t.ongoingTopics} unit="项" color="var(--color-warning)" />
      </div>
      <div style={{ display: 'flex', gap: 6, flex: 1, minHeight: 0 }}>
        <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
          <ChartLabel align="center">课题状态分布</ChartLabel>
          <RingChart data={statusData} height={120} centerLabel={String(p.length)} centerLabelSize={16} legendPosition="bottom" />
        </div>
        <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
          <ChartLabel align="center">课题成员数</ChartLabel>
          <BarChart data={memberCount} color={HUE_ROTATION.r2[1]} height={120} gridLeft="20%" />
        </div>
      </div>
    </div>
  )
}
