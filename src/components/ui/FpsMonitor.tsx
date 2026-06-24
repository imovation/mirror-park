import { useEffect, useRef, useState } from 'react'

const MAX_SAMPLES = 60

function FpsMonitorInner() {
  const [fps, setFps] = useState(0)
  const [min, setMin] = useState(60)
  const [max, setMax] = useState(0)
  const [history, setHistory] = useState<number[]>([])
  const frameCountRef = useRef(0)
  const lastTimeRef = useRef(performance.now())
  const rafRef = useRef<number>(0)

  useEffect(() => {
    let running = true

    const tick = () => {
      if (!running) return
      frameCountRef.current++

      const now = performance.now()
      const elapsed = now - lastTimeRef.current

      if (elapsed >= 1000) {
        const currentFps = Math.round((frameCountRef.current * 1000) / elapsed)
        frameCountRef.current = 0
        lastTimeRef.current = now

        setFps(currentFps)
        setMin((prev) => Math.min(prev, currentFps))
        setMax((prev) => Math.max(prev, currentFps))
        setHistory((prev) => {
          const next = [...prev, currentFps]
          return next.length > MAX_SAMPLES ? next.slice(-MAX_SAMPLES) : next
        })
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)

    return () => {
      running = false
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  const sparklineWidth = 80
  const sparklineHeight = 24
  const maxHist = Math.max(...history, 60)
  const points = history.length > 1
    ? history.map((v, i) => {
        const x = (i / (MAX_SAMPLES - 1)) * sparklineWidth
        const y = sparklineHeight - (v / maxHist) * sparklineHeight
        return `${x},${y}`
      }).join(' ')
    : ''

  const fpsColor = fps >= 55 ? 'var(--color-success, #22c55e)' : fps >= 30 ? 'var(--color-warning, #ff6d00)' : 'var(--color-danger, #ef4444)'

  return (
    <div style={{
      position: 'fixed',
      bottom: 72,
      right: 12,
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '6px 10px',
      background: 'rgba(0,0,0,0.65)',
      borderRadius: 6,
      fontFamily: 'monospace',
      fontSize: 12,
      color: '#fff',
      backdropFilter: 'blur(4px)',
      pointerEvents: 'none',
      userSelect: 'none',
    }}>
      <span style={{ color: 'rgba(255,255,255,0.5)' }}>FPS</span>
      <span style={{ color: fpsColor, fontWeight: 700, fontSize: 14, minWidth: 30, textAlign: 'right' }}>{fps}</span>
      {history.length > 1 && (
        <svg width={sparklineWidth} height={sparklineHeight} style={{ margin: '0 4px' }}>
          <polyline fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth={1} points={points} />
        </svg>
      )}
      <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10 }}>{min}-{max}</span>
    </div>
  )
}

export default function FpsMonitor() {
  if (import.meta.env.DEV) {
    return <FpsMonitorInner />
  }
  return null
}
