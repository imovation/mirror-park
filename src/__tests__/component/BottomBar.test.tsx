import { renderWithProviders, screen } from '@/__tests__/test-utils'
import Footer from '@/components/layout/Footer/Footer'

describe('Footer', () => {
  it('renders all 7 navigation items', () => {
    renderWithProviders(<Footer />)
    expect(screen.getByText('综合态势')).toBeInTheDocument()
    expect(screen.getByText('教学研究')).toBeInTheDocument()
    expect(screen.getByText('行政办公')).toBeInTheDocument()
    expect(screen.getByText('智慧图书')).toBeInTheDocument()
    expect(screen.getByText('智慧教学')).toBeInTheDocument()
    expect(screen.getByText('智慧安防')).toBeInTheDocument()
    expect(screen.getByText('智慧后勤')).toBeInTheDocument()
  })

  it('renders English labels', () => {
    renderWithProviders(<Footer />)
    expect(screen.getByText('OVERVIEW')).toBeInTheDocument()
    expect(screen.getByText('LIBRARY')).toBeInTheDocument()
    expect(screen.getByText('SECURITY')).toBeInTheDocument()
  })

  it('has overview as the default active module', () => {
    renderWithProviders(<Footer />)
    expect(screen.getByText('OVERVIEW')).toBeInTheDocument()
    expect(screen.getByText('综合态势')).toBeInTheDocument()
  })

  it('displays version and platform name', () => {
    renderWithProviders(<Footer />)
    expect(screen.getByText(/v0\.2\.0/)).toBeInTheDocument()
    expect(screen.getByText(/智慧校园可视化平台/)).toBeInTheDocument()
  })

  it('shows SSE status text', () => {
    renderWithProviders(<Footer status="disconnected" />)
    expect(screen.getByText('连接已断开')).toBeInTheDocument()
  })
})
