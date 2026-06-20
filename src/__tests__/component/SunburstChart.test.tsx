import { renderWithProviders } from '@/__tests__/test-utils'
import SunburstChart from '@/components/charts/SunburstChart'

describe('SunburstChart', () => {
  it('renders chart container with data', () => {
    const { container } = renderWithProviders(
      <SunburstChart
        data={[{ name: 'A', value: 100, children: [{ name: 'A1', value: 50 }] }]}
      />,
    )
    expect(container.firstElementChild).not.toBeNull()
  })

  it('handles empty data without crashing', () => {
    const { container } = renderWithProviders(<SunburstChart data={[]} />)
    expect(container.firstElementChild).not.toBeNull()
  })
})
