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
              color: 'var(--text-tertiary)',
              fontSize: 13,
              gap: 8,
              padding: 20,
            }}
          >
            <span style={{ color: 'var(--color-warning)', fontSize: 24 }}>⚠</span>
            <span>{this.props.name} 加载异常</span>
            <span style={{ fontSize: 10, color: 'var(--text-muted)', maxWidth: 300, textAlign: 'center', wordBreak: 'break-all' }}>
              {this.state.error?.message}
            </span>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              style={{
                padding: '4px 16px',
                border: '1px solid var(--border-strong)',
                borderRadius: 4,
                background: 'transparent',
                color: 'var(--accent)',
                cursor: 'pointer',
                fontSize: 12,
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
