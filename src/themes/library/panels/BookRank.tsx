import { useHotBooks, useClassRank } from '@/api/queries/library'
import BarChart from '@/components/charts/BarChart'
import StatusPanel from '@/components/ui/StatusPanel'
import ChartLabel from '@/components/ui/ChartLabel'
import { HUE_ROTATION } from '@/config/chartTheme'

export default function BookRank() {
  const hotQuery = useHotBooks()
  const rankQuery = useClassRank()

  if (hotQuery.isLoading || rankQuery.isLoading) return <StatusPanel type="loading" />
  if (hotQuery.error || rankQuery.error) return <StatusPanel type="error" />
  if (!hotQuery.data || !rankQuery.data) return <StatusPanel type="empty" />

  const hot = hotQuery.data
  const rank = rankQuery.data

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, flex: 1, minHeight: 0 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minHeight: 0, overflow: 'hidden' }}>
        <ChartLabel align="center">借阅量 TOP10</ChartLabel>
        <div style={{ flex: 1, minHeight: 0 }}>
          <BarChart
            data={hot.top10.slice(0, 8).map(b => ({ name: b.name, value: b.count }))}
            colors={HUE_ROTATION.r3}
            height={200}
            gridLeft={65}
            tooltip={false}
            barWidth="50%"
          />
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minHeight: 0, overflow: 'hidden' }}>
        <ChartLabel align="center">班级借阅量排行</ChartLabel>
        <div style={{ flex: 1, minHeight: 0 }}>
          <BarChart
            data={rank.classRank.slice(0, 8)}
            colors={rank.classRank.slice(0, 8).map((_, i) => HUE_ROTATION.r3[i % 3])}
            height={200}
            gridLeft="20%"
            tooltip={false}
            barWidth="50%"
          />
        </div>
      </div>
    </div>
  )
}
