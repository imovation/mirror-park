import { useClassData } from '@/api/queries/academics'
import NumberFlip from '@/components/ui/NumberFlip'
import BarChart from '@/components/charts/BarChart'
import ScrollList from '@/components/ui/ScrollList'

export default function ClassManagement() {
  const { data, isLoading, error } = useClassData()
  if (isLoading) return <div style={{ color: '#6b7280', fontSize: '0.75rem' }}>加载中...</div>
  if (error) return <div style={{ color: '#ef4444', fontSize: '0.75rem' }}>数据加载失败</div>
  if (!data) return null
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
        <NumberFlip label="班级总数" value={data.totalClasses} unit="个" />
      </div>
      <div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginBottom: 2 }}>各年级班级数</div>
        <BarChart data={data.gradeClasses.map(g => ({ name: g.name, value: g.count }))} height={90} />
      </div>
      <div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 2 }}>班级列表</div>
        <ScrollList
          items={data.classList.map(c => ({
            id: c.id,
            content: (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{c.name}</span>
                <span style={{ display: 'flex', gap: 10 }}>
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>{c.headTeacher}</span>
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>{c.studentCount}人</span>
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
