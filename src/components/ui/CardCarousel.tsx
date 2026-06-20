import { useState, useEffect, useCallback } from 'react'

interface CardCarouselProps {
  items: { id: string; title: string; subtitle?: string; tag?: string; tagColor?: string }[]
  autoPlay?: boolean
  interval?: number
  maxHeight?: number
}

export default function CardCarousel({ items, autoPlay = true, interval = 4000, maxHeight = 160 }: CardCarouselProps) {
  const [current, setCurrent] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % items.length)
  }, [items.length])

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + items.length) % items.length)
  }, [items.length])

  useEffect(() => {
    if (!autoPlay || isPaused || items.length <= 1) return
    const timer = setInterval(next, interval)
    return () => clearInterval(timer)
  }, [autoPlay, isPaused, interval, next, items.length])

  if (items.length === 0) return <div style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem', textAlign: 'center' }}>暂无数据</div>

  const item = items[current]

  return (
    <div
      style={{ maxHeight, position: 'relative' }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        style={{
          overflow: 'hidden',
          background: 'var(--card-carousel-bg)',
          border: '1px solid var(--card-carousel-border)',
          borderRadius: 8,
          padding: '14px 16px',
          transition: 'all 0.4s',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
          <div style={{ fontSize: 'var(--font-size-md)', fontWeight: 600, color: 'var(--accent)', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title}</div>
          {item.tag && (
            <span style={{
              padding: '2px 8px',
              borderRadius: 3,
              fontSize: 'var(--font-size-xs)',
              background: item.tagColor || 'rgba(var(--accent-rgb), 0.15)',
              color: item.tagColor || 'var(--accent)',
              whiteSpace: 'nowrap',
            }}>
              {item.tag}
            </span>
          )}
        </div>
        {item.subtitle && (
          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.subtitle}</div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 8 }}>
        {items.map((_, i) => (
          <div
            key={i}
            onClick={() => { setCurrent(i); setIsPaused(true) }}
            style={{
              width: i === current ? 18 : 6,
              height: 6,
              borderRadius: 3,
              background: i === current ? 'var(--accent)' : 'var(--card-carousel-dot-inactive)',
              cursor: 'pointer',
              transition: 'all 0.3s',
            }}
          />
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', position: 'absolute', top: '50%', left: -8, right: -8, transform: 'translateY(-50%)', pointerEvents: 'none' }}>
        <button onClick={prev} style={{ pointerEvents: 'auto', background: 'var(--nav-arrow-bg)', border: 'none', color: 'var(--text-primary)', width: 24, height: 24, borderRadius: '50%', cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>‹</button>
        <button onClick={next} style={{ pointerEvents: 'auto', background: 'var(--nav-arrow-bg)', border: 'none', color: 'var(--text-primary)', width: 24, height: 24, borderRadius: '50%', cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>›</button>
      </div>
    </div>
  )
}
