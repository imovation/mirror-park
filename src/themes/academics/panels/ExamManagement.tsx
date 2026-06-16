import { useExamData } from '@/api/queries/academics'
import BarChart from '@/components/charts/BarChart'
import NumberFlip from '@/components/ui/NumberFlip'
import ScrollList from '@/components/ui/ScrollList'

export default function ExamManagement() {
  const { data, isLoading, error } = useExamData()
  if (isLoading) return <div style={{ color: '#6b7280', fontSize: '0.75rem' }}>加载中...</div>
  if (error) return <div style={{ color: '#ef4444', fontSize: '0.75rem' }}>数据加载失败</div>
  if (!data) return null
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 2 }}>近期考试</div>
          <ScrollList
            items={data.upcomingExams.map(e => ({
              id: e.id,
              content: (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>{e.grade} · {e.subject}</span>
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>{e.date}</span>
                </div>
              ),
            }))}
            maxHeight={80}
          />
        </div>
        <NumberFlip label="本学期考试" value={data.semesterExamCount} unit="场" color="#4a9eff" />
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginBottom: 2 }}>年级均分</div>
          <BarChart data={data.gradeAverages} height={100} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginBottom: 2 }}>成绩分布</div>
          <BarChart data={data.scoreDistribution} height={100} />
        </div>
      </div>
    </div>
  )
}
