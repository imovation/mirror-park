import { renderWithProviders } from '@/__tests__/test-utils'
import TreemapChart from '@/components/charts/TreemapChart'

describe('TreemapChart', () => {
  it('renders chart container with data', () => {
    const { container } = renderWithProviders(
      <TreemapChart data={[{ name: 'A', value: 100 }, { name: 'B', value: 200 }]} />,
    )
    expect(container.firstElementChild).not.toBeNull()
  })

  it('handles empty data without crashing', () => {
    const { container } = renderWithProviders(<TreemapChart data={[]} />)
    expect(container.firstElementChild).not.toBeNull()
  })
})
