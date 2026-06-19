import { Component, type ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  name: string
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    console.error(`[ErrorBoundary:${this.props.name}]`, error.message, error.stack?.split('\n').slice(0, 5).join('\n'))
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: 'var(--text-muted)',
              fontSize: 11,
              gap: 4,
              padding: 12,
              opacity: 0.7,
            }}
          >
            <span>{this.props.name} 加载异常</span>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              style={{
                padding: '2px 12px',
                border: '1px solid var(--border-strong)',
                borderRadius: 3,
                background: 'rgba(var(--accent-rgb), 0.1)',
                color: 'var(--accent)',
                cursor: 'pointer',
                fontSize: 10,
              }}
            >
              重试
            </button>
          </div>
        )
      )
    }
    return this.props.children
  }
}
