import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import DashboardPanel from '@/components/ui/DashboardPanel'

describe('DashboardPanel', () => {
  it('renders title and children', () => {
    render(
      <DashboardPanel title="测试面板">
        <span>内容</span>
      </DashboardPanel>,
    )
    expect(screen.getByText('测试面板')).toBeDefined()
    expect(screen.getByText('内容')).toBeDefined()
  })

  it('renders without title', () => {
    render(
      <DashboardPanel>
        <span>无标题内容</span>
      </DashboardPanel>,
    )
    expect(screen.queryByRole('heading')).toBeNull()
    expect(screen.getByText('无标题内容')).toBeDefined()
  })

  it('accepts className prop', () => {
    render(
      <DashboardPanel title="测试" className="custom-class">
        <span>内容</span>
      </DashboardPanel>,
    )
    const root = screen.getByText('内容').parentElement?.parentElement
    expect(root?.className).toContain('custom-class')
  })
})
