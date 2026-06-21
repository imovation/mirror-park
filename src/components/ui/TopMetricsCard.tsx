import MetricIcon, { type IconType } from './MetricIcon'

interface TopMetricsCardProps {
  label: string
  value: string
  unit?: string
  icon?: IconType
  title?: string
}

export default function TopMetricsCard({ label, value, unit, icon, title }: TopMetricsCardProps) {
  return (
    <div
      title={title}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        padding: '5px 12px 5px 10px',
        borderRadius: 6,
        background: 'var(--theme-gradient), var(--panel-bg)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        minWidth: 88,
        cursor: title ? 'help' : 'default',
        overflow: 'hidden',
      }}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 4,
          bottom: 4,
          width: 3,
          background: 'var(--theme-primary)',
          boxShadow: '0 0 6px var(--theme-glow)',
          borderRadius: 2,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          background: 'linear-gradient(90deg, var(--theme-primary), transparent 60%)',
          opacity: 0.7,
        }}
      />
      {icon && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 22,
            height: 22,
            borderRadius: 4,
            background: 'rgba(var(--theme-primary-rgb), 0.12)',
            boxShadow: 'inset 0 0 0 1px rgba(var(--theme-primary-rgb), 0.25)',
            flexShrink: 0,
          }}
        >
          <MetricIcon type={icon} size={14} />
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: 3,
            lineHeight: 1.1,
          }}>
          <span
            style={{
              fontSize: 'var(--font-size-lg)',
              fontWeight: 700,
              color: 'var(--text-primary)',
              textShadow: '0 0 8px var(--theme-glow)',
              fontFamily: 'monospace',
            }}>
            {value}
          </span>
          {unit && (
            <span
              style={{
                fontSize: 'var(--font-size-2xs)',
                color: 'var(--theme-primary)',
                fontWeight: 500,
              }}>
              {unit}
            </span>
          )}
        </div>
        <div
          style={{
            fontSize: 'var(--font-size-2xs)',
            color: 'var(--text-tertiary)',
            marginTop: 2,
            letterSpacing: 0.5,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '100%',
          }}>
          {label}
        </div>
      </div>
    </div>
  )
}
