import { renderWithProviders, screen } from '@/__tests__/test-utils'
import VideoWindow from '@/components/ui/VideoWindow'

describe('VideoWindow', () => {
  it('renders when visible', () => {
    renderWithProviders(<VideoWindow visible title="食堂监控" onClose={() => {}} />)
    expect(screen.getByText(/食堂监控/)).toBeInTheDocument()
  })

  it('does not render when not visible', () => {
    const { container } = renderWithProviders(
      <VideoWindow visible={false} title="Hidden" onClose={() => {}} />,
    )
    expect(container.textContent).toBe('')
  })
})
