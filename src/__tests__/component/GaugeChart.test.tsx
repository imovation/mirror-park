import { renderWithProviders } from '@/__tests__/test-utils'
import GaugeChart from '@/components/charts/GaugeChart'

describe('GaugeChart', () => {
  it('renders chart container with value', () => {
    const { container } = renderWithProviders(<GaugeChart value={75} />)
    expect(container.firstElementChild).not.toBeNull()
  })

  it('renders with name and max', () => {
    const { container } = renderWithProviders(
      <GaugeChart value={50} max={200} name="评分" />,
    )
    expect(container.firstElementChild).not.toBeNull()
  })
})
