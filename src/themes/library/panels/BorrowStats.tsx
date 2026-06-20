import { useBorrowStats, useCollection } from '@/api/queries/library'
import NumberFlip from '@/components/ui/NumberFlip'
import LineChart from '@/components/charts/LineChart'
import StatusPanel from '@/components/ui/StatusPanel'

export default function BorrowStats() {
  const { data, isLoading, error } = useBorrowStats()
  const collection = useCollection()
  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return <StatusPanel type="empty" />
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1, minHeight: 0 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, flexShrink: 0 }}>
        <NumberFlip label="今日借阅" value={data.todayBorrow} unit="册" color="var(--color-success)"
          trend={{ direction: data.todayBorrow > data.yesterdayBorrow ? 'up' : data.todayBorrow < data.yesterdayBorrow ? 'down' : 'same', percent: Math.abs(Math.round((data.todayBorrow - data.yesterdayBorrow) / data.yesterdayBorrow * 100)) }}
        />
        <NumberFlip label="今日归还" value={data.todayReturn} unit="册" color="var(--accent)" />
        <NumberFlip label="在借图书" value={data.totalBorrowed} unit="册" color="var(--color-warning)" />
        <NumberFlip label="逾期图书" value={data.overdue} unit="册" color="var(--color-warning)" />
      </div>
      {collection.data && (
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexShrink: 0, fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
          <span>馆藏 <b style={{ color: 'var(--text-primary)' }}>{collection.data.paperBooks.toLocaleString()}</b> 册纸质书</span>
          <span style={{ color: 'var(--border-light)' }}>|</span>
          <span>电子书 <b style={{ color: 'var(--text-primary)' }}>{collection.data.ebooks.toLocaleString()}</b> 册</span>
          <span style={{ color: 'var(--border-light)' }}>|</span>
          <span>期刊 <b style={{ color: 'var(--text-primary)' }}>{collection.data.journals}</b> 种</span>
        </div>
      )}
      <div style={{ flex: 1 }}>
        <LineChart
          xData={data.trend.days}
          series={[
            { name: '借阅', data: data.trend.borrow, color: '#00c853' },
            { name: '归还', data: data.trend.return, color: '#4a9eff' },
          ]}
          height={200}
          area={false}
        />
      </div>
    </div>
  )
}
