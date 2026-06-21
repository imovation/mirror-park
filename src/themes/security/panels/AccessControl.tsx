import { useAccessData } from '@/api/queries/security'
import NumberFlip from '@/components/ui/NumberFlip'
import BarChart from '@/components/charts/BarChart'
import ScrollList from '@/components/ui/ScrollList'
import StatusPanel from '@/components/ui/StatusPanel'
import ChartLabel from '@/components/ui/ChartLabel'

export default function AccessControl() {
  const { data, isLoading, error } = useAccessData()
  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return <StatusPanel type="empty" />

  const abnormalRecords = data.abnormalRecords ?? []
  const handledCount = abnormalRecords.filter((r) => r.status === '已处理').length
  const handlingCount = abnormalRecords.filter((r) => r.status === '处理中').length
  const handledRate = abnormalRecords.length > 0 ? Math.round((handledCount / abnormalRecords.length) * 100) : 0

  return (
    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexShrink: 0 }}>
        <NumberFlip label="今日通行" value={data.todayTotal} unit="人次" color="var(--color-success)" />
        <NumberFlip label="已处理" value={handledCount} unit="条" color="var(--accent)" />
        <NumberFlip label="处理率" value={handledRate} unit="%" color="var(--color-warning)" />
      </div>
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <ChartLabel>各门禁点通行统计</ChartLabel>
        <div style={{ flex: 1, minHeight: 0 }}>
          <BarChart data={data.points} height={140} />
        </div>
      </div>
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <ChartLabel>异常通行记录 ({abnormalRecords.length}, 处理中 {handlingCount})</ChartLabel>
        <div style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
          <ScrollList
            maxHeight={140}
            items={abnormalRecords.slice(0, 6).map(r => ({
              id: r.id,
              content: (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-sm)' }}>
                  <span>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{r.location}</span>
                    <span style={{ color: 'var(--text-muted)', marginLeft: 6 }}>· {r.type}</span>
                  </span>
                  <span style={{ display: 'flex', gap: 8 }}>
                    <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>{r.time}</span>
                    <span style={{
                      fontSize: 'var(--font-size-xs)',
                      color: r.status === '已处理' ? 'var(--color-success)' : 'var(--color-warning)',
                      fontWeight: 600,
                    }}>{r.status}</span>
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
