import { useEffect } from 'react'
import { CHART_PALETTE, HUE_ROTATION } from '@/config/chartTheme'
import { useAlertData } from '@/api/queries/security'
import { useUIStore } from '@/stores/useUIStore'
import NumberFlip from '@/components/ui/NumberFlip'
import RingChart from '@/components/charts/RingChart'
import ScrollList from '@/components/ui/ScrollList'
import StatusPanel from '@/components/ui/StatusPanel'
import ChartLabel from '@/components/ui/ChartLabel'

export default function AlertEvents() {
  const { data, isLoading, error } = useAlertData()
  const addAlert = useUIStore((s) => s.addAlert)

  useEffect(() => {
    const alerts: { type: 'warning' | 'error' | 'info'; message: string }[] = [
      { type: 'error', message: '南门异常通行记录' },
      { type: 'warning', message: '体育馆区域设备离线' },
      { type: 'error', message: '教学楼A区火警预警' },
      { type: 'error', message: '北围墙周界入侵告警' },
      { type: 'warning', message: '宿舍楼门禁异常' },
    ]
    addAlert(alerts[Math.floor(Math.random() * alerts.length)])
    const timer = setInterval(() => {
      addAlert(alerts[Math.floor(Math.random() * alerts.length)])
    }, 15000)
    return () => clearInterval(timer)
  }, [addAlert])

  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return <StatusPanel type="empty" />

  const handled = Math.round(data.handledRatio * 100)
  const unhandled = 100 - handled
  const topType = data.typeDistribution[0]

  return (
    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 }}>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <NumberFlip label="今日告警" value={data.todayTotal} unit="次" color="var(--color-danger)" />
          {data.yesterdayTotal > 0 && (
            <div style={{ fontSize: 'var(--font-size-2xs)', color: data.todayTotal > data.yesterdayTotal ? 'var(--color-warning)' : 'var(--color-success)', marginTop: 1 }}>
              {data.todayTotal > data.yesterdayTotal ? '↑' : '↓'} {Math.abs(data.todayTotal - data.yesterdayTotal)} 较昨日
            </div>
          )}
        </div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <RingChart
            data={[
              { name: '已处理', value: handled },
              { name: '未处理', value: unhandled },
            ]}
            colors={[CHART_PALETTE.semantic.success, CHART_PALETTE.semantic.danger]}
            centerLabel={`${handled}%`}
            centerLabelSize={16}
            height={100}
          />
        </div>
      </div>
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', flexShrink: 0 }}>
        {data.typeDistribution.map((t, i) => {
          const total = data.typeDistribution.reduce((a, b) => a + b.value, 0)
          const pct = total > 0 ? Math.round((t.value / total) * 100) : 0
          return (
            <span
              key={t.name}
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
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: HUE_ROTATION.r3[i % 3] }} />
              {t.name} <b style={{ color: 'var(--text-primary)' }}>{t.value}</b> · {pct}%
            </span>
          )
        })}
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <ChartLabel>告警事件列表</ChartLabel>
        <div style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
          <ScrollList
            items={data.records.map(r => ({
              id: r.id,
              content: (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {r.type} · {r.location}
                  </span>
                  <span style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
                    <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>{r.time}</span>
                    <span
                      style={{
                        fontSize: 'var(--font-size-2xs)',
                        color: r.status === '已处理' ? 'var(--color-success)' : r.status === '处理中' ? 'var(--accent)' : 'var(--color-danger)',
                        fontWeight: 600,
                      }}
                    >
                      {r.status}
                    </span>
                  </span>
                </div>
              ),
            }))}
          />
        </div>
      </div>
    </div>
  )
}
