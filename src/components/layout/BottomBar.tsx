import { useState, useEffect } from 'react'

interface BottomBarProps {
  status?: 'connecting' | 'connected' | 'disconnected'
}

export default function BottomBar({ status = 'disconnected' }: BottomBarProps) {
  const [currentTime, setCurrentTime] = useState('--:--')

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString('zh-CN', { hour12: false }))
    }, 30000)
    return () => clearInterval(timer)
  }, [])

  const statusConfig = {
    connected: { icon: '🟢', text: '实时连接正常', color: 'var(--color-success)' },
    connecting: { icon: '🟡', text: '正在连接...', color: 'var(--color-warning)' },
    disconnected: { icon: '🔴', text: '连接已断开', color: 'var(--color-danger)' },
  }
  const currentStatus = statusConfig[status]

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
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: currentStatus.color }}>
        <span style={{ fontSize: '0.9em' }}>{currentStatus.icon}</span>
        <span>{currentStatus.text}</span>
      </div>
    </div>
  )
}
