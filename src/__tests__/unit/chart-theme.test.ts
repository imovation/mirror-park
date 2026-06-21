import { renderHook } from '@testing-library/react'
import { useChartTheme, CHART_PALETTE } from '@/config/chartTheme'
import { useUIThemeStore } from '@/stores/useUIThemeStore'

describe('useChartTheme', () => {
  beforeEach(() => {
    useUIThemeStore.setState({ uiTheme: 'dark' })
  })

  it('returns dark theme tokens when uiTheme is dark', () => {
    const { result } = renderHook(() => useChartTheme())
    expect(result.current.colors).toEqual(CHART_PALETTE.dark)
    expect(result.current.axisLabel).toBe('rgba(255,255,255,0.6)')
    expect(result.current.gaugeColors).toHaveLength(5)
    expect(result.current.heatmapGradient).toHaveLength(5)
  })

  it('returns light theme tokens when uiTheme is light', () => {
    useUIThemeStore.setState({ uiTheme: 'light' })
    const { result } = renderHook(() => useChartTheme())
    expect(result.current.colors).toEqual(CHART_PALETTE.light)
    expect(result.current.axisLabel).toBe('rgba(0,0,0,0.5)')
  })

  it('palette contains rich distinct colors for categorical data', () => {
    const { result } = renderHook(() => useChartTheme())
    expect(result.current.colors.length).toBeGreaterThanOrEqual(12)
    const unique = new Set(result.current.colors)
    expect(unique.size).toBe(result.current.colors.length)
  })
})
