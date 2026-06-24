import { describe, it, expect, beforeEach } from 'vitest'
import { useThemeStore } from '@/stores/useThemeStore'
import { useTimeModeStore } from '@/stores/useTimeModeStore'
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

describe('useTimeModeStore', () => {
  beforeEach(() => {
    useTimeModeStore.setState({ timeMode: 'night' })
  })

  it('starts with night mode', () => {
    expect(useTimeModeStore.getState().timeMode).toBe('night')
  })

  it('toggleMode flips night to day', () => {
    useTimeModeStore.getState().toggleMode()
    expect(useTimeModeStore.getState().timeMode).toBe('day')
  })

  it('toggleMode flips day to night', () => {
    useTimeModeStore.setState({ timeMode: 'day' })
    useTimeModeStore.getState().toggleMode()
    expect(useTimeModeStore.getState().timeMode).toBe('night')
  })

  it('setMode sets explicitly', () => {
    useTimeModeStore.getState().setMode('night')
    expect(useTimeModeStore.getState().timeMode).toBe('night')
    useTimeModeStore.getState().setMode('day')
    expect(useTimeModeStore.getState().timeMode).toBe('day')
  })
})
