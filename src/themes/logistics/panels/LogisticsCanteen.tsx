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
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1, minHeight: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center', flexShrink: 0 }}>
        <div style={{ fontSize: 'var(--font-size-xxl)', fontWeight: 700, color: 'var(--color-success)' }}>{data.todayTotal}</div>
        <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)' }}>今日就餐 人次</div>
        <button
          onClick={() => setShowVideo(true)}
          style={{
            background: 'rgba(74,158,255,0.1)', border: '1px solid var(--border-light)',
            borderRadius: 4, color: 'var(--accent)', cursor: 'pointer',
            fontSize: 'var(--font-size-sm)', fontFamily: 'inherit',
            padding: '4px 8px', marginLeft: 4,
          }}
        >
          &#x1F4F9; 明厨亮灶
        </button>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <ChartLabel>各餐次就餐人数</ChartLabel>
        <BarChart data={data.meals} height={120} />
      </div>
      <div>
        <ChartLabel>食品安全检查</ChartLabel>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
          {data.safetyRecords.slice(0, 6).map(r => (
            <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 6px', fontSize: 'var(--font-size-xs)', border: '1px solid var(--border-light)', borderRadius: 4 }}>
              <span style={{ color: 'var(--text-primary)' }}>{r.item}</span>
              <span style={{ color: 'var(--color-success)', fontWeight: 500 }}>{r.result}</span>
            </div>
          ))}
        </div>
      </div>
      {showVideo && <VideoWindow visible={showVideo} title="明厨亮灶 - 食堂后厨" onClose={() => setShowVideo(false)} />}
    </div>
  )
}
