import { renderWithProviders, screen } from '@/__tests__/test-utils'
import Header from '@/components/layout/Header/Header'

describe('Header', () => {
  it('renders the platform title', () => {
    renderWithProviders(<Header />)
    expect(screen.getByText('智慧校园可视化系统')).toBeInTheDocument()
  })

  it('renders the English subtitle', () => {
    renderWithProviders(<Header />)
    expect(screen.getByText('SMART CAMPUS VISUALIZATION SYSTEM')).toBeInTheDocument()
  })

  it('renders weather status', () => {
    renderWithProviders(<Header />)
    expect(screen.getByText('多云')).toBeInTheDocument()
    expect(screen.getByText(/°C/)).toBeInTheDocument()
  })

  it('renders air quality indicator', () => {
    renderWithProviders(<Header />)
    expect(screen.getByText('优')).toBeInTheDocument()
  })

  it('renders clock display', () => {
    renderWithProviders(<Header />)
    expect(screen.getByText(/:/)).toBeInTheDocument()
  })
})
