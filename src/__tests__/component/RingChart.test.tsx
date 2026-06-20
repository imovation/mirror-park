import { renderWithProviders } from '@/__tests__/test-utils'
import RingChart from '@/components/charts/RingChart'

describe('RingChart', () => {
  it('renders chart container with data', () => {
    const { container } = renderWithProviders(
      <RingChart data={[{ name: 'A', value: 30 }, { name: 'B', value: 70 }]} />,
    )
    expect(container.firstElementChild).not.toBeNull()
  })

  it('handles empty data without crashing', () => {
    const { container } = renderWithProviders(<RingChart data={[]} />)
    expect(container.firstElementChild).not.toBeNull()
  })
})
