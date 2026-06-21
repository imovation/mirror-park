import { useState, useEffect, useRef } from 'react'
import { useUIThemeStore } from '@/stores/useUIThemeStore'

interface BottomBarProps {
  status?: 'connecting' | 'connected' | 'disconnected'
}

export default function BottomBar({ status = 'disconnected' }: BottomBarProps) {
  const [currentTime, setCurrentTime] = useState('--:--')
  const [elapsed, setElapsed] = useState('0:00:00')
  const startTimeRef = useRef(Date.now())

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString('zh-CN', { hour12: false }))
    }, 30000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      const diff = Math.floor((Date.now() - startTimeRef.current) / 1000)
      const h = Math.floor(diff / 3600)
      const m = Math.floor((diff % 3600) / 60)
      const s = diff % 60
      setElapsed(`${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const uiTheme = useUIThemeStore((s) => s.uiTheme)

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
        background: 'linear-gradient(180deg, rgba(var(--accent-rgb,74,158,255),0.04) 0%, var(--bottombar-bg) 100%)',
        borderTop: '2px solid rgba(var(--accent-rgb,74,158,255),0.15)',
        fontSize: 'var(--font-size-xs)',
        color: 'var(--text-muted)',
      }}
    >
      <span style={{ textShadow: uiTheme === 'dark' ? '0 1px 2px rgba(0,0,0,0.3)' : 'none' }}>
        智慧校园可视化平台 v0.2.0
        <span style={{ color: 'var(--text-tertiary)', margin: '0 8px' }}>|</span>
        数据更新: {currentTime}
        <span style={{ color: 'var(--text-tertiary)', margin: '0 8px' }}>|</span>
        运行中 {elapsed}
      </span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: currentStatus.color }}>
        <span style={{ fontSize: 'var(--font-size-md)', filter: `drop-shadow(0 0 4px ${currentStatus.color})` }}>{currentStatus.icon}</span>
        <span style={{ fontSize: 'var(--font-size-sm)' }}>{currentStatus.text}</span>
      </div>
    </div>
  )
}
