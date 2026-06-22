import { useNewArrivals } from '@/api/queries/library'
import { CHART_PALETTE } from '@/config/chartTheme'
import StatusPanel from '@/components/ui/StatusPanel'
import ChartLabel from '@/components/ui/ChartLabel'

const CATEGORY_COLORS: Record<string, string> = {
  '科技': CHART_PALETTE.semantic.info,
  '文学': CHART_PALETTE.semantic.male,
  '历史': CHART_PALETTE.semantic.warning,
  '教辅': CHART_PALETTE.semantic.success,
  '艺术': CHART_PALETTE.semantic.danger,
  '其他': CHART_PALETTE.semantic.secondary,
}

export default function NewArrivals() {
  const { data, isLoading, error } = useNewArrivals()
  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return <StatusPanel type="empty" />

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1, minHeight: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <span style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, color: 'var(--color-success)', fontFamily: "'Courier New', monospace", lineHeight: 1 }}>{data.weeklyCount}</span>
          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>本周新书 / 册</span>
        </div>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, flexShrink: 0 }}>
        {data.categories.map((c) => (
          <span
            key={c.name}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 3,
              fontSize: 'var(--font-size-2xs)',
              color: 'var(--text-secondary)',
              background: 'var(--panel-bg)',
              border: '1px solid var(--border-light)',
              borderRadius: 3,
              padding: '1px 5px',
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: CATEGORY_COLORS[c.name] || CHART_PALETTE.semantic.info }} />
            {c.name} <b style={{ color: 'var(--text-primary)' }}>{c.value}</b>
          </span>
        ))}
      </div>
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <ChartLabel>新书速递</ChartLabel>
        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 3 }}>
          {data.books.slice(0, 8).map((b) => (
            <div
              key={b.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '4px 6px',
                background: 'var(--panel-bg)',
                border: '1px solid var(--border-light)',
                borderRadius: 4,
              }}
            >
              <span
                style={{
                  fontSize: 'var(--font-size-2xs)',
                  color: CATEGORY_COLORS[b.category] || 'var(--accent)',
                  fontWeight: 600,
                  background: `${CATEGORY_COLORS[b.category] || 'var(--accent)'}22`,
                  padding: '1px 5px',
                  borderRadius: 3,
                  flexShrink: 0,
                }}
              >
                {b.category}
              </span>
              <span style={{ flex: 1, fontSize: 'var(--font-size-xs)', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                《{b.title}》
              </span>
              <span style={{ fontSize: 'var(--font-size-2xs)', color: 'var(--text-muted)', flexShrink: 0 }}>{b.author}</span>
              <span style={{ fontSize: 'var(--font-size-2xs)', color: 'var(--text-tertiary)', minWidth: 32, textAlign: 'right', flexShrink: 0 }}>{b.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
