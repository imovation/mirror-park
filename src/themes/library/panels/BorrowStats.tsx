import { useBorrowStats } from '@/api/queries/library'
import NumberFlip from '@/components/ui/NumberFlip'
import LineChart from '@/components/charts/LineChart'
import StatusPanel from '@/components/ui/StatusPanel'

export default function BorrowStats() {
  const { data, isLoading, error } = useBorrowStats()
  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return <StatusPanel type="empty" />
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1, minHeight: 0, overflow: 'auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <NumberFlip label="今日借阅" value={data.todayBorrow} unit="册" color="#00c853" />
        <NumberFlip label="今日归还" value={data.todayReturn} unit="册" color="#4a9eff" />
        <NumberFlip label="在借图书" value={data.totalBorrowed} unit="册" color="#ffc107" />
        <NumberFlip label="逾期图书" value={data.overdue} unit="册" color="var(--color-warning)" />
      </div>
      <div style={{ flex: 1 }}>
        <LineChart
          xData={data.trend.days}
          series={[
            { name: '借阅', data: data.trend.borrow, color: '#00c853' },
            { name: '归还', data: data.trend.return, color: '#4a9eff' },
          ]}
          height={160}
          area={false}
        />
      </div>
    </div>
  )
}
