import { useScheduleData } from '@/api/queries/academics'
import BarChart from '@/components/charts/BarChart'
import PieChart from '@/components/charts/PieChart'
import HeatmapChart from '@/components/charts/HeatmapChart'
import StatusPanel from '@/components/ui/StatusPanel'
import ChartLabel from '@/components/ui/ChartLabel'

export default function CourseSchedule() {
  const { data, isLoading, error } = useScheduleData()
  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return <StatusPanel type="empty" />

  const heatmapData: [number, number, number][] = data.timeDistribution.hours.map((_, i) => [i, 0, data.timeDistribution.values[i]])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', gap: 8 }}>
        <div style={{ flex: 1 }}>
          <ChartLabel align="center">年级排课分布</ChartLabel>
          <BarChart data={data.gradeDistribution} height={100} />
        </div>
        <div style={{ flex: 1 }}>
          <ChartLabel align="center">科目占比</ChartLabel>
          <PieChart data={data.subjectDistribution} height={130} />
        </div>
      </div>
      <div>
        <ChartLabel>时段课程密度</ChartLabel>
        <HeatmapChart
          xLabels={data.timeDistribution.hours}
          yLabels={['课程密度']}
          data={heatmapData}
          height={130}
        />
      </div>
    </div>
  )
}
