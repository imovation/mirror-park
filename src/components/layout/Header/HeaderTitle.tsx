import { useUIThemeStore } from '@/stores/useUIThemeStore'

export default function HeaderTitle() {
  const isDark = useUIThemeStore((s) => s.uiTheme) === 'dark'

  return (
    <div className="relative flex items-center justify-center" style={{ height: '100%' }}>
      {/* ===== Left decorative tech lines ===== */}
      <div className="relative flex-1" style={{ height: 60, maxWidth: 200, minWidth: 60 }}>
        <div
          className="absolute"
          style={{
            top: 6,
            right: 28,
            width: 'calc(100% - 20px)',
            height: 1,
            background: 'linear-gradient(90deg, transparent 0%, rgba(var(--theme-primary-rgb),0.15) 30%, rgba(var(--theme-primary-rgb),0.5) 70%, rgba(var(--theme-primary-rgb),0.7) 100%)',
            animation: 'headerFlow 3s linear infinite',
            backgroundSize: '200% 100%',
          }}
        />
        <div
          className="absolute"
          style={{
            top: 6,
            right: 0,
            width: 28,
            height: 26,
            borderRight: '1px solid rgba(var(--theme-primary-rgb),0.5)',
            borderTop: '1px solid rgba(var(--theme-primary-rgb),0.5)',
            transform: 'skewY(18deg)',
            transformOrigin: 'top right',
          }}
        />
        <div
          className="absolute"
          style={{
            bottom: 6,
            right: 28,
            width: 'calc(100% - 20px)',
            height: 1,
            background: 'linear-gradient(90deg, transparent 0%, rgba(var(--theme-primary-rgb),0.08) 30%, rgba(var(--theme-primary-rgb),0.25) 70%, rgba(var(--theme-primary-rgb),0.4) 100%)',
            backgroundSize: '200% 100%',
            animation: 'headerFlow 3s linear infinite',
            animationDelay: '1.5s',
          }}
        />
        <div
          className="absolute"
          style={{
            bottom: 6,
            right: 0,
            width: 28,
            height: 26,
            borderRight: '1px solid rgba(var(--theme-primary-rgb),0.3)',
            borderBottom: '1px solid rgba(var(--theme-primary-rgb),0.3)',
            transform: 'skewY(-18deg)',
            transformOrigin: 'bottom right',
          }}
        />
      </div>

      {/* ===== Center: Shield / Title ===== */}
      <div
        className="relative flex flex-col items-center justify-center"
        style={{
          padding: '8px 40px 12px',
          minWidth: 360,
          background: isDark
            ? 'linear-gradient(180deg, rgba(6,21,46,0.95) 0%, rgba(8,26,58,0.9) 100%)'
            : 'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(240,244,248,0.9) 100%)',
          border: '1px solid rgba(var(--theme-primary-rgb),0.35)',
          clipPath: 'polygon(24px 0, calc(100% - 24px) 0, 100% 16px, 100% calc(100% - 16px), calc(100% - 24px) 100%, 24px 100%, 0 calc(100% - 16px), 0 16px)',
        }}
      >
        {/* Title text */}
        <h1
          style={{
            fontSize: 26,
            fontWeight: 700,
            letterSpacing: 6,
            color: isDark ? '#ffffff' : '#020817',
            textShadow: isDark
              ? `0 0 20px rgba(var(--theme-primary-rgb),0.5), 0 0 40px rgba(var(--theme-primary-rgb),0.2)`
              : 'none',
            lineHeight: 1.3,
            fontFamily: '"Microsoft YaHei","PingFang SC",sans-serif',
          }}
        >
          智慧校园可视化系统
        </h1>
        <span
          style={{
            fontSize: 11,
            letterSpacing: 4,
            color: isDark ? 'rgba(var(--theme-primary-rgb),0.7)' : 'rgba(0,100,200,0.7)',
            fontWeight: 400,
            marginTop: 2,
          }}
        >
          SMART CAMPUS VISUALIZATION SYSTEM
        </span>

        {/* Bottom glow energy bar — now animated for unified flow */}
        <div
          className="absolute"
          style={{
            bottom: -1,
            left: 24,
            right: 24,
            height: 2,
            background: 'linear-gradient(90deg, transparent 0%, var(--theme-primary) 20%, var(--theme-primary) 80%, transparent 100%)',
            backgroundSize: '200% 100%',
            animation: 'headerFlow 3s linear infinite',
            boxShadow: '0 0 10px var(--theme-primary), 0 0 20px var(--theme-primary), 0 0 30px var(--theme-glow)',
          }}
        />

        {/* Dot matrix */}
        <div
          className="absolute"
          style={{
            bottom: -10,
            left: 0,
            right: 0,
            height: 6,
            backgroundImage: 'radial-gradient(circle, rgba(var(--theme-primary-rgb),0.6) 1px, transparent 1px)',
            backgroundSize: '8px 8px',
            backgroundPosition: 'center center',
            backgroundRepeat: 'repeat-x',
          }}
        />

        {/* Scanline overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.06) 2px, rgba(0,0,0,0.06) 4px)',
            clipPath: 'polygon(24px 0, calc(100% - 24px) 0, 100% 16px, 100% calc(100% - 16px), calc(100% - 24px) 100%, 24px 100%, 0 calc(100% - 16px), 0 16px)',
          }}
        />

        {/* Corner decorations */}
        <div
          className="absolute"
          style={{
            top: 0, left: 0, width: 8, height: 8,
            borderTop: '2px solid rgba(var(--theme-primary-rgb),0.8)',
            borderLeft: '2px solid rgba(var(--theme-primary-rgb),0.8)',
          }}
        />
        <div
          className="absolute"
          style={{
            top: 0, right: 0, width: 8, height: 8,
            borderTop: '2px solid rgba(var(--theme-primary-rgb),0.8)',
            borderRight: '2px solid rgba(var(--theme-primary-rgb),0.8)',
          }}
        />
        <div
          className="absolute"
          style={{
            bottom: 0, left: 0, width: 8, height: 8,
            borderBottom: '2px solid rgba(var(--theme-primary-rgb),0.8)',
            borderLeft: '2px solid rgba(var(--theme-primary-rgb),0.8)',
          }}
        />
        <div
          className="absolute"
          style={{
            bottom: 0, right: 0, width: 8, height: 8,
            borderBottom: '2px solid rgba(var(--theme-primary-rgb),0.8)',
            borderRight: '2px solid rgba(var(--theme-primary-rgb),0.8)',
          }}
        />
      </div>

      {/* ===== Right decorative tech lines — unified 90deg flow ===== */}
      <div className="relative flex-1" style={{ height: 60, maxWidth: 200, minWidth: 60 }}>
        <div
          className="absolute"
          style={{
            top: 6,
            left: 28,
            width: 'calc(100% - 20px)',
            height: 1,
            background: 'linear-gradient(90deg, rgba(var(--theme-primary-rgb),0.7) 0%, rgba(var(--theme-primary-rgb),0.5) 30%, rgba(var(--theme-primary-rgb),0.15) 70%, transparent 100%)',
            animation: 'headerFlow 3s linear infinite',
            backgroundSize: '200% 100%',
          }}
        />
        <div
          className="absolute"
          style={{
            top: 6,
            left: 0,
            width: 28,
            height: 26,
            borderLeft: '1px solid rgba(var(--theme-primary-rgb),0.5)',
            borderTop: '1px solid rgba(var(--theme-primary-rgb),0.5)',
            transform: 'skewY(-18deg)',
            transformOrigin: 'top left',
          }}
        />
        <div
          className="absolute"
          style={{
            bottom: 6,
            left: 28,
            width: 'calc(100% - 20px)',
            height: 1,
            background: 'linear-gradient(90deg, rgba(var(--theme-primary-rgb),0.4) 0%, rgba(var(--theme-primary-rgb),0.25) 30%, rgba(var(--theme-primary-rgb),0.08) 70%, transparent 100%)',
            backgroundSize: '200% 100%',
            animation: 'headerFlow 3s linear infinite',
            animationDelay: '1.5s',
          }}
        />
        <div
          className="absolute"
          style={{
            bottom: 6,
            left: 0,
            width: 28,
            height: 26,
            borderLeft: '1px solid rgba(var(--theme-primary-rgb),0.3)',
            borderBottom: '1px solid rgba(var(--theme-primary-rgb),0.3)',
            transform: 'skewY(18deg)',
            transformOrigin: 'bottom left',
          }}
        />
      </div>
    </div>
  )
}
