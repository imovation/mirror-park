import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ScrollList from '@/components/ui/ScrollList'

const items = [
  { id: '1', content: 'Item One' },
  { id: '2', content: 'Item Two' },
  { id: '3', content: 'Item Three' },
  { id: '4', content: 'Item Four' },
  { id: '5', content: 'Item Five' },
]

describe('ScrollList', () => {
  it('renders all item texts', () => {
    render(<ScrollList items={items} />)
    expect(screen.getByText('Item One')).toBeInTheDocument()
    expect(screen.getByText('Item Three')).toBeInTheDocument()
    expect(screen.getByText('Item Five')).toBeInTheDocument()
  })

  it('renders header when provided', () => {
    render(<ScrollList items={items} header="Recent Activity" />)
    expect(screen.getByText('Recent Activity')).toBeInTheDocument()
  })

  it('does not render header when not provided', () => {
    render(<ScrollList items={items} />)
    expect(screen.queryByText('Recent Activity')).not.toBeInTheDocument()
  })
})
