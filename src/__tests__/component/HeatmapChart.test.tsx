import { renderWithProviders } from '@/__tests__/test-utils'
import HeatmapChart from '@/components/charts/HeatmapChart'

describe('HeatmapChart', () => {
  it('renders chart container with data', () => {
    const { container } = renderWithProviders(
      <HeatmapChart
        xLabels={['A', 'B']}
        yLabels={['X', 'Y']}
        data={[[0, 0, 10], [0, 1, 20], [1, 0, 30], [1, 1, 40]]}
      />,
    )
    expect(container.firstElementChild).not.toBeNull()
  })

  it('handles empty data without crashing', () => {
    const { container } = renderWithProviders(
      <HeatmapChart xLabels={[]} yLabels={[]} data={[]} />,
    )
    expect(container.firstElementChild).not.toBeNull()
  })
})
