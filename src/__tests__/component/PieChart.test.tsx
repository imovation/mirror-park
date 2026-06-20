import { render } from '@/__tests__/test-utils'
import PieChart from '@/components/charts/PieChart'

describe('PieChart', () => {
  it('renders chart container with data', () => {
    const data = [
      { name: 'Foo', value: 30 },
      { name: 'Bar', value: 70 },
    ]
    const { container } = render(<PieChart data={data} />)
    const chartDiv = container.querySelector('[data-echarts]') || container.firstElementChild
    expect(chartDiv).not.toBeNull()
  })

  it('handles empty data array', () => {
    const { container } = render(<PieChart data={[]} />)
    const chartDiv = container.querySelector('[data-echarts]') || container.firstElementChild
    expect(chartDiv).not.toBeNull()
  })
})
