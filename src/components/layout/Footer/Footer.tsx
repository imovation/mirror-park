import { useState, useEffect, useRef } from 'react'
import { useUIThemeStore } from '@/stores/useUIThemeStore'
import FooterNav from './FooterNav'
import FpsMonitor from '@/components/ui/FpsMonitor'

interface FooterProps {
  status?: 'connecting' | 'connected' | 'disconnected'
}

export default function Footer({ status = 'disconnected' }: FooterProps) {
  const isDark = useUIThemeStore((s) => s.uiTheme) === 'dark'
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

  const statusConfig = {
    connected: { icon: '🟢', text: '实时连接正常', color: 'var(--color-success)' },
    connecting: { icon: '🟡', text: '正在连接...', color: 'var(--color-warning)' },
    disconnected: { icon: '🔴', text: '连接已断开', color: 'var(--color-danger)' },
  }
  const currentStatus = statusConfig[status]

  return (
    <div
      style={{
        height: 90,
        background: isDark
          ? 'linear-gradient(0deg, rgba(2,8,23,0.98) 0%, rgba(6,21,46,0.9) 60%, rgba(2,8,23,0) 100%)'
          : 'linear-gradient(0deg, rgba(255,255,255,0.98) 0%, rgba(238,241,245,0.9) 60%, rgba(238,241,245,0) 100%)',
        borderTop: isDark ? '1px solid rgba(var(--theme-primary-rgb),0.08)' : '1px solid rgba(0,0,0,0.06)',
        position: 'relative',
        zIndex: 20,
        display: 'flex',
        flexDirection: 'column',
        padding: '0 24px',
      }}
    >
      {/* ===== NAV CLUSTER ===== */}
      <div className="flex items-center justify-center" style={{ flex: 1, minHeight: 0 }}>
        <div className="relative" style={{ width: 100, height: 40, marginRight: 12 }}>
          <div style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-9px)', width: '100%', height: 1, background: 'linear-gradient(90deg, transparent 0%, rgba(var(--theme-primary-rgb),0.15) 30%, rgba(var(--theme-primary-rgb),0.4) 100%)' }} />
          <div style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(9px)', width: '100%', height: 2, background: 'linear-gradient(90deg, transparent 0%, rgba(var(--theme-primary-rgb),0.25) 30%, rgba(var(--theme-primary-rgb),0.7) 100%)', boxShadow: '0 0 8px rgba(var(--theme-primary-rgb),0.3)' }} />
        </div>
        <FooterNav />
        <div className="relative" style={{ width: 100, height: 40, marginLeft: 12 }}>
          <div style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-9px)', width: '100%', height: 1, background: 'linear-gradient(270deg, transparent 0%, rgba(var(--theme-primary-rgb),0.15) 30%, rgba(var(--theme-primary-rgb),0.4) 100%)' }} />
          <div style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(9px)', width: '100%', height: 2, background: 'linear-gradient(270deg, transparent 0%, rgba(var(--theme-primary-rgb),0.25) 30%, rgba(var(--theme-primary-rgb),0.7) 100%)', boxShadow: '0 0 8px rgba(var(--theme-primary-rgb),0.3)' }} />
        </div>
      </div>

      {/* ===== STATUS BAR ===== */}
      <div
        className="flex items-center justify-between"
        style={{
          height: 26,
          borderTop: isDark ? '1px solid rgba(var(--theme-primary-rgb),0.06)' : '1px solid rgba(0,0,0,0.04)',
          fontSize: 11,
          color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.55)',
        }}
      >
        <span>
          智慧校园可视化平台 v0.2.0
          <span style={{ margin: '0 8px', opacity: 0.3 }}>|</span>
          数据更新: {currentTime}
          <span style={{ margin: '0 8px', opacity: 0.3 }}>|</span>
          运行中 {elapsed}
        </span>
        <div className="flex items-center gap-1.5" style={{ color: currentStatus.color }}>
          <FpsMonitor inline />
          <span style={{ fontSize: 10, filter: `drop-shadow(0 0 3px ${currentStatus.color})` }}>{currentStatus.icon}</span>
          <span>{currentStatus.text}</span>
        </div>
      </div>
    </div>
  )
}
