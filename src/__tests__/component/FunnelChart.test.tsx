import { renderWithProviders } from '@/__tests__/test-utils'
import FunnelChart from '@/components/charts/FunnelChart'

describe('FunnelChart', () => {
  it('renders chart container with data', () => {
    const { container } = renderWithProviders(
      <FunnelChart data={[{ name: 'Step1', value: 100 }, { name: 'Step2', value: 60 }]} />,
    )
    expect(container.firstElementChild).not.toBeNull()
  })

  it('handles empty data without crashing', () => {
    const { container } = renderWithProviders(<FunnelChart data={[]} />)
    expect(container.firstElementChild).not.toBeNull()
  })
})
