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
    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div style={{ textAlign: 'center', flexShrink: 0 }}>
        <NumberFlip label="今日请假人数" value={data.todayTotal} unit="人" color="var(--color-warning)" />
      </div>
      <div style={{ display: 'flex', gap: 6, flex: 1, minHeight: 0 }}>
        <div style={{ flex: 1, minHeight: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ width: '100%', maxWidth: 200, aspectRatio: '1' }}>
            <ChartLabel align="center">请假类型</ChartLabel>
            <PieChart data={data.typeDistribution} height={140} />
          </div>
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <ChartLabel align="center">各年级请假</ChartLabel>
          <BarChart data={data.gradeDistribution} height={120} horizontal={false} />
        </div>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <ChartLabel>离校记录</ChartLabel>
        <ScrollList
          maxHeight={90}
          items={data.records.slice(0, 3).map(r => ({ id: r.id, content: <div style={{display:'flex',justifyContent:'space-between'}}><span>{r.name} · {r.className}</span><span style={{display:'flex',gap:6}}><span style={{fontSize:'var(--font-size-xs)',color:'var(--text-muted)'}}>{r.type}</span><span style={{fontSize:'var(--font-size-xs)',color:'var(--text-muted)'}}>{r.time}</span></span></div> }))}
        />
      </div>
    </div>
  )
}
