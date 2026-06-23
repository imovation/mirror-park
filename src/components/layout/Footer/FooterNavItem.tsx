import type { FC, ComponentType } from 'react'
import type { ThemeId } from '@/types/theme'

interface FooterNavItemProps {
  icon: ComponentType<{ className?: string; style?: React.CSSProperties }>
  labelCn: string
  labelEn: string
  themeId: ThemeId
  isActive: boolean
  onClick: () => void
}

const FooterNavItem: FC<FooterNavItemProps> = ({ icon: Icon, labelCn, labelEn, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-0.5"
      style={{
        width: 100,
        padding: '4px 0 2px',
        border: isActive ? '1px solid rgba(var(--theme-primary-rgb),0.8)' : '1px solid transparent',
        background: isActive ? 'rgba(0,120,255,0.2)' : 'transparent',
        boxShadow: isActive ? '0 0 15px rgba(var(--theme-primary-rgb),0.6), inset 0 0 15px rgba(var(--theme-primary-rgb),0.1)' : 'none',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        fontFamily: 'inherit',
        position: 'relative',
        animation: isActive ? 'footerBreathe 3s ease-in-out infinite' : 'none',
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.transform = 'translateY(-2px)'
          e.currentTarget.style.borderColor = 'rgba(var(--theme-primary-rgb),0.3)'
          e.currentTarget.style.background = 'rgba(var(--theme-primary-rgb),0.06)'
        }
        const bar = e.currentTarget.querySelector('.nav-hover-bar') as HTMLElement
        if (bar) bar.style.opacity = '1'
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.borderColor = 'transparent'
          e.currentTarget.style.background = 'transparent'
        }
        const bar = e.currentTarget.querySelector('.nav-hover-bar') as HTMLElement
        if (bar) bar.style.opacity = '0'
      }}
    >
      {/* Hover bottom light bar indicator */}
      <div
        className="nav-hover-bar absolute bottom-0 left-1/2 -translate-x-1/2"
        style={{
          height: 2,
          background: 'var(--theme-primary)',
          boxShadow: '0 0 8px var(--theme-glow)',
          opacity: 0,
          transition: 'opacity 0.3s ease, width 0.3s ease',
          animation: 'indicatorSlide 0.3s ease-out',
          width: isActive ? '40%' : '0%',
        }}
      />

      <Icon style={{ width: 20, height: 20, color: isActive ? 'var(--theme-primary)' : 'rgba(255,255,255,0.55)' }} />
      <span
        style={{
          fontSize: 14,
          fontWeight: isActive ? 600 : 400,
          color: isActive ? '#ffffff' : 'rgba(255,255,255,0.7)',
          lineHeight: 1.2,
          marginTop: 2,
        }}
      >
        {labelCn}
      </span>
      <span
        style={{
          fontSize: 10,
          fontWeight: 400,
          color: isActive ? 'rgba(var(--theme-primary-rgb),0.8)' : 'rgba(255,255,255,0.3)',
          lineHeight: 1,
          letterSpacing: 1,
        }}
      >
        {labelEn}
      </span>
    </button>
  )
}

export default FooterNavItem
