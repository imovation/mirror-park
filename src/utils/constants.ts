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
  THEME_CAMERAS: {
    overview: { position: [25, 50, 50] as [number, number, number], target: [0, 2, -5] as [number, number, number] },
    'teaching-research': { position: [-10, 25, 20] as [number, number, number], target: [-10, 5, 4] as [number, number, number] },
    admin: { position: [-15, 20, 15] as [number, number, number], target: [-5, 5, -8] as [number, number, number] },
    library: { position: [-5, 15, 2] as [number, number, number], target: [-10, 4, -10] as [number, number, number] },
    academics: { position: [-6, 15, 25] as [number, number, number], target: [-6, 8, 4] as [number, number, number] },
    security: { position: [-40, 22, -15] as [number, number, number], target: [-12, 4, -3] as [number, number, number] },
  } as Record<string, { position: [number, number, number]; target: [number, number, number] }>,
} as const
