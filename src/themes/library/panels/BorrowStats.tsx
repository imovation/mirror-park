import { useBorrowStats } from '@/api/queries/library'
import NumberFlip from '@/components/ui/NumberFlip'
import LineChart from '@/components/charts/LineChart'

export default function BorrowStats() {
  const { data, isLoading, error } = useBorrowStats()
  if (isLoading) return <div style={{ color: '#6b7280', fontSize: '0.75rem' }}>加载中...</div>
  if (error) return <div style={{ color: '#ef4444', fontSize: '0.75rem' }}>数据加载失败</div>
  if (!data) return null
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <NumberFlip label="今日借阅" value={data.todayBorrow} unit="册" color="#00c853" />
        <NumberFlip label="今日归还" value={data.todayReturn} unit="册" color="#4a9eff" />
        <NumberFlip label="在借图书" value={data.totalBorrowed} unit="册" color="#ffc107" />
        <NumberFlip label="逾期图书" value={data.overdue} unit="册" color="#ff6d00" />
      </div>
      <div style={{ flex: 1 }}>
        <LineChart
          xData={data.trend.days}
          series={[
            { name: '借阅', data: data.trend.borrow, color: '#00c853' },
            { name: '归还', data: data.trend.return, color: '#4a9eff' },
          ]}
          height={140}
          area={false}
        />
      </div>
    </div>
  )
}
