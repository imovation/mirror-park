import { useClassData } from '@/api/queries/academics'
import NumberFlip from '@/components/ui/NumberFlip'
import BarChart from '@/components/charts/BarChart'
import ScrollList from '@/components/ui/ScrollList'
import StatusPanel from '@/components/ui/StatusPanel'
import ChartLabel from '@/components/ui/ChartLabel'

export default function ClassManagement() {
  const { data, isLoading, error } = useClassData()
  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return <StatusPanel type="empty" />
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <NumberFlip label="班级总数" value={data.totalClasses} unit="个" color="var(--accent)" />
        <NumberFlip label="人均学生" value={Math.round(data.classList.reduce((sum, c) => sum + c.studentCount, 0) / data.totalClasses)} unit="人/班" color="var(--color-success)" />
      </div>
      <div style={{ flex: 1 }}>
        <ChartLabel align="center">各年级班级数</ChartLabel>
        <BarChart data={data.gradeClasses.map(g => ({ name: g.name, value: g.count }))} height={90} />
      </div>
      <div>
        <ChartLabel>班级列表</ChartLabel>
        <ScrollList
          items={data.classList.map(c => ({
            id: c.id,
            content: (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{c.name}</span>
                <span style={{ display: 'flex', gap: 10 }}>
                  <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{c.headTeacher}</span>
                  <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{c.studentCount}人</span>
                </span>
              </div>
            ),
          }))}
          maxHeight={90}
        />
      </div>
    </div>
  )
}
