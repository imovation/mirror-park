import { useState, useEffect } from 'react'

function formatDate(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

const WEEKDAYS = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']

export default function HeaderClock() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const hh = String(time.getHours()).padStart(2, '0')
  const mm = String(time.getMinutes()).padStart(2, '0')
  const ss = String(time.getSeconds()).padStart(2, '0')

  return (
    <div className="flex flex-col items-end" style={{ color: '#ffffff' }}>
      {/* Time — digital clock style */}
      <div className="flex items-center gap-1" style={{ fontFamily: '"Courier New",monospace' }}>
        <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>⏱</span>
        <span style={{ fontSize: 24, fontWeight: 700, letterSpacing: 2, color: '#00D8FF', textShadow: '0 0 10px rgba(0,216,255,0.5)' }}>
          {hh}:{mm}:{ss}
        </span>
      </div>
      {/* Date + weekday */}
      <div className="flex items-center gap-2" style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>
        <span>{formatDate(time)}</span>
        <span style={{ color: 'rgba(0,216,255,0.8)' }}>{WEEKDAYS[time.getDay()]}</span>
      </div>
    </div>
  )
}
