import { useState, useEffect, useRef } from 'react'
import { useThemeStore } from '@/stores/useThemeStore'
import { useTimeModeStore } from '@/stores/useTimeModeStore'
import { useUIThemeStore } from '@/stores/useUIThemeStore'
import { THEMES } from '@/types/theme'

export default function TopBar() {
  const currentTheme = useThemeStore((s) => s.currentTheme)
  const switchTheme = useThemeStore((s) => s.switchTheme)
  const timeMode = useTimeModeStore((s) => s.timeMode)
  const toggleMode = useTimeModeStore((s) => s.toggleMode)
  const uiTheme = useUIThemeStore((s) => s.uiTheme)
  const toggleUITheme = useUIThemeStore((s) => s.toggleUITheme)
  const [time, setTime] = useState(new Date())
  const [playing, setPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const timeStr = time.toLocaleTimeString('zh-CN', { hour12: false })
  const dateStr = time.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
  })

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

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '100%',
        padding: '0 24px',
        background: 'var(--topbar-bg)',
        borderBottom: '1px solid var(--border-light)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'bold', color: 'var(--accent)', letterSpacing: 2 }}>
          智慧校园可视化平台
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {THEMES.map((t) => (
          <button
            key={t.id}
            onClick={() => switchTheme(t.id)}
            style={{
              padding: '6px 16px',
              border: 'none',
              borderRadius: 4,
              background: currentTheme === t.id ? 'rgba(var(--theme-primary-rgb), 0.2)' : 'transparent',
              color: currentTheme === t.id ? 'var(--theme-primary)' : 'var(--text-tertiary)',
              fontSize: 'var(--font-size-md)',
              fontFamily: 'inherit',
              cursor: 'pointer',
              transition: 'all 0.3s',
              position: 'relative',
            }}
          >
            {currentTheme === t.id && (
              <span
                style={{
                  position: 'absolute',
                  bottom: -2,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '60%',
                  height: 2,
                  background: 'var(--theme-primary)',
                  boxShadow: '0 0 8px var(--theme-glow)',
                  borderRadius: 1,
                }}
              />
            )}
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 'var(--font-size-md)', color: 'var(--text-tertiary)' }}>
        <button
          onClick={toggleUITheme}
          style={{
            background: uiTheme === 'light' ? 'rgba(var(--accent-rgb), 0.15)' : 'transparent',
            border: '1px solid var(--border-light)',
            borderRadius: 4,
            color: 'var(--accent)',
            cursor: 'pointer',
            transition: 'var(--transition-fast)',
            fontSize: 'var(--font-size-sm)',
            fontFamily: 'inherit',
            padding: '4px 10px',
            fontWeight: 600,
          }}
        >
          {uiTheme === 'dark' ? '☀️ 亮色' : '🌙 暗色'}
        </button>
        <button
          onClick={toggleMode}
          style={{
            background: timeMode === 'night' ? 'rgba(0,229,255,0.15)' : 'rgba(255,180,60,0.15)',
            border: timeMode === 'night' ? '1px solid rgba(0,229,255,0.4)' : '1px solid rgba(255,180,60,0.4)',
            borderRadius: 4,
            color: timeMode === 'night' ? '#00e5ff' : '#ffb83c',
            cursor: 'pointer',
            transition: 'var(--transition-fast)',
            fontSize: 'var(--font-size-sm)',
            fontFamily: 'inherit',
            padding: '4px 10px',
            fontWeight: 600,
          }}
        >
          {timeMode === 'day' ? '☀️ 白天' : '🌙 夜间'}
        </button>
        <button
          onClick={toggleMusic}
          style={{
            background: playing ? 'rgba(var(--accent-rgb), 0.15)' : 'transparent',
            border: '1px solid var(--border-light)',
            borderRadius: 4,
            color: playing ? 'var(--accent)' : 'var(--text-muted)',
            cursor: 'pointer',
            transition: 'var(--transition-fast)',
            fontSize: 'var(--font-size-sm)',
            fontFamily: 'inherit',
            padding: '4px 10px',
          }}
        >
          {playing ? '🔊' : '🔇'}
        </button>
        <span style={{ fontSize: 'var(--font-size-sm)' }}>{dateStr}</span>
        <span style={{ fontSize: 'var(--font-size-xl)', color: 'var(--accent)', fontFamily: 'monospace', fontWeight: 600, letterSpacing: 1 }}>{timeStr}</span>
      </div>
    </div>
  )
}
