import { renderWithProviders } from '@/__tests__/test-utils'
import SankeyChart from '@/components/charts/SankeyChart'

describe('SankeyChart', () => {
  it('renders chart container with data', () => {
    const { container } = renderWithProviders(
      <SankeyChart
        data={[{ source: 'A', target: 'B', value: 50 }]}
        categories={['A', 'B']}
      />,
    )
    expect(container.firstElementChild).not.toBeNull()
  })

  it('handles empty data without crashing', () => {
    const { container } = renderWithProviders(
      <SankeyChart data={[]} categories={[]} />,
    )
    expect(container.firstElementChild).not.toBeNull()
  })
})
