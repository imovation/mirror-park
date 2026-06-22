import { CHART_PALETTE } from '@/config/chartTheme'
import { useClassroomUsage } from '@/api/queries/academics'
import BarChart from '@/components/charts/BarChart'
import RingChart from '@/components/charts/RingChart'
import StatusPanel from '@/components/ui/StatusPanel'
import ChartLabel from '@/components/ui/ChartLabel'

export default function ClassroomSpaceUsage() {
  const { data, isLoading, error } = useClassroomUsage()
  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return <StatusPanel type="empty" />

  const total = data.inUse + data.available
  const usageRate = total > 0 ? Math.round((data.inUse / total) * 100) : 0
  const conflictCount = Math.max(0, data.inUse - data.available)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1, minHeight: 0 }}>
      <div style={{ display: 'flex', gap: 6, alignItems: 'stretch', flexShrink: 0 }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <RingChart
            data={[
              { name: '使用中', value: data.inUse },
              { name: '空闲', value: data.available },
            ]}
            colors={[CHART_PALETTE.semantic.warning, CHART_PALETTE.semantic.success]}
            height={90}
            centerLabel={`${usageRate}%`}
            centerLabelSize={16}
            legendPosition="bottom"
          />
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 3 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '3px 6px', background: 'var(--panel-bg)', border: '1px solid var(--border-light)', borderRadius: 3 }}>
            <span style={{ fontSize: 'var(--font-size-2xs)', color: 'var(--text-muted)' }}>使用中</span>
            <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 700, color: 'var(--color-warning)', fontFamily: 'monospace' }}>{data.inUse}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '3px 6px', background: 'var(--panel-bg)', border: '1px solid var(--border-light)', borderRadius: 3 }}>
            <span style={{ fontSize: 'var(--font-size-2xs)', color: 'var(--text-muted)' }}>空闲</span>
            <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 700, color: 'var(--color-success)', fontFamily: 'monospace' }}>{data.available}</span>
          </div>
          {conflictCount > 0 && (
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '3px 6px', background: 'rgba(var(--color-warning-rgb), 0.15)', border: '1px solid var(--color-warning)', borderRadius: 3 }}>
              <span style={{ fontSize: 'var(--font-size-2xs)', color: 'var(--color-warning)' }}>⚠ 冲突</span>
              <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 700, color: 'var(--color-warning)', fontFamily: 'monospace' }}>{conflictCount}</span>
            </div>
          )}
        </div>
      </div>
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <ChartLabel>各楼宇使用率</ChartLabel>
        <div style={{ flex: 1, minHeight: 0 }}>
          <BarChart
            data={data.buildingUsage}
            colors={CHART_PALETTE.dark}
            height={120}
            barWidth="55%"
            showLabel
          />
        </div>
      </div>
    </div>
  )
}
