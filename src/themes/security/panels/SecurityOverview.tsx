import { CHART_PALETTE } from '@/config/chartTheme'
import { useAlertData, useMonitorStatus } from '@/api/queries/security'
import NumberFlip from '@/components/ui/NumberFlip'
import LineChart from '@/components/charts/LineChart'
import StatusPanel from '@/components/ui/StatusPanel'
import ChartLabel from '@/components/ui/ChartLabel'

export default function SecurityOverview() {
  const alertQuery = useAlertData()
  const monitorQuery = useMonitorStatus()

  if (alertQuery.isLoading || monitorQuery.isLoading) return <StatusPanel type="loading" />
  if (alertQuery.error || monitorQuery.error) return <StatusPanel type="error" />
  if (!alertQuery.data || !monitorQuery.data) return <StatusPanel type="empty" />

  const handled = Math.round(alertQuery.data.handledRatio * alertQuery.data.todayTotal)
  const unhandled = alertQuery.data.todayTotal - handled
  const onlineRate = Math.round((monitorQuery.data.online / monitorQuery.data.total) * 100)

  const trendDays = ['15日', '16日', '17日', '18日', '19日', '20日', '今日']
  const trendValues = [5, 7, 3, 6, 4, 8, alertQuery.data.todayTotal]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1, minHeight: 0 }}>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexShrink: 0 }}>
        <NumberFlip label="已处理" value={handled} unit="件" color={CHART_PALETTE.semantic.success} />
        <NumberFlip label="待处理" value={unhandled} unit="件" color={CHART_PALETTE.semantic.danger} />
        <NumberFlip label="设备在线率" value={onlineRate} unit="%" color={CHART_PALETTE.semantic.info} />
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <ChartLabel align="center">近 7 日告警趋势</ChartLabel>
        <LineChart
          xData={trendDays}
          series={[{ name: '告警数', data: trendValues, color: CHART_PALETTE.semantic.danger }]}
          height={180}
          smooth
          area
        />
      </div>
    </div>
  )
}
