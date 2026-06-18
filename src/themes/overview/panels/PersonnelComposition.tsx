import { usePersonnelComposition } from '@/api/queries/overview'
import NumberFlip from '@/components/ui/NumberFlip'
import RingChart from '@/components/charts/RingChart'
import StatusPanel from '@/components/ui/StatusPanel'
import ChartLabel from '@/components/ui/ChartLabel'

export default function PersonnelComposition() {
  const { data, isLoading, error } = usePersonnelComposition()

  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return <StatusPanel type="empty" />

  const genderData = [
    { name: '男', value: data.maleCount },
    { name: '女', value: data.femaleCount },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <NumberFlip label="教师总数" value={data.totalTeachers} unit="人" />
      <div style={{ display: 'flex', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <ChartLabel align="center">性别分布</ChartLabel>
          <RingChart data={genderData} height={140} />
        </div>
        <div style={{ flex: 1 }}>
          <ChartLabel align="center">学历分布</ChartLabel>
          <RingChart data={data.education} height={140} colors={['#00c853', '#4a9eff', '#ff6d00', '#aa00ff']} />
        </div>
      </div>
    </div>
  )
}
