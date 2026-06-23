export const REFRESH_INTERVALS = {
  REALTIME: 5000,
  NEAR_REALTIME: 5 * 60 * 1000,
  PERIODIC: 60 * 60 * 1000,
} as const

export const SCENE = {
  FOG_COLOR: '#0a1628',
  FOG_NEAR: 30,
  FOG_FAR: 500,
  DEFAULT_CAMERA: {
    position: [0, 60, 30] as [number, number, number],
    target: [0, 0, 0] as [number, number, number],
  },
  THEME_CAMERAS: {
    overview: { position: [-7, 18, 70] as [number, number, number], target: [-7, 8, 13.5] as [number, number, number] },
    'teaching-research': { position: [-10, 51, 40] as [number, number, number], target: [-10, 5, 4] as [number, number, number] },
    admin: { position: [-29, 40, 42] as [number, number, number], target: [-5, 5, -8] as [number, number, number] },
    library: { position: [4, 34, 23] as [number, number, number], target: [-10, 4, -10] as [number, number, number] },
    academics: { position: [-6, 25, 52] as [number, number, number], target: [-6, 8, 4] as [number, number, number] },
    security: { position: [-59, 35, -24] as [number, number, number], target: [-12, 4, -3] as [number, number, number] },
    logistics: { position: [29, 32, 46] as [number, number, number], target: [-2, 3, 0] as [number, number, number] },
  } as Record<string, { position: [number, number, number]; target: [number, number, number] }>,
} as const
