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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1, minHeight: 0, overflow: 'auto' }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <div style={{ flex: 2 }}>
          <ChartLabel>近期考试</ChartLabel>
          <ScrollList
            items={data.upcomingExams.map(e => ({
              id: e.id,
              content: (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 500 }}>{e.grade} · {e.subject}</span>
                  <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{e.date}</span>
                </div>
              ),
            }))}
          />
        </div>
        <div style={{ flex: 1, textAlign: 'center', background: 'var(--panel-bg)', border: '1px solid var(--border-light)', borderRadius: 8, padding: '10px 12px' }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#1890ff', fontFamily: "'Courier New', monospace" }}>{data.semesterExamCount}</div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>本学期考试 / 场</div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <div style={{ flex: 1 }}>
          <ChartLabel align="center">年级均分</ChartLabel>
          <BarChart data={data.gradeAverages} height={100} />
        </div>
        <div style={{ flex: 1 }}>
          <ChartLabel align="center">成绩分布</ChartLabel>
          <FunnelChart data={data.scoreDistribution} height={200} />
        </div>
      </div>
    </div>
  )
}
