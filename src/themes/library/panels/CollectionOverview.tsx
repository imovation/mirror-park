import { useCollection } from '@/api/queries/library'
import NumberFlip from '@/components/ui/NumberFlip'
import StatusPanel from '@/components/ui/StatusPanel'

export default function CollectionOverview() {
  const { data, isLoading, error } = useCollection()
  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return <StatusPanel type="empty" />
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, flex: 1, minHeight: 0, overflow: 'auto' }}>
      <NumberFlip label="纸质图书" value={data.paperBooks} unit="册" />
      <NumberFlip label="电子图书" value={data.ebooks} unit="册" />
      <NumberFlip label="期刊种类" value={data.journals} unit="种" />
      <NumberFlip label="报纸种类" value={data.newspapers} unit="种" />
    </div>
  )
}
