import { renderWithProviders, screen } from '@/__tests__/test-utils'
import AlertPopup from '@/components/ui/AlertPopup'
import { useUIStore } from '@/stores/useUIStore'

describe('AlertPopup', () => {
  beforeEach(() => {
    useUIStore.setState({ alertQueue: [] })
  })

  it('renders nothing when alert queue is empty', () => {
    const { container } = renderWithProviders(<AlertPopup />)
    expect(container.innerHTML).toBe('')
  })

  it('renders alert message when queue has items', () => {
    useUIStore.setState({
      alertQueue: [{ id: '1', type: 'error', message: '测试告警消息', timestamp: new Date() }],
    })
    renderWithProviders(<AlertPopup />)
    expect(screen.getByText(/测试告警消息/)).toBeInTheDocument()
  })

  it('renders all alerts in scrollable container when more than 3', () => {
    useUIStore.setState({
      alertQueue: [
        { id: '1', type: 'error', message: 'Alert 1', timestamp: new Date() },
        { id: '2', type: 'warning', message: 'Alert 2', timestamp: new Date() },
        { id: '3', type: 'info', message: 'Alert 3', timestamp: new Date() },
        { id: '4', type: 'error', message: 'Alert 4', timestamp: new Date() },
      ],
    })
    const { container } = renderWithProviders(<AlertPopup />)
    expect(screen.getByText(/Alert 1/)).toBeInTheDocument()
    expect(screen.getByText(/Alert 2/)).toBeInTheDocument()
    expect(screen.getByText(/Alert 3/)).toBeInTheDocument()
    expect(screen.getByText(/Alert 4/)).toBeInTheDocument()
    const popup = container.querySelector('.panel-scroll')
    expect(popup).not.toBeNull()
  })
})
