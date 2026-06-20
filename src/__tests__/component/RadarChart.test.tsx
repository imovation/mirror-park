import { renderWithProviders } from '@/__tests__/test-utils'
import RadarChart from '@/components/charts/RadarChart'

describe('RadarChart', () => {
  it('renders chart container with data', () => {
    const { container } = renderWithProviders(
      <RadarChart
        indicator={[{ name: 'KPI1', max: 100 }, { name: 'KPI2', max: 100 }]}
        series={[{ name: 'S1', value: [80, 60] }]}
      />,
    )
    expect(container.firstElementChild).not.toBeNull()
  })

  it('handles empty indicator without crashing', () => {
    const { container } = renderWithProviders(
      <RadarChart indicator={[]} series={[]} />,
    )
    expect(container.firstElementChild).not.toBeNull()
  })
})
