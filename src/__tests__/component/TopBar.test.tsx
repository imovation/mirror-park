import { renderWithProviders, screen } from '@/__tests__/test-utils'
import TopBar from '@/components/layout/TopBar'

describe('TopBar', () => {
  it('renders the platform title', () => {
    renderWithProviders(<TopBar />)
    expect(screen.getByText('智慧校园可视化平台')).toBeInTheDocument()
  })

  it('renders all 6 topic navigation buttons', () => {
    renderWithProviders(<TopBar />)
    expect(screen.getByText('综合态势')).toBeInTheDocument()
    expect(screen.getByText('教学研究')).toBeInTheDocument()
    expect(screen.getByText('行政办公')).toBeInTheDocument()
    expect(screen.getByText('智慧图书')).toBeInTheDocument()
    expect(screen.getByText('智慧教学')).toBeInTheDocument()
    expect(screen.getByText('智慧安防')).toBeInTheDocument()
  })

  it('renders theme toggle button', () => {
    renderWithProviders(<TopBar />)
    expect(screen.getByText('☀️ 亮色')).toBeInTheDocument()
  })
})
