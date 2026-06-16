import { useCanteenData } from '@/api/queries/security'
import NumberFlip from '@/components/ui/NumberFlip'
import BarChart from '@/components/charts/BarChart'
import ScrollList from '@/components/ui/ScrollList'

export default function CanteenSafety() {
  const { data, isLoading, error } = useCanteenData()
  if (isLoading) return <div style={{ color: '#6b7280', fontSize: '0.75rem' }}>加载中...</div>
  if (error) return <div style={{ color: '#ef4444', fontSize: '0.75rem' }}>数据加载失败</div>
  if (!data) return null
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ textAlign: 'center' }}>
        <NumberFlip label="今日就餐人次" value={data.todayTotal} unit="人次" color="#00c853" />
      </div>
      <div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 2 }}>各餐次就餐人数</div>
        <BarChart data={data.meals} height={120} horizontal={false} />
      </div>
      <div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 2 }}>食品安全检查</div>
        <ScrollList items={data.safetyRecords.map(r => ({ id: r.id, content: <div style={{display:'flex',justifyContent:'space-between'}}><span>{r.item}</span><span style={{display:'flex',gap:8}}><span style={{fontSize:10,color:'rgba(255,255,255,0.3)'}}>{r.date}</span><span style={{fontSize:10,color:'#00c853'}}>{r.result}</span></span></div> }))} maxHeight={80} />
      </div>
    </div>
  )
}
