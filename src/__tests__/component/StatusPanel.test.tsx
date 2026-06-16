import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import StatusPanel from '@/components/ui/StatusPanel'

describe('StatusPanel', () => {
  it('renders loading state', () => {
    render(<StatusPanel type="loading" />)
    expect(screen.getByText('加载中...')).toBeDefined()
  })

  it('renders error state', () => {
    render(<StatusPanel type="error" />)
    expect(screen.getByText('数据加载失败')).toBeDefined()
  })

  it('renders empty state', () => {
    render(<StatusPanel type="empty" />)
    expect(screen.getByText('暂无数据')).toBeDefined()
  })

  it('renders custom message', () => {
    render(<StatusPanel type="error" message="自定义错误" />)
    expect(screen.getByText('自定义错误')).toBeDefined()
  })
})
