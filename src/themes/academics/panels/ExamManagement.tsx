import { useExamData } from '@/api/queries/academics'
import BarChart from '@/components/charts/BarChart'
import FunnelChart from '@/components/charts/FunnelChart'
import ScrollList from '@/components/ui/ScrollList'
import StatusPanel from '@/components/ui/StatusPanel'
import ChartLabel from '@/components/ui/ChartLabel'

export default function ExamManagement() {
  const { data, isLoading, error } = useExamData()
  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return <StatusPanel type="empty" />
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1, minHeight: 0 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px', gap: 6, alignItems: 'flex-start' }}>
        <div>
          <ChartLabel>近期考试</ChartLabel>
          <ScrollList
            maxHeight={80}
            items={data.upcomingExams.slice(0, 3).map(e => ({
              id: e.id,
              content: (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-sm)' }}>
                  <span style={{ fontWeight: 500 }}>{e.grade} · {e.subject}</span>
                  <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>{e.date}</span>
                </div>
              ),
            }))}
          />
        </div>
        <div style={{ textAlign: 'center', background: 'rgba(74,158,255,0.06)', border: '1px solid var(--border-light)', borderRadius: 8, padding: '8px 6px' }}>
          <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, color: '#1890ff', fontFamily: "'Courier New', monospace", lineHeight: 1 }}>{data.semesterExamCount}</div>
          <div style={{ fontSize: 'var(--font-size-2xs)', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>本学期考试{'\u00A0'}/ 场</div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 6, flex: 1, minHeight: 0 }}>
        <div style={{ flex: 1, minHeight: 0 }}>
          <ChartLabel align="center">年级均分</ChartLabel>
          <BarChart data={data.gradeAverages} height={120} />
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <ChartLabel align="center">成绩分布</ChartLabel>
          <FunnelChart data={data.scoreDistribution} height={180} color={['#f06a6a', '#f59e4b', '#f7d44a', '#6ab04c', '#3b82f6']} />
        </div>
      </div>
    </div>
  )
}
