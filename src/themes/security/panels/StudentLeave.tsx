import { useLeaveData } from '@/api/queries/security'
import NumberFlip from '@/components/ui/NumberFlip'
import PieChart from '@/components/charts/PieChart'
import BarChart from '@/components/charts/BarChart'
import ScrollList from '@/components/ui/ScrollList'
import StatusPanel from '@/components/ui/StatusPanel'
import ChartLabel from '@/components/ui/ChartLabel'

export default function StudentLeave() {
  const { data, isLoading, error } = useLeaveData()
  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return <StatusPanel type="empty" />
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ textAlign: 'center' }}>
        <NumberFlip label="今日请假人数" value={data.todayTotal} unit="人" color="var(--color-warning)" />
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <div style={{ flex: 1 }}>
          <ChartLabel align="center">请假类型</ChartLabel>
          <PieChart data={data.typeDistribution} height={120} />
        </div>
        <div style={{ flex: 1 }}>
          <ChartLabel align="center">各年级请假</ChartLabel>
          <BarChart data={data.gradeDistribution} height={120} horizontal={false} />
        </div>
      </div>
      <div>
        <ChartLabel>离校记录</ChartLabel>
        <ScrollList items={data.records.map(r => ({ id: r.id, content: <div style={{display:'flex',justifyContent:'space-between'}}><span>{r.name} · {r.className}</span><span style={{display:'flex',gap:8}}><span style={{fontSize:10,color:'var(--text-muted)'}}>{r.type}</span><span style={{fontSize:10,color:'var(--text-muted)'}}>{r.time}</span></span></div> }))} maxHeight={90} />
      </div>
    </div>
  )
}
