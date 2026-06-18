import { useState } from 'react'
import { useCanteenData } from '@/api/queries/security'
import NumberFlip from '@/components/ui/NumberFlip'
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

  return (
    <div style={{ flex: 1, minHeight: 0, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ textAlign: 'center' }}>
        <NumberFlip label="今日就餐人次" value={data.todayTotal} unit="人次" color="#00c853" />
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <ChartLabel>各餐次就餐人数</ChartLabel>
        <BarChart data={data.meals} height={100} horizontal={false} />
      </div>
      <button
        onClick={() => setShowVideo(!showVideo)}
        style={{
          padding: '6px 12px',
          background: showVideo ? 'rgba(74,158,255,0.2)' : 'rgba(74,158,255,0.08)',
          border: '1px solid rgba(74,158,255,0.2)',
          borderRadius: 4,
          color: 'var(--accent)',
          fontSize: 12,
          cursor: 'pointer',
          width: '100%',
        }}
      >
        📹 {showVideo ? '关闭' : '明厨亮灶 — 查看监控'}
      </button>
      <div>
        <ChartLabel>食品安全检查</ChartLabel>
        <ScrollList items={data.safetyRecords.map(r => ({ id: r.id, content: <div style={{display:'flex',justifyContent:'space-between'}}><span>{r.item}</span><span style={{display:'flex',gap:8}}><span style={{fontSize:10,color:'var(--text-muted)'}}>{r.date}</span><span style={{fontSize:10,color:'var(--color-success)'}}>{r.result}</span></span></div> }))} />
      </div>
      <VideoWindow visible={showVideo} title="食堂后厨实时监控" onClose={() => setShowVideo(false)} />
    </div>
  )
}
