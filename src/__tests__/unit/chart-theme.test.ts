import { renderHook } from '@testing-library/react'
import { useChartTheme } from '@/config/chartTheme'
import { useUIThemeStore } from '@/stores/useUIThemeStore'

describe('useChartTheme', () => {
  beforeEach(() => {
    useUIThemeStore.setState({ uiTheme: 'dark' })
  })

  it('returns dark theme colors when uiTheme is dark', () => {
    const { result } = renderHook(() => useChartTheme())
    expect(result.current.colors).toContain('#22d3ee')
    expect(result.current.axisLabel).toBe('rgba(255,255,255,0.6)')
    expect(result.current.gaugeColors).toHaveLength(5)
    expect(result.current.heatmapGradient).toHaveLength(5)
  })

  it('returns light theme colors when uiTheme is light', () => {
    useUIThemeStore.setState({ uiTheme: 'light' })
    const { result } = renderHook(() => useChartTheme())
    expect(result.current.colors).toContain('#0284c7')
    expect(result.current.axisLabel).toBe('rgba(0,0,0,0.5)')
  })
})
