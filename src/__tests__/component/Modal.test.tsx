import { renderWithProviders, screen } from '@/__tests__/test-utils'
import Modal from '@/components/ui/Modal'
import userEvent from '@testing-library/user-event'

describe('Modal', () => {
  it('renders content when visible', () => {
    renderWithProviders(
      <Modal visible title="Test Modal" onClose={() => {}}>
        <span>Modal Content</span>
      </Modal>,
    )
    expect(screen.getByText('Test Modal')).toBeInTheDocument()
    expect(screen.getByText('Modal Content')).toBeInTheDocument()
  })

  it('does not render when not visible', () => {
    const { container } = renderWithProviders(
      <Modal visible={false} title="Hidden" onClose={() => {}}>
        <span>Hidden Content</span>
      </Modal>,
    )
    expect(container.textContent).toBe('')
  })
})
