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
    console.error(`[ErrorBoundary:${this.props.name}]`, error, info)
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
              color: 'rgba(255,255,255,0.4)',
              fontSize: 13,
              gap: 8,
            }}
          >
            <span style={{ color: '#ff6d00', fontSize: 24 }}>⚠</span>
            <span>{this.props.name} 加载异常</span>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              style={{
                padding: '4px 16px',
                border: '1px solid rgba(74,158,255,0.3)',
                borderRadius: 4,
                background: 'transparent',
                color: '#4a9eff',
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
