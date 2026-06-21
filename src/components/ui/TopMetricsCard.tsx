import MetricIcon, { type IconType } from './MetricIcon'

interface TopMetricsCardProps {
  label: string
  value: string
  unit?: string
  icon?: IconType
  valueColor?: string
  title?: string
}

export default function TopMetricsCard({ label, value, unit, icon, valueColor, title }: TopMetricsCardProps) {
  const finalValueColor = valueColor || 'var(--text-primary)'
  return (
    <div
      title={title}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        padding: '6px 14px 6px 12px',
        borderRadius: 6,
        background: 'var(--theme-gradient), var(--panel-bg)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        minWidth: 96,
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
          background: valueColor || 'var(--theme-primary)',
          boxShadow: `0 0 6px ${valueColor || 'var(--theme-glow)'}`,
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
          background: `linear-gradient(90deg, ${valueColor || 'var(--theme-primary)'}, transparent 60%)`,
          opacity: 0.7,
        }}
      />
      {icon && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 26,
            height: 26,
            borderRadius: 5,
            background: 'rgba(255,255,255,0.04)',
            boxShadow: `inset 0 0 0 1px ${valueColor ? `${valueColor}55` : 'rgba(var(--theme-primary-rgb), 0.25)'}`,
            flexShrink: 0,
          }}
        >
          <MetricIcon type={icon} size={15} color={valueColor || 'var(--theme-primary)'} />
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
              fontSize: 'var(--font-size-xl)',
              fontWeight: 700,
              color: finalValueColor,
              textShadow: `0 0 8px ${valueColor ? `${valueColor}66` : 'var(--theme-glow)'}`,
              fontFamily: 'monospace',
            }}>
            {value}
          </span>
          {unit && (
            <span
              style={{
                fontSize: 'var(--font-size-2xs)',
                color: 'var(--text-tertiary)',
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
            marginTop: 3,
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
