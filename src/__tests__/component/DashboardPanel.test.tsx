import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import DashboardPanel from '@/components/ui/DashboardPanel'

describe('DashboardPanel', () => {
  it('renders title and children', () => {
    render(
      <DashboardPanel title="Test Panel">
        <span>Content here</span>
      </DashboardPanel>,
    )
    expect(screen.getByText('Test Panel')).toBeDefined()
    expect(screen.getByText('Content here')).toBeDefined()
  })
})
