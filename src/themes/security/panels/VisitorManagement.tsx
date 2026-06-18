import { useVisitorData } from '@/api/queries/security'
import NumberFlip from '@/components/ui/NumberFlip'
import PieChart from '@/components/charts/PieChart'
import ScrollList from '@/components/ui/ScrollList'
import StatusPanel from '@/components/ui/StatusPanel'
import ChartLabel from '@/components/ui/ChartLabel'

export default function VisitorManagement() {
  const { data, isLoading, error } = useVisitorData()
  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return <StatusPanel type="empty" />
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
        <NumberFlip label="今日访客" value={data.todayVisitors} unit="人" color="#4a9eff" />
        <NumberFlip label="当前在校" value={data.currentVisitors} unit="人" color="#00c853" />
      </div>
      <div>
        <ChartLabel align="center">来访目的分布</ChartLabel>
        <PieChart data={data.purposeDistribution} height={130} />
      </div>
      <div>
        <ChartLabel>访客登记</ChartLabel>
        <ScrollList items={data.records.map(r => ({ id: r.id, content: <div style={{display:'flex',justifyContent:'space-between'}}><span>{r.name}</span><span style={{display:'flex',gap:8}}><span style={{fontSize:10,color:'var(--text-muted)'}}>{r.purpose}</span><span style={{fontSize:10,color:'var(--text-muted)'}}>{r.time}</span></span></div> }))} maxHeight={100} />
      </div>
    </div>
  )
}
