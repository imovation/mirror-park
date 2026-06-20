import { renderWithProviders, screen } from '@/__tests__/test-utils'
import BottomBar from '@/components/layout/BottomBar'

describe('BottomBar', () => {
  it('displays version number', () => {
    renderWithProviders(<BottomBar />)
    expect(screen.getByText(/v0\.2\.0/)).toBeInTheDocument()
  })

  it('shows platform title', () => {
    renderWithProviders(<BottomBar />)
    expect(screen.getByText(/智慧校园可视化平台/)).toBeInTheDocument()
  })

  it('shows SSE status text', () => {
    renderWithProviders(<BottomBar status="disconnected" />)
    expect(screen.getByText('连接已断开')).toBeInTheDocument()
  })
})
