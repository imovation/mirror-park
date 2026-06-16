import { useEffect } from 'react'
import { useAlertData } from '@/api/queries/security'
import { useUIStore } from '@/stores/useUIStore'
import NumberFlip from '@/components/ui/NumberFlip'
import PieChart from '@/components/charts/PieChart'
import RingChart from '@/components/charts/RingChart'
import ScrollList from '@/components/ui/ScrollList'
import StatusPanel from '@/components/ui/StatusPanel'

export default function AlertEvents() {
  const { data, isLoading, error } = useAlertData()
  const addAlert = useUIStore((s) => s.addAlert)

  useEffect(() => {
    const alerts: { type: 'warning' | 'error' | 'info'; message: string }[] = [
      { type: 'error', message: '南门异常通行记录' },
      { type: 'warning', message: '体育馆区域设备离线' },
      { type: 'error', message: '教学楼A区火警预警' },
      { type: 'error', message: '北围墙周界入侵告警' },
      { type: 'warning', message: '宿舍楼门禁异常' },
    ]
    const timer = setInterval(() => {
      addAlert(alerts[Math.floor(Math.random() * alerts.length)])
    }, 15000)
    return () => clearInterval(timer)
  }, [addAlert])

  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
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
            data={[{ name: '已处理', value: Math.round(data.handledRatio * 100) }, { name: '未处理', value: 100 - Math.round(data.handledRatio * 100) }]}
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
