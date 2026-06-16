import { describe, it, expect } from 'vitest'
import { formatNumber, formatPercent, formatTime } from '@/utils/format'

describe('formatNumber', () => {
  it('formats numbers with commas', () => {
    expect(formatNumber(12345)).toBe('12,345')
    expect(formatNumber(1000000)).toBe('1,000,000')
  })

  it('handles zero', () => {
    expect(formatNumber(0)).toBe('0')
  })

  it('handles negative numbers', () => {
    expect(formatNumber(-1234)).toBe('-1,234')
  })
})

describe('formatPercent', () => {
  it('formats decimal as percentage', () => {
    expect(formatPercent(0.856)).toBe('85.6%')
    expect(formatPercent(1)).toBe('100.0%')
  })

  it('handles zero', () => {
    expect(formatPercent(0)).toBe('0.0%')
  })
})

describe('formatTime', () => {
  it('formats date to HH:mm', () => {
    const date = new Date('2025-06-16T14:30:00')
    expect(formatTime(date)).toBe('14:30')
  })
})
