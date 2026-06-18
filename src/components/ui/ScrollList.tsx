import { useEffect, useRef, useState } from 'react'

interface ScrollItem {
  id: string
  content: React.ReactNode
}

interface ScrollListProps {
  items: ScrollItem[]
  speed?: number
  maxHeight?: number
}

export default function ScrollList({ items, speed = 30, maxHeight = 150 }: ScrollListProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)
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
      ref={containerRef}
      style={{ maxHeight, overflow: 'hidden' }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {items.map((item) => (
        <div key={item.id} style={{ padding: '4px 0', borderBottom: '1px solid var(--border-light)', fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
          {item.content}
        </div>
      ))}
    </div>
  )
}
