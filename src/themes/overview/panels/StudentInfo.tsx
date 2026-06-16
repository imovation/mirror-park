import { useStudentInfo } from '@/api/queries/overview'
import BarChart from '@/components/charts/BarChart'
import RingChart from '@/components/charts/RingChart'

export default function StudentInfo() {
  const { data, isLoading, error } = useStudentInfo()

  if (isLoading) return <div style={{ color: '#6b7280', fontSize: '0.75rem' }}>加载中...</div>
  if (error) return <div style={{ color: '#ef4444', fontSize: '0.75rem' }}>数据加载失败</div>
  if (!data) return null

  const totalMale = data.grades.reduce((s, g) => s + g.male, 0)
  const totalFemale = data.grades.reduce((s, g) => s + g.female, 0)
  const gradeData = data.grades.map((g) => ({ name: g.name, value: g.total }))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 2 }}>各年级学生人数</div>
        <BarChart data={gradeData} height={120} horizontal={false} color="#4a9eff" />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginBottom: 4 }}>男女比例</div>
        <RingChart
          data={[
            { name: '男', value: totalMale },
            { name: '女', value: totalFemale },
          ]}
          colors={['#4a9eff', '#ff6d00']}
          centerLabel={`${totalMale}:${totalFemale}`}
          height={140}
        />
      </div>
    </div>
  )
}
