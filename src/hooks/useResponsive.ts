import { useWindowSize } from './useWindowSize'

export function useResponsive() {
  const { width, height } = useWindowSize()
  return {
    isCompact: width < 1366,
    isStandard: width >= 1366 && width < 1920,
    isLarge: width >= 1920 && width < 2560,
    isXLarge: width >= 2560 && width < 3840,
    isUltraWide: width >= 3840,
    isShortHeight: height < 800,
    panelMaxWidth: width < 1366 ? 320 : width < 1920 ? 380 : width < 2560 ? 420 : width < 3840 ? 520 : 600,
    isPortrait: width < height,
  }
}
