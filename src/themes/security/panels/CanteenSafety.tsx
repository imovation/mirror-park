import { useState } from 'react'
import { useCanteenData } from '@/api/queries/security'
import BarChart from '@/components/charts/BarChart'
import ScrollList from '@/components/ui/ScrollList'
import VideoWindow from '@/components/ui/VideoWindow'
import StatusPanel from '@/components/ui/StatusPanel'
import ChartLabel from '@/components/ui/ChartLabel'

export default function CanteenSafety() {
  const { data, isLoading, error } = useCanteenData()
  const [showVideo, setShowVideo] = useState(false)

  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return <StatusPanel type="empty" />

  const safetyRecords = data.safetyRecords ?? []

  return (
    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <span style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 700, color: '#00c853', fontFamily: "'Courier New', monospace" }}>{data.todayTotal}</span>
          <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)' }}>今日就餐 人次</span>
        </div>
        <button
          onClick={() => setShowVideo(!showVideo)}
          style={{
            padding: '4px 10px',
            background: showVideo ? 'rgba(74,158,255,0.2)' : 'rgba(74,158,255,0.08)',
            border: '1px solid rgba(74,158,255,0.2)',
            borderRadius: 4,
            color: 'var(--accent)',
            fontSize: 'var(--font-size-sm)',
            cursor: 'pointer',
          }}
        >
          📹 {showVideo ? '关闭监控' : '明厨亮灶'}
        </button>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <ChartLabel>各餐次就餐人数</ChartLabel>
        <BarChart data={data.meals} height={120} horizontal={false} barWidth="35%" gridBottom={30} />
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <ChartLabel>食品安全检查</ChartLabel>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
          {safetyRecords.slice(0, 6).map(r => (
            <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 6px', background: 'rgba(74,158,255,0.04)', borderRadius: 4, fontSize: 'var(--font-size-sm)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>{r.item}</span>
              <span style={{ display: 'flex', gap: 6 }}>
                <span style={{ fontSize: 'var(--font-size-2xs)', color: 'var(--text-muted)' }}>{r.date}</span>
                <span style={{ fontSize: 'var(--font-size-xs)', color: r.result === '合格' ? 'var(--color-success)' : 'var(--color-warning)' }}>{r.result}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
      <VideoWindow visible={showVideo} title="食堂后厨实时监控" onClose={() => setShowVideo(false)} />
    </div>
  )
}
