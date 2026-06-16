import { useScheduleData } from '@/api/queries/academics'
import BarChart from '@/components/charts/BarChart'
import PieChart from '@/components/charts/PieChart'
import HeatmapChart from '@/components/charts/HeatmapChart'

export default function CourseSchedule() {
  const { data, isLoading, error } = useScheduleData()
  if (isLoading) return <div style={{ color: '#6b7280', fontSize: '0.75rem' }}>加载中...</div>
  if (error) return <div style={{ color: '#ef4444', fontSize: '0.75rem' }}>数据加载失败</div>
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
