import { render } from '@/__tests__/test-utils'
import BarChart from '@/components/charts/BarChart'

describe('BarChart', () => {
  it('renders chart container with data', () => {
    const data = [
      { name: 'A', value: 10 },
      { name: 'B', value: 20 },
    ]
    const { container } = render(<BarChart data={data} />)
    const chartDiv = container.querySelector('[data-echarts]') || container.firstElementChild
    expect(chartDiv).not.toBeNull()
  })

  it('handles empty data array', () => {
    const { container } = render(<BarChart data={[]} />)
    const chartDiv = container.querySelector('[data-echarts]') || container.firstElementChild
    expect(chartDiv).not.toBeNull()
  })
})
