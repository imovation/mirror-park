import { useState, useRef, useEffect } from 'react'
import { useStyleStore } from '@/stores/useStyleStore'

export default function BottomBar() {
  const [playing, setPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [currentTime, setCurrentTime] = useState('--:--')
  const visualStyle = useStyleStore((s) => s.visualStyle)
  const toggleStyle = useStyleStore((s) => s.toggleStyle)

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString('zh-CN', { hour12: false }))
    }, 30000)
    return () => clearInterval(timer)
  }, [])

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
        padding: '0 16px',
        background: 'rgba(0,0,0,0.4)',
        borderTop: '1px solid rgba(74, 158, 255, 0.1)',
        fontSize: '0.7em',
        color: 'rgba(255,255,255,0.3)',
      }}
    >
      <span>智慧校园可视化平台 v0.2.0 | 数据更新: {currentTime}</span>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <button
          onClick={toggleStyle}
          title={`当前：${visualStyle === 'classic' ? '经典红砖' : 'Tron 赛博'}`}
          style={{
            background: visualStyle === 'tron' ? 'rgba(0,229,255,0.1)' : 'rgba(160,82,45,0.1)',
            border: visualStyle === 'tron' ? '1px solid rgba(0,229,255,0.3)' : '1px solid rgba(160,82,45,0.3)',
            borderRadius: 3,
            color: visualStyle === 'tron' ? '#00e5ff' : '#a0522d',
            cursor: 'pointer',
            fontSize: '0.7em',
            padding: '2px 10px',
          }}
        >
          {visualStyle === 'classic' ? '🧱 经典' : '💠 Tron'}
        </button>
        <button
        onClick={toggleMusic}
        title={playing ? '暂停背景音乐' : '播放背景音乐'}
        style={{
          background: playing ? 'rgba(74,158,255,0.15)' : 'transparent',
          border: '1px solid rgba(74,158,255,0.2)',
          borderRadius: 3,
          color: playing ? '#4a9eff' : 'rgba(255,255,255,0.25)',
          cursor: 'pointer',
          fontSize: '0.7em',
          padding: '2px 10px',
          display: 'flex',
          alignItems: 'center',
          gap: 4,
        }}
      >
        {playing ? '🔊 音乐开' : '🔇 音乐关'}
      </button>
      </div>
    </div>
  )
}
