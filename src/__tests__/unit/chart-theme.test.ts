import { renderHook } from '@testing-library/react'
import { useChartTheme } from '@/config/chartTheme'
import { useUIThemeStore } from '@/stores/useUIThemeStore'
import { useThemeStore } from '@/stores/useThemeStore'
import { THEME_COLORS } from '@/config/themeColors'

describe('useChartTheme', () => {
  beforeEach(() => {
    useUIThemeStore.setState({ uiTheme: 'dark' })
    useThemeStore.setState({ currentTheme: 'overview' as never })
  })

  it('returns dark theme tokens when uiTheme is dark', () => {
    const { result } = renderHook(() => useChartTheme())
    expect(result.current.primary).toBe(THEME_COLORS.overview.primary)
    expect(result.current.axisLabel).toBe('rgba(255,255,255,0.6)')
    expect(result.current.gaugeColors).toHaveLength(5)
    expect(result.current.heatmapGradient).toHaveLength(5)
  })

  it('returns light theme tokens when uiTheme is light', () => {
    useUIThemeStore.setState({ uiTheme: 'light' })
    const { result } = renderHook(() => useChartTheme())
    expect(result.current.primary).toBe(THEME_COLORS.overview.primary)
    expect(result.current.axisLabel).toBe('rgba(0,0,0,0.5)')
  })

  it('derives palette from the current theme primary color', () => {
    useThemeStore.setState({ currentTheme: 'security' as never })
    const { result } = renderHook(() => useChartTheme())
    expect(result.current.primary).toBe(THEME_COLORS.security.primary)
    expect(result.current.colors[0]).toBe(THEME_COLORS.security.primary)
    expect(result.current.colors).toHaveLength(8)
  })

  it('changes palette when theme switches', () => {
    useThemeStore.setState({ currentTheme: 'logistics' as never })
    const { result: a } = renderHook(() => useChartTheme())
    const before = a.current.colors[0]
    useThemeStore.setState({ currentTheme: 'teaching-research' as never })
    const { result: b } = renderHook(() => useChartTheme())
    expect(b.current.colors[0]).not.toBe(before)
    expect(b.current.colors[0]).toBe(THEME_COLORS['teaching-research'].primary)
  })
})
