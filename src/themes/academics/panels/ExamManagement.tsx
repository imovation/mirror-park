import { useExamData } from '@/api/queries/academics'
import BarChart from '@/components/charts/BarChart'
import FunnelChart from '@/components/charts/FunnelChart'
import NumberFlip from '@/components/ui/NumberFlip'
import ScrollList from '@/components/ui/ScrollList'
import StatusPanel from '@/components/ui/StatusPanel'
import ChartLabel from '@/components/ui/ChartLabel'

export default function ExamManagement() {
  const { data, isLoading, error } = useExamData()
  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return <StatusPanel type="empty" />
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, height: '100%' }}>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ flex: 1, minHeight: 0 }}>
          <ChartLabel>近期考试</ChartLabel>
          <ScrollList
            items={data.upcomingExams.map(e => ({
              id: e.id,
              content: (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>{e.grade} · {e.subject}</span>
                  <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{e.date}</span>
                </div>
              ),
            }))}
            maxHeight={80}
          />
        </div>
        <NumberFlip label="本学期考试" value={data.semesterExamCount} unit="场" color="#4a9eff" />
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <div style={{ flex: 1, minHeight: 0 }}>
          <ChartLabel align="center">年级均分</ChartLabel>
          <BarChart data={data.gradeAverages} />
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <ChartLabel align="center">成绩分布</ChartLabel>
          <FunnelChart data={data.scoreDistribution} />
        </div>
      </div>
    </div>
  )
}
