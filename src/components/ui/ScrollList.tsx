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

export default function ScrollList({ items, speed = 2000, maxHeight = 150 }: ScrollListProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)
  const scrollRef = useRef<number>(0)

  useEffect(() => {
    if (isPaused || items.length <= 3) return
    const interval = setInterval(() => {
      if (!containerRef.current) return
      scrollRef.current += 1
      containerRef.current.scrollTop = scrollRef.current
      if (scrollRef.current >= containerRef.current.scrollHeight - containerRef.current.clientHeight) {
        scrollRef.current = 0
      }
    }, 50)
    return () => clearInterval(interval)
  }, [isPaused, items.length])

  return (
    <div
      ref={containerRef}
      style={{ maxHeight, overflow: 'hidden' }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {items.map((item) => (
        <div key={item.id} style={{ padding: '4px 0', borderBottom: '1px solid var(--border-light)', fontSize: 12, color: 'var(--text-secondary)' }}>
          {item.content}
        </div>
      ))}
    </div>
  )
}
