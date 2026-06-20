import { useLogisticsLeave } from '@/api/queries/logistics'
import NumberFlip from '@/components/ui/NumberFlip'
import PieChart from '@/components/charts/PieChart'
import BarChart from '@/components/charts/BarChart'
import ScrollList from '@/components/ui/ScrollList'
import StatusPanel from '@/components/ui/StatusPanel'
import ChartLabel from '@/components/ui/ChartLabel'

export default function LogisticsLeave() {
  const { data, isLoading, error } = useLogisticsLeave()
  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return <StatusPanel type="empty" />
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1, minHeight: 0 }}>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexShrink: 0 }}>
        <NumberFlip label="今日请假人数" value={data.todayTotal} unit="人" color="var(--color-warning)" trend={{ direction: 'down', percent: 12 }} />
      </div>
      <div style={{ display: 'flex', gap: 6, flex: 1, minHeight: 0 }}>
        <div style={{ flex: 1, minHeight: 0 }}>
          <ChartLabel align="center">请假类型</ChartLabel>
          <PieChart data={data.typeDistribution} height={140} />
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <ChartLabel align="center">各年级请假</ChartLabel>
          <BarChart data={data.gradeDistribution} height={140} />
        </div>
      </div>
      <div>
        <ChartLabel>请假离校记录</ChartLabel>
        <ScrollList
          maxHeight={90}
          items={data.records.slice(0, 3).map(r => ({
            id: r.id,
            content: (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-sm)' }}>
                <span style={{ fontWeight: 500 }}>{r.name} · {r.className}</span>
                <span style={{ display: 'flex', gap: 8 }}>
                  <span style={{ fontSize: 'var(--font-size-xs)', color: r.type === '病假' ? 'var(--color-warning)' : 'var(--text-muted)' }}>{r.type}</span>
                  <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>{r.time}</span>
                </span>
              </div>
            ),
          }))}
        />
      </div>
    </div>
  )
}
