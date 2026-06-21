import { useBorrowStats, useCollection } from '@/api/queries/library'
import NumberFlip from '@/components/ui/NumberFlip'
import LineChart from '@/components/charts/LineChart'
import RingChart from '@/components/charts/RingChart'
import StatusPanel from '@/components/ui/StatusPanel'
import ChartLabel from '@/components/ui/ChartLabel'

export default function BorrowStats() {
  const { data, isLoading, error } = useBorrowStats()
  const collection = useCollection()
  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return <StatusPanel type="empty" />

  const borrowTrend = data.trend.borrow
  const returnTrend = data.trend.return
  const peakBorrow = Math.max(...borrowTrend)
  const avgBorrow = Math.round(borrowTrend.reduce((a, b) => a + b, 0) / borrowTrend.length)
  const overdueRate = data.totalBorrowed > 0
    ? Number(((data.overdue / data.totalBorrowed) * 100).toFixed(1))
    : 0
  const trend = data.todayBorrow > data.yesterdayBorrow ? 'up' : data.todayBorrow < data.yesterdayBorrow ? 'down' : 'same'
  const changePercent = data.yesterdayBorrow > 0
    ? Math.abs(Math.round(((data.todayBorrow - data.yesterdayBorrow) / data.yesterdayBorrow) * 100))
    : 0

  const collectionData = collection.data
    ? [
        { name: '纸质书', value: collection.data.paperBooks },
        { name: '电子书', value: collection.data.ebooks },
        { name: '期刊', value: collection.data.journals },
      ]
    : null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1, minHeight: 0 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, flexShrink: 0 }}>
        <NumberFlip
          label="今日借阅"
          value={data.todayBorrow}
          unit="册"
          color="var(--color-success)"
          trend={{ direction: trend, percent: changePercent }}
        />
        <NumberFlip label="今日归还" value={data.todayReturn} unit="册" color="var(--accent)" />
        <NumberFlip label="在借图书" value={data.totalBorrowed} unit="册" color="var(--color-warning)" />
        <NumberFlip label="逾期率" value={overdueRate} unit="%" color="var(--color-danger)" />
      </div>
      <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexShrink: 0 }}>
        <div style={{ textAlign: 'center', padding: '4px 10px', background: 'var(--panel-bg)', border: '1px solid var(--border-light)', borderRadius: 6, flex: 1 }}>
          <div style={{ fontSize: 'var(--font-size-md)', fontWeight: 700, color: 'var(--text-primary)' }}>{peakBorrow}</div>
          <div style={{ fontSize: 'var(--font-size-2xs)', color: 'var(--text-muted)' }}>峰值 (册/日)</div>
        </div>
        <div style={{ textAlign: 'center', padding: '4px 10px', background: 'var(--panel-bg)', border: '1px solid var(--border-light)', borderRadius: 6, flex: 1 }}>
          <div style={{ fontSize: 'var(--font-size-md)', fontWeight: 700, color: 'var(--text-primary)' }}>{avgBorrow}</div>
          <div style={{ fontSize: 'var(--font-size-2xs)', color: 'var(--text-muted)' }}>日均 (册)</div>
        </div>
      </div>
      {collectionData && (
        <div style={{ display: 'flex', gap: 6, flexShrink: 0, alignItems: 'center' }}>
          <div style={{ width: 110, flexShrink: 0 }}>
            <ChartLabel>馆藏构成</ChartLabel>
            <RingChart
              data={collectionData}
              height={110}
              colors={['var(--accent)', 'var(--color-pending)', 'var(--color-success)']}
              centerLabel={String(collectionData.reduce((a, b) => a + b.value, 0).toLocaleString())}
              centerLabelSize={12}
            />
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4, fontSize: 'var(--font-size-xs)' }}>
            {collectionData.map((c, i) => {
              const total = collectionData.reduce((a, b) => a + b.value, 0)
              const pct = total > 0 ? Math.round((c.value / total) * 100) : 0
              const color = ['var(--accent)', 'var(--color-pending)', 'var(--color-success)'][i]
              return (
                <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />
                  <span style={{ color: 'var(--text-secondary)', flex: 1 }}>{c.name}</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{c.value.toLocaleString()}</span>
                  <span style={{ color: 'var(--text-muted)', minWidth: 32, textAlign: 'right' }}>{pct}%</span>
                </div>
              )
            })}
          </div>
        </div>
      )}
      <div style={{ flex: 1, minHeight: 0 }}>
        <ChartLabel>近 14 日借还趋势</ChartLabel>
        <div style={{ flex: 1, minHeight: 0 }}>
          <LineChart
            xData={data.trend.days.slice(-14)}
            series={[
              { name: '借阅', data: borrowTrend.slice(-14), color: 'var(--color-warning)' },
              { name: '归还', data: returnTrend.slice(-14), color: 'var(--accent)' },
            ]}
            height={150}
            area={false}
          />
        </div>
      </div>
    </div>
  )
}
