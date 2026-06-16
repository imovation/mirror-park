import { describe, it, expect, beforeEach } from 'vitest'
import { useThemeStore } from '@/stores/useThemeStore'
import { ThemeId } from '@/types/theme'

describe('useThemeStore', () => {
  beforeEach(() => {
    useThemeStore.setState({ currentTheme: ThemeId.OVERVIEW, isTransitioning: false })
  })

  it('starts with overview theme', () => {
    expect(useThemeStore.getState().currentTheme).toBe(ThemeId.OVERVIEW)
  })

  it('switches theme', () => {
    useThemeStore.getState().switchTheme(ThemeId.LIBRARY)
    expect(useThemeStore.getState().currentTheme).toBe(ThemeId.LIBRARY)
  })

  it('sets transitioning flag during switch', () => {
    useThemeStore.getState().switchTheme(ThemeId.SECURITY)
    expect(useThemeStore.getState().isTransitioning).toBe(true)
  })
})
