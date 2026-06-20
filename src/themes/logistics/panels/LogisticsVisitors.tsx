import { useLogisticsVisitors } from '@/api/queries/logistics'
import NumberFlip from '@/components/ui/NumberFlip'
import PieChart from '@/components/charts/PieChart'
import ScrollList from '@/components/ui/ScrollList'
import StatusPanel from '@/components/ui/StatusPanel'
import ChartLabel from '@/components/ui/ChartLabel'

export default function LogisticsVisitors() {
  const { data, isLoading, error } = useLogisticsVisitors()
  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return <StatusPanel type="empty" />
  return (
    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexShrink: 0 }}>
        <NumberFlip label="今日访客" value={data.todayVisitors} unit="人" color="var(--accent)" />
        <NumberFlip label="当前在校" value={data.currentVisitors} unit="人" color="var(--color-success)" />
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <ChartLabel align="center">来访目的分布</ChartLabel>
        <PieChart data={data.purposeDistribution} height={120} />
      </div>
      <div>
        <ChartLabel>访客登记</ChartLabel>
        <ScrollList items={data.records.map(r => ({ id: r.id, content: <div style={{display:'flex',justifyContent:'space-between'}}><span>{r.name}</span><span style={{display:'flex',gap:8}}><span style={{fontSize:'var(--font-size-xs)',color:'var(--text-muted)'}}>{r.purpose}</span><span style={{fontSize:'var(--font-size-xs)',color:'var(--text-muted)'}}>{r.time}</span></span></div> }))} />
      </div>
    </div>
  )
}
