import { useState, useEffect, useRef } from 'react'
import { useThemeStore } from '@/stores/useThemeStore'
import { useStyleStore } from '@/stores/useStyleStore'
import { THEMES } from '@/types/theme'

export default function TopBar() {
  const currentTheme = useThemeStore((s) => s.currentTheme)
  const switchTheme = useThemeStore((s) => s.switchTheme)
  const visualStyle = useStyleStore((s) => s.visualStyle)
  const toggleStyle = useStyleStore((s) => s.toggleStyle)
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
        background: 'linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 100%)',
        borderBottom: '1px solid rgba(74, 158, 255, 0.15)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 20, fontWeight: 'bold', color: '#4a9eff', letterSpacing: 2 }}>
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
              background: currentTheme === t.id ? 'rgba(74,158,255,0.2)' : 'transparent',
              color: currentTheme === t.id ? '#4a9eff' : 'rgba(255,255,255,0.5)',
              fontSize: 13,
              cursor: 'pointer',
              transition: 'all 0.3s',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
        <button
          onClick={toggleStyle}
          style={{
            background: visualStyle === 'tron' ? 'rgba(0,229,255,0.15)' : 'rgba(160,82,45,0.15)',
            border: visualStyle === 'tron' ? '1px solid rgba(0,229,255,0.4)' : '1px solid rgba(160,82,45,0.4)',
            borderRadius: 4,
            color: visualStyle === 'tron' ? '#00e5ff' : '#a0522d',
            cursor: 'pointer',
            fontSize: 12,
            padding: '4px 12px',
            fontWeight: 600,
          }}
        >
          {visualStyle === 'classic' ? '🧱 经典' : '💠 Tron'}
        </button>
        <button
          onClick={toggleMusic}
          style={{
            background: playing ? 'rgba(74,158,255,0.15)' : 'transparent',
            border: '1px solid rgba(74,158,255,0.2)',
            borderRadius: 4,
            color: playing ? '#4a9eff' : 'rgba(255,255,255,0.25)',
            cursor: 'pointer',
            fontSize: 12,
            padding: '4px 8px',
          }}
        >
          {playing ? '🔊' : '🔇'}
        </button>
        <span>{dateStr}</span>
        <span style={{ fontSize: 16, color: '#4a9eff', fontFamily: 'monospace' }}>{timeStr}</span>
      </div>
    </div>
  )
}
