import { CloudIcon } from '@heroicons/react/24/outline'

export default function HeaderStatus() {
  return (
    <div className="flex items-center gap-3" style={{ color: '#ffffff' }}>
      {/* Weather */}
      <div className="flex items-center gap-1.5">
        <CloudIcon style={{ width: 20, height: 20, color: 'var(--theme-primary)' }} />
        <span style={{ fontSize: 14, fontWeight: 500 }}>多云</span>
        <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--theme-primary)' }}>26°C</span>
      </div>

      {/* Divider */}
      <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.15)' }} />

      {/* Air Quality */}
      <div className="flex items-center gap-1.5">
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: '#34D399',
            boxShadow: '0 0 6px rgba(52,211,153,0.8)',
            animation: 'breatheDot 2s ease-in-out infinite',
          }}
        />
        <span style={{ fontSize: 14, fontWeight: 500 }}>优</span>
        <span style={{ fontSize: 16, fontWeight: 600, color: '#34D399' }}>35</span>
      </div>
    </div>
  )
}
