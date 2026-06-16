import { useAccessData } from '@/api/queries/security'
import NumberFlip from '@/components/ui/NumberFlip'
import BarChart from '@/components/charts/BarChart'
import ScrollList from '@/components/ui/ScrollList'
import StatusPanel from '@/components/ui/StatusPanel'

export default function AccessControl() {
  const { data, isLoading, error } = useAccessData()
  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return null
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ textAlign: 'center' }}>
        <NumberFlip label="今日通行人次" value={data.todayTotal} unit="人次" color="#00c853" />
      </div>
      <div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 2 }}>各门禁点通行统计</div>
        <BarChart data={data.points} height={100} />
      </div>
      <div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 2 }}>异常通行记录</div>
        <ScrollList items={data.abnormalRecords.map(r => ({ id: r.id, content: <div style={{display:'flex',justifyContent:'space-between'}}><span>{r.location} · {r.type}</span><span style={{display:'flex',gap:8}}><span style={{fontSize:10,color:'rgba(255,255,255,0.3)'}}>{r.time}</span><span style={{fontSize:10,color:r.status==='已处理'?'#00c853':'#ff6d00'}}>{r.status}</span></span></div> }))} maxHeight={80} />
      </div>
    </div>
  )
}
