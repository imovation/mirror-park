import { renderWithProviders, screen } from '@/__tests__/test-utils'
import CardCarousel from '@/components/ui/CardCarousel'

describe('CardCarousel', () => {
  it('renders card items', () => {
    renderWithProviders(
      <CardCarousel items={[
        { id: '1', title: 'Card A', subtitle: 'Desc A' },
        { id: '2', title: 'Card B', subtitle: 'Desc B' },
      ]} />,
    )
    expect(screen.getByText('Card A')).toBeInTheDocument()
  })

  it('shows empty state when no items', () => {
    renderWithProviders(<CardCarousel items={[]} />)
    expect(screen.getByText('暂无数据')).toBeInTheDocument()
  })
})
