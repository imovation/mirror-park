import { CHART_PALETTE } from '@/config/chartTheme'
import { useState } from 'react'
import { useLogisticsCanteen } from '@/api/queries/logistics'
import BarChart from '@/components/charts/BarChart'
import StatusPanel from '@/components/ui/StatusPanel'
import ChartLabel from '@/components/ui/ChartLabel'
import VideoWindow from '@/components/ui/VideoWindow'

export default function LogisticsCanteen() {
  const { data, isLoading, error } = useLogisticsCanteen()
  const [showVideo, setShowVideo] = useState(false)
  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return <StatusPanel type="empty" />

  const peakMeal = data.meals.reduce((max, m) => (m.value > max.value ? m : max), data.meals[0])
  const passRate = data.safetyRecords.length > 0
    ? Math.round((data.safetyRecords.filter((r) => r.result === '合格').length / data.safetyRecords.length) * 100)
    : 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1, minHeight: 0 }}>
      <div style={{ display: 'flex', alignItems: 'stretch', gap: 6, justifyContent: 'center', flexShrink: 0 }}>
        <div style={{ flex: 1, textAlign: 'center', background: 'var(--panel-bg)', border: '1px solid var(--border-light)', borderRadius: 6, padding: '6px 8px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, color: 'var(--color-success)', fontFamily: 'monospace', lineHeight: 1.1 }}>{data.todayTotal.toLocaleString()}</div>
          <div style={{ fontSize: 'var(--font-size-2xs)', color: 'var(--text-muted)', marginTop: 2 }}>今日就餐 人次</div>
        </div>
        <div style={{ flex: 1, textAlign: 'center', background: 'var(--panel-bg)', border: '1px solid var(--border-light)', borderRadius: 6, padding: '6px 8px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, color: 'var(--accent)', fontFamily: 'monospace', lineHeight: 1.1 }}>{peakMeal?.name || '--'}</div>
          <div style={{ fontSize: 'var(--font-size-2xs)', color: 'var(--text-muted)', marginTop: 2 }}>高峰 {peakMeal?.value.toLocaleString() || 0} 人</div>
        </div>
        <div style={{ flex: 1, textAlign: 'center', background: 'var(--panel-bg)', border: '1px solid var(--border-light)', borderRadius: 6, padding: '6px 8px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, color: 'var(--color-pending)', fontFamily: 'monospace', lineHeight: 1.1 }}>{passRate}%</div>
          <div style={{ fontSize: 'var(--font-size-2xs)', color: 'var(--text-muted)', marginTop: 2 }}>检查合格率</div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <ChartLabel>各餐次就餐人数</ChartLabel>
        <button
          onClick={() => setShowVideo(true)}
          style={{
            background: 'rgba(var(--accent-rgb), 0.1)', border: '1px solid var(--border-light)',
            borderRadius: 4, color: 'var(--accent)', cursor: 'pointer',
            fontSize: 'var(--font-size-xs)', fontFamily: 'inherit',
            padding: '2px 8px',
          }}
        >
          📹 明厨亮灶
        </button>
      </div>
      <div style={{ flexShrink: 0, height: 130 }}>
        <BarChart data={data.meals} colors={CHART_PALETTE.dark} height={120} showLabel />
      </div>
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <ChartLabel>食品安全检查 ({data.safetyRecords.length} 项)</ChartLabel>
        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', maxHeight: 200 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
            {data.safetyRecords.map(r => (
            <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '3px 6px', fontSize: 'var(--font-size-xs)', border: '1px solid var(--border-light)', borderRadius: 4 }}>
              <span style={{ color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.item}</span>
              <span style={{ color: r.result === '合格' ? 'var(--color-success)' : 'var(--color-warning)', fontWeight: 600, flexShrink: 0, marginLeft: 4 }}>{r.result}</span>
            </div>
          ))}
          </div>
        </div>
      </div>
      {showVideo && <VideoWindow visible={showVideo} title="明厨亮灶 - 食堂后厨" onClose={() => setShowVideo(false)} />}
    </div>
  )
}
