export const LAYOUT = {
  LEFT_PANEL_WIDTH: '20%',
  RIGHT_PANEL_WIDTH: '20%',
  TOP_BAR_HEIGHT: '56px',
  BOTTOM_BAR_HEIGHT: '32px',
} as const

export const REFRESH_INTERVALS = {
  REALTIME: 5000,
  NEAR_REALTIME: 5 * 60 * 1000,
  PERIODIC: 60 * 60 * 1000,
} as const

export const SCENE = {
  FOG_COLOR: '#0a1628',
  FOG_NEAR: 50,
  FOG_FAR: 500,
  DEFAULT_CAMERA: {
    position: [0, 80, 40] as [number, number, number],
    target: [0, 0, 0] as [number, number, number],
  },
} as const
