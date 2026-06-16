import { usePersonnelComposition } from '@/api/queries/overview'
import NumberFlip from '@/components/ui/NumberFlip'
import RingChart from '@/components/charts/RingChart'
import StatusPanel from '@/components/ui/StatusPanel'

export default function PersonnelComposition() {
  const { data, isLoading, error } = usePersonnelComposition()

  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, justifyContent: 'center' }}>
        <NumberFlip label="教师总数" value={data.totalTeachers} unit="人" />
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginBottom: 4 }}>男女比例</div>
          <RingChart
            data={[
              { name: '男', value: data.maleCount },
              { name: '女', value: data.femaleCount },
            ]}
            colors={['#4a9eff', '#ff6d00']}
            centerLabel={`${data.maleCount}:${data.femaleCount}`}
            height={160}
          />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginBottom: 4 }}>学历分布</div>
          <RingChart
            data={data.education}
            height={160}
          />
        </div>
      </div>
    </div>
  )
}
