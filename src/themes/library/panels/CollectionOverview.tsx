import { useCollection } from '@/api/queries/library'
import NumberFlip from '@/components/ui/NumberFlip'

export default function CollectionOverview() {
  const { data, isLoading, error } = useCollection()
  if (isLoading) return <div style={{ color: '#6b7280', fontSize: '0.75rem' }}>加载中...</div>
  if (error) return <div style={{ color: '#ef4444', fontSize: '0.75rem' }}>数据加载失败</div>
  if (!data) return null
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
      <NumberFlip label="纸质图书" value={data.paperBooks} unit="册" />
      <NumberFlip label="电子图书" value={data.ebooks} unit="册" />
      <NumberFlip label="期刊种类" value={data.journals} unit="种" />
      <NumberFlip label="报纸种类" value={data.newspapers} unit="种" />
    </div>
  )
}
