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
    overview: { position: [23.9, 15.9, 53.1] as [number, number, number], target: [-1.0, 8.5, 8.1] as [number, number, number] },
    'teaching-research': { position: [-17.3, 15.7, -60.6] as [number, number, number], target: [-9.0, 6.5, 2.9] as [number, number, number] },
    admin: { position: [-43.5, 17.9, 49.1] as [number, number, number], target: [-5.2, 6.1, -7.1] as [number, number, number] },
    library: { position: [4, 34, 23] as [number, number, number], target: [-10, 4, -10] as [number, number, number] },
    academics: { position: [-6, 25, 52] as [number, number, number], target: [-6, 8, 4] as [number, number, number] },
    security: { position: [23.1, 34.3, 48.0] as [number, number, number], target: [-6.2, 5.3, 1.4] as [number, number, number] },
    logistics: { position: [-59, 35, -24] as [number, number, number], target: [-12, 4, -3] as [number, number, number] },
  } as Record<string, { position: [number, number, number]; target: [number, number, number] }>,
} as const
