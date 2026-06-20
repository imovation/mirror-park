import { renderWithProviders, screen } from '@/__tests__/test-utils'
import SidePanel from '@/components/layout/SidePanel'

describe('SidePanel', () => {
  it('renders children content', () => {
    renderWithProviders(<SidePanel><span>Test Content</span></SidePanel>)
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('renders empty without crashing', () => {
    const { container } = renderWithProviders(<SidePanel><div /></SidePanel>)
    expect(container.firstElementChild).not.toBeNull()
  })
})
