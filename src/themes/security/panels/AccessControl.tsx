import { useAccessData } from '@/api/queries/security'
import RankList from '@/components/ui/RankList'
import ScrollList from '@/components/ui/ScrollList'
import StatusPanel from '@/components/ui/StatusPanel'
import ChartLabel from '@/components/ui/ChartLabel'

export default function AccessControl() {
  const { data, isLoading, error } = useAccessData()
  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return <StatusPanel type="empty" />

  const rankItems = data.points.map((p, i) => ({
    id: `point-${i}`,
    name: p.name,
    value: p.value,
    unit: '次',
    color: 'var(--accent)'
  }))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 12px', borderBottom: '1px solid var(--border-light)', paddingBottom: 4 }}>
         <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>今日通行: <span style={{color: 'var(--color-success)', fontWeight: 'bold'}}>{data.todayTotal}</span></div>
         <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>异常记录: <span style={{color: 'var(--color-warning)', fontWeight: 'bold'}}>{data.abnormalRecords.length}</span></div>
      </div>
      <div style={{ flex: 1 }}>
        <ChartLabel>各门禁点通行统计</ChartLabel>
        <RankList items={rankItems} maxHeight={110} />
      </div>
      <div>
        <ChartLabel>异常通行记录</ChartLabel>
        <ScrollList items={data.abnormalRecords.map(r => ({ id: r.id, content: <div style={{display:'flex',justifyContent:'space-between'}}><span>{r.location} · {r.type}</span><span style={{display:'flex',gap:8}}><span style={{fontSize:10,color:'var(--text-muted)'}}>{r.time}</span><span style={{fontSize:10,color:r.status==='已处理'?'var(--color-success)':'var(--color-warning)'}}>{r.status}</span></span></div> }))} maxHeight={80} />
      </div>
    </div>
  )
}
