import { useAlertData } from '@/api/queries/security'
import NumberFlip from '@/components/ui/NumberFlip'
import PieChart from '@/components/charts/PieChart'
import RingChart from '@/components/charts/RingChart'
import ScrollList from '@/components/ui/ScrollList'

export default function AlertEvents() {
  const { data, isLoading, error } = useAlertData()
  if (isLoading) return <div style={{ color: '#6b7280', fontSize: '0.75rem' }}>加载中...</div>
  if (error) return <div style={{ color: '#ef4444', fontSize: '0.75rem' }}>数据加载失败</div>
  if (!data) return null
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
        <NumberFlip label="今日告警" value={data.todayTotal} unit="次" color="#ff1744" />
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginBottom: 2 }}>告警类型</div>
          <PieChart data={data.typeDistribution} height={130} colors={['#ff1744','#ff6d00','#ffc107','#4a9eff','#00c853']} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginBottom: 2 }}>处理状态</div>
          <RingChart
            data={[{ name: '已处理', value: Math.round(data.handledRatio * 100) }, { name: '未处理', value: Math.round(data.unhandledRatio * 100) || Math.round((1 - data.handledRatio) * 100) }]}
            colors={['#00c853','#ff1744']}
            centerLabel={`${Math.round(data.handledRatio * 100)}%`}
            height={130}
          />
        </div>
      </div>
      <div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 2 }}>告警事件列表</div>
        <ScrollList items={data.records.map(r => ({ id: r.id, content: <div style={{display:'flex',justifyContent:'space-between'}}><span>{r.type} · {r.location}</span><span style={{display:'flex',gap:8}}><span style={{fontSize:10,color:'rgba(255,255,255,0.3)'}}>{r.time}</span><span style={{fontSize:10,color:r.status==='已处理'?'#00c853':r.status==='处理中'?'#4a9eff':'#ff1744'}}>{r.status}</span></span></div> }))} maxHeight={100} />
      </div>
    </div>
  )
}
