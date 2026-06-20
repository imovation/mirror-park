import { renderWithProviders, screen } from '@/__tests__/test-utils'
import ScreenLayout from '@/components/layout/ScreenLayout'

describe('ScreenLayout', () => {
  it('renders all layout slots', () => {
    renderWithProviders(
      <ScreenLayout
        topBar={<span>Top</span>}
        topMetrics={<span>Metrics</span>}
        leftPanel={<span>Left</span>}
        rightPanel={<span>Right</span>}
        bottomBar={<span>Bottom</span>}
      />,
    )
    expect(screen.getByText('Top')).toBeInTheDocument()
    expect(screen.getByText('Metrics')).toBeInTheDocument()
    expect(screen.getByText('Left')).toBeInTheDocument()
    expect(screen.getByText('Right')).toBeInTheDocument()
    expect(screen.getByText('Bottom')).toBeInTheDocument()
  })

  it('renders without topMetrics', () => {
    renderWithProviders(
      <ScreenLayout
        topBar={<span>Top</span>}
        leftPanel={<span>Left</span>}
        rightPanel={<span>Right</span>}
        bottomBar={<span>Bottom</span>}
      />,
    )
    expect(screen.getByText('Top')).toBeInTheDocument()
    expect(screen.getByText('Left')).toBeInTheDocument()
    expect(screen.getByText('Right')).toBeInTheDocument()
    expect(screen.getByText('Bottom')).toBeInTheDocument()
  })
})
