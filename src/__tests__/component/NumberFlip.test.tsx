import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import NumberFlip from '@/components/ui/NumberFlip'

describe('NumberFlip', () => {
  it('renders a number with unit', () => {
    render(<NumberFlip value={12345} unit="人" />)
    expect(screen.getByText('人')).toBeDefined()
  })

  it('renders zero', () => {
    render(<NumberFlip value={0} />)
    expect(screen.getByText('0')).toBeDefined()
  })
})
