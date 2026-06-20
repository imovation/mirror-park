import { render, screen } from '@testing-library/react'
import ErrorBoundary from '@/components/layout/ErrorBoundary'

const ThrowError = () => {
  throw new Error('Test explosion')
}

const NormalChild = () => <div>Everything is fine</div>

describe('ErrorBoundary', () => {
  let consoleSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleSpy.mockRestore()
  })

  it('renders children when no error', () => {
    render(
      <ErrorBoundary name="Test">
        <NormalChild />
      </ErrorBoundary>,
    )
    expect(screen.getByText('Everything is fine')).toBeInTheDocument()
  })

  it('shows fallback UI when child throws', () => {
    render(
      <ErrorBoundary name="Test Panel">
        <ThrowError />
      </ErrorBoundary>,
    )
    expect(screen.getByText('Test Panel 加载异常')).toBeInTheDocument()
    expect(screen.getByText('重试')).toBeInTheDocument()
  })
})
