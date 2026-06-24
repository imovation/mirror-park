import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import FpsMonitor from '@/components/ui/FpsMonitor'

describe('FpsMonitor', () => {
  it('renders FPS counter in dev mode', () => {
    render(<FpsMonitor />)
    expect(screen.getByText(/FPS/i)).toBeTruthy()
  })
})
