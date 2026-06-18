import ScrollList from './ScrollList'

export interface RankItem {
  id: string
  name: string
  value: number
  unit?: string
  color?: string
}

interface RankListProps {
  items: RankItem[]
  maxHeight?: number
}

export default function RankList({ items, maxHeight = 150 }: RankListProps) {
  const maxVal = Math.max(...items.map(i => i.value), 1)

  const listItems = items.map((item, index) => {
    const rank = index + 1
    const badgeBg = rank === 1 ? 'var(--color-danger)' : rank === 2 ? 'var(--color-warning)' : rank === 3 ? 'var(--color-pending)' : 'var(--border)'
    const badgeColor = rank <= 3 ? '#fff' : 'var(--text-secondary)'
    const barColor = item.color || 'var(--accent)'

    return {
      id: item.id,
      content: (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '2px 0' }}>
          <div style={{
            width: 16, height: 16, borderRadius: 3, background: badgeBg, color: badgeColor,
            fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'
          }}>{rank}</div>
          <div style={{ flex: 1, fontSize: 11, color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {item.name}
          </div>
          <div style={{ width: 60, height: 4, background: 'var(--border-light)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ width: `${(item.value / maxVal) * 100}%`, height: '100%', background: barColor, borderRadius: 2 }} />
          </div>
          <div style={{ width: 30, textAlign: 'right', fontSize: 10, color: 'var(--text-primary)' }}>
            {item.value}{item.unit}
          </div>
        </div>
      )
    }
  })

  return <ScrollList items={listItems} maxHeight={maxHeight} />
}
