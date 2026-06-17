import { useState, useEffect } from 'react'

export default function BottomBar() {
  const [currentTime, setCurrentTime] = useState('--:--')

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString('zh-CN', { hour12: false }))
    }, 30000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '100%',
        padding: '0 16px',
        background: 'var(--bottombar-bg)',
        borderTop: '1px solid var(--border-light)',
        fontSize: '0.7em',
        color: 'var(--text-muted)',
      }}
    >
      <span>智慧校园可视化平台 v0.2.0 | 数据更新: {currentTime}</span>
    </div>
  )
}
