import { useScheduleData } from '@/api/queries/academics'
import BarChart from '@/components/charts/BarChart'
import PieChart from '@/components/charts/PieChart'
import HeatmapChart from '@/components/charts/HeatmapChart'
import StatusPanel from '@/components/ui/StatusPanel'

export default function CourseSchedule() {
  const { data, isLoading, error } = useScheduleData()
  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return null

  const heatmapData: [number, number, number][] = data.timeDistribution.hours.map((_, i) => [i, 0, data.timeDistribution.values[i]])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', gap: 8 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginBottom: 2 }}>年级排课分布</div>
          <BarChart data={data.gradeDistribution} height={100} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginBottom: 2 }}>科目占比</div>
          <PieChart data={data.subjectDistribution} height={130} />
        </div>
      </div>
      <div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 2 }}>时段课程密度</div>
        <HeatmapChart
          xLabels={data.timeDistribution.hours}
          yLabels={['课程密度']}
          data={heatmapData}
          height={90}
        />
      </div>
    </div>
  )
}
