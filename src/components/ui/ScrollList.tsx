import { useEffect, useRef, useState } from 'react'

interface ScrollItem {
  id: string
  content: React.ReactNode
}

interface ScrollListProps {
  items: ScrollItem[]
  speed?: number
  maxHeight?: number
  header?: string
}

export default function ScrollList({ items, speed = 30, maxHeight = 150, header }: ScrollListProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  useEffect(() => {
    if (items.length <= 3) return

    let lastTime = performance.now()
    let scrollPos = 0
    let rafId: number

    const animate = (now: number) => {
      const dt = (now - lastTime) / 1000
      lastTime = now

      if (!isPaused && containerRef.current) {
        scrollPos += speed * dt
        const maxScroll = containerRef.current.scrollHeight - containerRef.current.clientHeight
        if (scrollPos >= maxScroll) scrollPos = 0
        containerRef.current.scrollTop = scrollPos
      }

      rafId = requestAnimationFrame(animate)
    }

    rafId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafId)
  }, [isPaused, speed, items.length])

  return (
    <div
      className="flex flex-col overflow-hidden rounded-md backdrop-blur-sm"
      style={{ background: 'var(--panel-bg)', border: '1px solid var(--border)' }}
    >
      {header && (
        <div
          className="flex items-center px-3 py-2"
          style={{ borderBottom: '1px solid var(--border)' }}
        >
          <div className="w-1 h-3 mr-2" style={{ background: 'var(--accent)' }} />
          <span className="text-sm font-bold" style={{ color: 'var(--accent)' }}>{header}</span>
        </div>
      )}
      <div
        ref={containerRef}
        style={{ maxHeight, overflow: 'auto' }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {items.map((item) => (
          <div
            key={item.id}
            className="px-3 py-1.5 text-sm transition-colors duration-200"
            style={{
              borderBottom: '1px solid var(--border-light)',
              color: 'var(--text-secondary)',
              background: hoveredId === item.id ? 'rgba(var(--accent-rgb), 0.1)' : 'transparent',
            }}
            onMouseEnter={() => setHoveredId(item.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            {item.content}
          </div>
        ))}
      </div>
    </div>
  )
}
