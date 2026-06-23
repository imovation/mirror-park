import { useState, useEffect, useRef } from 'react'
import { useTimeModeStore } from '@/stores/useTimeModeStore'
import { useUIThemeStore } from '@/stores/useUIThemeStore'
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline'
import HeaderTitle from './HeaderTitle'
import HeaderStatus from './HeaderStatus'
import HeaderClock from './HeaderClock'

export default function Header() {
  const timeMode = useTimeModeStore((s) => s.timeMode)
  const toggleMode = useTimeModeStore((s) => s.toggleMode)
  const uiTheme = useUIThemeStore((s) => s.uiTheme)
  const toggleUITheme = useUIThemeStore((s) => s.toggleUITheme)
  const isDark = uiTheme === 'dark'

  const [playing, setPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', handler)
    return () => document.removeEventListener('fullscreenchange', handler)
  }, [])

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      document.documentElement.requestFullscreen()
    }
  }

  const toggleMusic = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio()
      audioRef.current.loop = true
      audioRef.current.volume = 0.3
    }
    if (playing) {
      audioRef.current.pause()
    } else {
      audioRef.current.play().catch(() => {})
    }
    setPlaying(!playing)
  }

  const btnBase: React.CSSProperties = {
    width: 32,
    height: 32,
    border: '1px solid rgba(var(--theme-primary-rgb),0.25)',
    background: 'rgba(var(--theme-primary-rgb),0.08)',
    color: 'var(--theme-primary)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 2,
    transition: 'all 0.3s ease',
    fontFamily: 'inherit',
    fontSize: 14,
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        height: 90,
        padding: '0 24px',
        background: isDark
          ? 'linear-gradient(180deg, rgba(2,8,23,0.98) 0%, rgba(6,21,46,0.9) 60%, rgba(2,8,23,0) 100%)'
          : 'linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(238,241,245,0.9) 60%, rgba(238,241,245,0) 100%)',
        borderBottom: isDark ? '1px solid rgba(var(--theme-primary-rgb),0.08)' : '1px solid rgba(0,0,0,0.06)',
        position: 'relative',
        zIndex: 20,
      }}
    >
      {/* ===== LEFT SECTION ===== */}
      <div className="flex items-center gap-4" style={{ minWidth: 280, flex: '0 0 auto' }}>
        <HeaderStatus />

        <div style={{ width: 1, height: 24, background: 'rgba(var(--theme-primary-rgb),0.15)' }} />

        <div className="flex items-center gap-2">
          {/* Dark/Light toggle */}
          <button
            style={btnBase}
            onClick={toggleUITheme}
            title={isDark ? '切换亮色' : '切换暗色'}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(var(--theme-primary-rgb),0.2)'; e.currentTarget.style.borderColor = 'rgba(var(--theme-primary-rgb),0.6)' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(var(--theme-primary-rgb),0.08)'; e.currentTarget.style.borderColor = 'rgba(var(--theme-primary-rgb),0.25)' }}
          >
            {isDark ? (
              <SunIcon style={{ width: 16, height: 16 }} />
            ) : (
              <MoonIcon style={{ width: 16, height: 16 }} />
            )}
          </button>

          {/* Day/Night toggle */}
          <button
            style={{
              ...btnBase,
              color: timeMode === 'day' ? '#FFB83C' : 'var(--theme-primary)',
              background: 'rgba(var(--theme-primary-rgb),0.08)',
              borderColor: 'rgba(var(--theme-primary-rgb),0.25)',
            }}
            onClick={toggleMode}
            title={timeMode === 'day' ? '切换夜景' : '切换白天'}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(var(--theme-primary-rgb),0.2)'; e.currentTarget.style.borderColor = 'rgba(var(--theme-primary-rgb),0.6)' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(var(--theme-primary-rgb),0.08)'; e.currentTarget.style.borderColor = 'rgba(var(--theme-primary-rgb),0.25)' }}
          >
            <span style={{ fontSize: 16, lineHeight: 1 }}>
              {timeMode === 'day' ? '☀' : '🌙'}
            </span>
          </button>
        </div>
      </div>

      {/* ===== CENTER SECTION ===== */}
      <div className="flex-1 flex items-center justify-center" style={{ minWidth: 0 }}>
        <HeaderTitle />
      </div>

      {/* ===== RIGHT SECTION ===== */}
      <div className="flex items-center gap-4" style={{ minWidth: 280, flex: '0 0 auto', justifyContent: 'flex-end' }}>
        <div className="flex items-center gap-2">
          {/* Music toggle */}
          <button
            style={{
              ...btnBase,
              color: playing ? 'var(--theme-primary)' : 'rgba(255,255,255,0.5)',
              background: playing ? 'rgba(var(--theme-primary-rgb),0.15)' : 'rgba(var(--theme-primary-rgb),0.08)',
              borderColor: playing ? 'rgba(var(--theme-primary-rgb),0.6)' : 'rgba(var(--theme-primary-rgb),0.25)',
            }}
            onClick={toggleMusic}
            title={playing ? '关闭背景音乐' : '开启背景音乐'}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(var(--theme-primary-rgb),0.2)'; e.currentTarget.style.borderColor = 'rgba(var(--theme-primary-rgb),0.6)' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = playing ? 'rgba(var(--theme-primary-rgb),0.15)' : 'rgba(var(--theme-primary-rgb),0.08)'; e.currentTarget.style.borderColor = playing ? 'rgba(var(--theme-primary-rgb),0.6)' : 'rgba(var(--theme-primary-rgb),0.25)' }}
          >
            <span style={{ fontSize: 16, lineHeight: 1 }}>
              {playing ? '🔊' : '🔇'}
            </span>
          </button>

          {/* Fullscreen toggle */}
          <button
            style={{
              ...btnBase,
              color: isFullscreen ? 'var(--theme-primary)' : 'rgba(255,255,255,0.5)',
              background: isFullscreen ? 'rgba(var(--theme-primary-rgb),0.15)' : 'rgba(var(--theme-primary-rgb),0.08)',
              borderColor: isFullscreen ? 'rgba(var(--theme-primary-rgb),0.6)' : 'rgba(var(--theme-primary-rgb),0.25)',
            }}
            onClick={toggleFullscreen}
            title={isFullscreen ? '退出全屏' : '全屏显示'}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(var(--theme-primary-rgb),0.2)'; e.currentTarget.style.borderColor = 'rgba(var(--theme-primary-rgb),0.6)' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = isFullscreen ? 'rgba(var(--theme-primary-rgb),0.15)' : 'rgba(var(--theme-primary-rgb),0.08)'; e.currentTarget.style.borderColor = isFullscreen ? 'rgba(var(--theme-primary-rgb),0.6)' : 'rgba(var(--theme-primary-rgb),0.25)' }}
          >
            <span style={{ fontSize: 16, lineHeight: 1 }}>⛶</span>
          </button>
        </div>

        <div style={{ width: 1, height: 24, background: 'rgba(var(--theme-primary-rgb),0.15)' }} />

        <HeaderClock />
      </div>
    </div>
  )
}
