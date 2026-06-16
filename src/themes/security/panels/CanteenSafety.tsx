import { useState } from 'react'
import { useCanteenData } from '@/api/queries/security'
import NumberFlip from '@/components/ui/NumberFlip'
import BarChart from '@/components/charts/BarChart'
import ScrollList from '@/components/ui/ScrollList'
import VideoWindow from '@/components/ui/VideoWindow'

export default function CanteenSafety() {
  const { data, isLoading, error } = useCanteenData()
  const [showVideo, setShowVideo] = useState(false)

  if (isLoading) return <div style={{ color: '#6b7280', fontSize: '0.75rem' }}>加载中...</div>
  if (error) return <div style={{ color: '#ef4444', fontSize: '0.75rem' }}>数据加载失败</div>
  if (!data) return null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ textAlign: 'center' }}>
        <NumberFlip label="今日就餐人次" value={data.todayTotal} unit="人次" color="#00c853" />
      </div>
      <div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 2 }}>各餐次就餐人数</div>
        <BarChart data={data.meals} height={100} horizontal={false} />
      </div>
      <button
        onClick={() => setShowVideo(!showVideo)}
        style={{
          padding: '6px 12px',
          background: showVideo ? 'rgba(74,158,255,0.2)' : 'rgba(74,158,255,0.08)',
          border: '1px solid rgba(74,158,255,0.2)',
          borderRadius: 4,
          color: '#4a9eff',
          fontSize: 12,
          cursor: 'pointer',
          width: '100%',
        }}
      >
        📹 {showVideo ? '关闭' : '明厨亮灶 — 查看监控'}
      </button>
      <div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 2 }}>食品安全检查</div>
        <ScrollList items={data.safetyRecords.map(r => ({ id: r.id, content: <div style={{display:'flex',justifyContent:'space-between'}}><span>{r.item}</span><span style={{display:'flex',gap:8}}><span style={{fontSize:10,color:'rgba(255,255,255,0.3)'}}>{r.date}</span><span style={{fontSize:10,color:'#00c853'}}>{r.result}</span></span></div> }))} maxHeight={60} />
      </div>
      <VideoWindow visible={showVideo} title="食堂后厨实时监控" onClose={() => setShowVideo(false)} />
    </div>
  )
}
