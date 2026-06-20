import { renderWithProviders } from '@/__tests__/test-utils'
import LineChart from '@/components/charts/LineChart'

describe('LineChart', () => {
  it('renders chart container with data', () => {
    const { container } = renderWithProviders(
      <LineChart xData={['Jan', 'Feb']} series={[{ name: 'S1', data: [10, 20] }]} />,
    )
    expect(container.firstElementChild).not.toBeNull()
  })

  it('handles empty data without crashing', () => {
    const { container } = renderWithProviders(
      <LineChart xData={[]} series={[]} />,
    )
    expect(container.firstElementChild).not.toBeNull()
  })
})
