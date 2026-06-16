import { useMonitorStatus } from '@/api/queries/security'
import RingChart from '@/components/charts/RingChart'
import BarChart from '@/components/charts/BarChart'
import GaugeChart from '@/components/charts/GaugeChart'

export default function MonitorStatus() {
  const { data, isLoading, error } = useMonitorStatus()
  if (isLoading) return <div style={{ color: '#6b7280', fontSize: '0.75rem' }}>加载中...</div>
  if (error) return <div style={{ color: '#ef4444', fontSize: '0.75rem' }}>数据加载失败</div>
  if (!data) return null
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', gap: 8 }}>
        <div style={{ flex: 1 }}>
          <RingChart
            data={[{ name: '在线', value: data.online }, { name: '离线', value: data.offline }, { name: '故障', value: data.faulty }]}
            colors={['#00c853', '#ffc107', '#ff1744']}
            centerLabel={`${data.online}/${data.total}`}
            height={130}
          />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginBottom: 4 }}>监控覆盖率</div>
          <GaugeChart value={Math.round(data.coverage * 100)} name="覆盖率" height={130} />
        </div>
      </div>
      <div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 2 }}>各区域摄像头分布</div>
        <BarChart data={data.regionDistribution} height={100} />
      </div>
    </div>
  )
}
