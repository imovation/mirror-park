import { useEffect } from 'react'
import { CHART_PALETTE, HUE_ROTATION } from '@/config/chartTheme'
import { useAlertData } from '@/api/queries/security'
import { useUIStore } from '@/stores/useUIStore'
import NumberFlip from '@/components/ui/NumberFlip'
import PieChart from '@/components/charts/PieChart'
import RingChart from '@/components/charts/RingChart'
import ScrollList from '@/components/ui/ScrollList'
import StatusPanel from '@/components/ui/StatusPanel'
import ChartLabel from '@/components/ui/ChartLabel'

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
    addAlert(alerts[Math.floor(Math.random() * alerts.length)])
    const timer = setInterval(() => {
      addAlert(alerts[Math.floor(Math.random() * alerts.length)])
    }, 15000)
    return () => clearInterval(timer)
  }, [addAlert])

  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return <StatusPanel type="empty" />
  return (
    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexShrink: 0 }}>
        <div style={{ textAlign: 'center' }}>
          <NumberFlip label="今日告警" value={data.todayTotal} unit="次" color="var(--color-danger)" />
          {data.yesterdayTotal > 0 && <div style={{ fontSize: 'var(--font-size-2xs)', color: data.todayTotal > data.yesterdayTotal ? 'var(--color-warning)' : data.todayTotal < data.yesterdayTotal ? 'var(--color-success)' : 'var(--text-tertiary)', marginTop: 2 }}>
            较昨日 {data.todayTotal > data.yesterdayTotal ? '↑' : data.todayTotal < data.yesterdayTotal ? '↓' : '→'} {Math.abs(Math.round((data.todayTotal - data.yesterdayTotal) / data.yesterdayTotal * 100))}%
          </div>}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 6, flex: 1, minHeight: 0 }}>
        <div style={{ flex: 1, minHeight: 0 }}>
          <ChartLabel align="center">告警类型</ChartLabel>
          <PieChart data={data.typeDistribution} colors={HUE_ROTATION.r2} height={120} />
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <ChartLabel align="center">处理状态</ChartLabel>
          <RingChart
            data={[{ name: '已处理', value: Math.round(data.handledRatio * 100) }, { name: '未处理', value: 100 - Math.round(data.handledRatio * 100) }]}
            colors={[CHART_PALETTE.semantic.success, CHART_PALETTE.semantic.danger]}
            centerLabel={`${Math.round(data.handledRatio * 100)}%`}
            height={120}
          />
        </div>
      </div>
      <div>
        <ChartLabel>告警事件列表</ChartLabel>
        <ScrollList items={data.records.map(r => ({ id: r.id, content: <div style={{display:'flex',justifyContent:'space-between'}}><span>{r.type} · {r.location}</span><span style={{display:'flex',gap:8}}><span style={{fontSize:'var(--font-size-xs)',color:'var(--text-muted)'}}>{r.time}</span><span style={{fontSize:'var(--font-size-xs)',color:r.status==='已处理'?'var(--color-success)':r.status==='处理中'?'var(--accent)':'var(--color-danger)'}}>{r.status}</span></span></div> }))} />
      </div>
    </div>
  )
}
