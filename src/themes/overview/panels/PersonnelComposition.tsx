import { usePersonnelComposition } from '@/api/queries/overview'
import NumberFlip from '@/components/ui/NumberFlip'
import SunburstChart from '@/components/charts/SunburstChart'
import StatusPanel from '@/components/ui/StatusPanel'

export default function PersonnelComposition() {
  const { data, isLoading, error } = usePersonnelComposition()

  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return null

  const sunburstData = [
    {
      name: '教职工',
      children: [
        {
          name: '男',
          value: data.maleCount,
        },
        {
          name: '女',
          value: data.femaleCount,
        }
      ]
    },
    {
      name: '学历',
      children: data.education.map(e => ({ name: e.name, value: e.value }))
    }
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, justifyContent: 'center' }}>
        <NumberFlip label="教师总数" value={data.totalTeachers} unit="人" />
      </div>
      <div style={{ flex: 1 }}>
        <SunburstChart data={sunburstData} height={200} />
      </div>
    </div>
  )
}
