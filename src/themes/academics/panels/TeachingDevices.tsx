import { useDeviceData } from '@/api/queries/academics'
import RingChart from '@/components/charts/RingChart'
import PieChart from '@/components/charts/PieChart'

export default function TeachingDevices() {
  const { data, isLoading, error } = useDeviceData()
  if (isLoading) return <div style={{ color: '#6b7280', fontSize: '0.75rem' }}>加载中...</div>
  if (error) return <div style={{ color: '#ef4444', fontSize: '0.75rem' }}>数据加载失败</div>
  if (!data) return null
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', gap: 8 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginBottom: 2 }}>设备状态</div>
          <RingChart
            data={[
              { name: '在线', value: data.online },
              { name: '离线', value: data.offline },
              { name: '故障', value: data.faulty },
            ]}
            colors={['#00c853', '#ffc107', '#ff1744']}
            centerLabel={`${data.online}/${data.total}`}
            height={140}
          />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginBottom: 2 }}>设备类型分布</div>
          <PieChart data={data.typeDistribution} height={150} />
        </div>
      </div>
    </div>
  )
}
