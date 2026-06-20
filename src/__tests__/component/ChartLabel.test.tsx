import { renderWithProviders, screen } from '@/__tests__/test-utils'
import ChartLabel from '@/components/ui/ChartLabel'

describe('ChartLabel', () => {
  it('renders children text', () => {
    renderWithProviders(<ChartLabel>测试标签</ChartLabel>)
    expect(screen.getByText('测试标签')).toBeInTheDocument()
  })

  it('renders with center alignment', () => {
    renderWithProviders(<ChartLabel align="center">居中</ChartLabel>)
    expect(screen.getByText('居中')).toBeInTheDocument()
  })

  it('renders empty without crashing', () => {
    const { container } = renderWithProviders(<ChartLabel>{''}</ChartLabel>)
    expect(container.firstElementChild).not.toBeNull()
  })
})
