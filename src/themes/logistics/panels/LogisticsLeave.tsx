import { CHART_PALETTE, HUE_ROTATION } from '@/config/chartTheme'
import { useLogisticsLeave } from '@/api/queries/logistics'
import NumberFlip from '@/components/ui/NumberFlip'
import PieChart from '@/components/charts/PieChart'
import BarChart from '@/components/charts/BarChart'
import LineChart from '@/components/charts/LineChart'
import ScrollList from '@/components/ui/ScrollList'
import StatusPanel from '@/components/ui/StatusPanel'
import ChartLabel from '@/components/ui/ChartLabel'

export default function LogisticsLeave() {
  const { data, isLoading, error } = useLogisticsLeave()
  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return <StatusPanel type="empty" />

  const sickCount = data.typeDistribution.find((t) => t.name === '病假')?.value ?? 0
  const personalCount = data.typeDistribution.find((t) => t.name === '事假')?.value ?? 0
  const sickRatio = data.todayTotal > 0 ? Math.round((sickCount / data.todayTotal) * 100) : 0

  const fakeTrend = {
    days: Array.from({ length: 7 }, (_, i) => `${i + 15}`),
    values: [28, 24, 19, 25, 22, 18, data.todayTotal],
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1, minHeight: 0 }}>
      <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexShrink: 0 }}>
        <div style={{ flexShrink: 0, minWidth: 0, overflow: 'hidden' }}><NumberFlip label="今日请假" value={data.todayTotal} unit="人" color="var(--color-warning)" trend={{ direction: 'down', percent: 12 }} /></div>
        <div style={{ flexShrink: 0, minWidth: 0, overflow: 'hidden' }}><NumberFlip label="病假占比" value={sickRatio} unit="%" color="var(--color-danger)" /></div>
        <div style={{ flexShrink: 0, minWidth: 0, overflow: 'hidden' }}><NumberFlip label="事假人数" value={personalCount} unit="人" color="var(--accent)" /></div>
      </div>
      <div style={{ display: 'flex', gap: 6, flex: 1, minHeight: 0 }}>
        <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
          <ChartLabel align="center">请假类型分布</ChartLabel>
          <PieChart data={data.typeDistribution} colors={HUE_ROTATION.r3} height={130} />
        </div>
        <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
          <ChartLabel align="center">各年级请假</ChartLabel>
          <BarChart data={data.gradeDistribution} height={130} />
        </div>
      </div>
      <div style={{ flexShrink: 0 }}>
        <ChartLabel>近 7 日请假趋势</ChartLabel>
        <LineChart
          xData={fakeTrend.days}
          series={[{ name: '请假人数', data: fakeTrend.values, color: HUE_ROTATION.r3[2] }]}
          height={120}
          smooth
        />
      </div>
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <ChartLabel>请假离校记录 ({data.records.length})</ChartLabel>
        <div style={{ flex: 1, minHeight: 0, overflow: 'auto', borderRadius: 6, background: 'var(--panel-bg)', border: '1px solid var(--border)', paddingTop: 4 }}>
          <ScrollList
            maxHeight={144}
            items={data.records.slice(0, 6).map(r => ({
              id: r.id,
              content: (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-sm)' }}>
                  <span style={{ fontWeight: 500 }}>{r.name} · {r.className}</span>
                  <span style={{ display: 'flex', gap: 8 }}>
                    <span style={{ fontSize: 'var(--font-size-xs)', color: r.type === '病假' ? 'var(--color-danger)' : r.type === '事假' ? 'var(--color-warning)' : 'var(--text-muted)' }}>{r.type}</span>
                    <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>{r.time}</span>
                  </span>
                </div>
              ),
            }))}
          />
        </div>
      </div>
    </div>
  )
}
