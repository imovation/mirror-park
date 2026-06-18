import { useAccessData } from '@/api/queries/security'
import NumberFlip from '@/components/ui/NumberFlip'
import BarChart from '@/components/charts/BarChart'
import ScrollList from '@/components/ui/ScrollList'
import StatusPanel from '@/components/ui/StatusPanel'
import ChartLabel from '@/components/ui/ChartLabel'

export default function AccessControl() {
  const { data, isLoading, error } = useAccessData()
  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return <StatusPanel type="empty" />
  return (
    <div style={{ flex: 1, minHeight: 0, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
        <NumberFlip label="今日通行" value={data.todayTotal} unit="人次" color="var(--color-success)" />
        <NumberFlip label="异常记录" value={data.abnormalRecords.length} unit="条" color="var(--color-warning)" />
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <ChartLabel>各门禁点通行统计</ChartLabel>
        <BarChart data={data.points} height={110} />
      </div>
      <div>
        <ChartLabel>异常通行记录</ChartLabel>
        <ScrollList items={data.abnormalRecords.map(r => ({ id: r.id, content: <div style={{display:'flex',justifyContent:'space-between'}}><span>{r.location} · {r.type}</span><span style={{display:'flex',gap:8}}><span style={{fontSize:10,color:'var(--text-muted)'}}>{r.time}</span><span style={{fontSize:10,color:r.status==='已处理'?'var(--color-success)':'var(--color-warning)'}}>{r.status}</span></span></div> }))} />
      </div>
    </div>
  )
}
