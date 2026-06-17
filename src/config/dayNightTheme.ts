export type TimeMode = 'day' | 'night'

export interface DayNightTheme {
  building: {
    baseColor: string
    windowColor: string
    litChance: number
  }
  road: {
    staticColor: string
    flowEnabled: boolean
    flowPrimaryColor: string
    flowSecondaryColor: string
  }
  ground: { color: string }
  ambientLight: { intensity: number }
  directionalLight: { intensity: number }
  fog: { color: string }
  canvas: { background: string }
  archway: {
    bodyColor: string
    topColor: string
    showEdges: boolean
    edgeColor: string
  }
  courtyard: {
    color: string
    emissive: string
    emissiveIntensity: number
  }
  reservoir: {
    useMirror: boolean
    standardColor: string
    mirrorColor: string
  }
  cityContext: { color: string }
  landscape: {
    hedgeColor: string
    treeTrunkColor: string
    treeLeafColor: string
    treeLeafEmissive: string
    treeLeafEmissiveIntensity: number
  }
  flowerBeds: {
    colors: string[]
    emissiveIntensity: number
  }
  poi: {
    ringColor: string
    dotColor: string
    pillarColor: string
    lineColor: string
  }
  bloom: { intensity: number }
  particle: { color: string; opacity: number }
  track: {
    baseColor: string
    laneColor: string
  }
  environment: { preset: string | null }
}

export const DAY_NIGHT: Record<TimeMode, DayNightTheme> = {
  day: {
    building: {
      baseColor: '#a0522d',
      windowColor: '#f5f0e8',
      litChance: 0.6,
    },
    road: {
      staticColor: '#3a3a3a',
      flowEnabled: false,
      flowPrimaryColor: '#ff6b35',
      flowSecondaryColor: '#00e5ff',
    },
    ground: { color: '#1a5c2a' },
    ambientLight: { intensity: 0.8 },
    directionalLight: { intensity: 1.2 },
    fog: { color: '#dce8f5' },
    canvas: { background: 'linear-gradient(180deg, #e8f0fe 0%, #f0f4f8 100%)' },
    archway: {
      bodyColor: '#f0f4f8',
      topColor: '#a0522d',
      showEdges: false,
      edgeColor: '#a0522d',
    },
    courtyard: {
      color: '#2a4a2a',
      emissive: '#000000',
      emissiveIntensity: 0,
    },
    reservoir: {
      useMirror: false,
      standardColor: '#4a8ac4',
      mirrorColor: '#0d1a2d',
    },
    cityContext: { color: '#3a404a' },
    landscape: {
      hedgeColor: '#3a6b3a',
      treeTrunkColor: '#5c3a1e',
      treeLeafColor: '#2d5a1e',
      treeLeafEmissive: '#000000',
      treeLeafEmissiveIntensity: 0,
    },
    flowerBeds: {
      colors: ['#ff6b9d', '#ffd93d', '#6bcf7f', '#4d96ff'],
      emissiveIntensity: 0,
    },
    poi: {
      ringColor: '#a0522d',
      dotColor: '#ffffff',
      pillarColor: '#a0522d',
      lineColor: '#888888',
    },
    bloom: { intensity: 0.3 },
    particle: { color: '#888888', opacity: 0.2 },
    track: { baseColor: '#c44', laneColor: '#c44' },
    environment: { preset: 'sunset' },
  },
  night: {
    building: {
      baseColor: '#06101e',
      windowColor: '#00e5ff',
      litChance: 0.6,
    },
    road: {
      staticColor: '#3a3a3a',
      flowEnabled: true,
      flowPrimaryColor: '#ff6b35',
      flowSecondaryColor: '#00e5ff',
    },
    ground: { color: '#050a14' },
    ambientLight: { intensity: 0.4 },
    directionalLight: { intensity: 0.8 },
    fog: { color: '#0a1628' },
    canvas: { background: 'linear-gradient(180deg, #0a1628 0%, #16213e 100%)' },
    archway: {
      bodyColor: '#06101e',
      topColor: '#06101e',
      showEdges: true,
      edgeColor: '#00e5ff',
    },
    courtyard: {
      color: '#0e2a1a',
      emissive: '#00ff88',
      emissiveIntensity: 0.35,
    },
    reservoir: {
      useMirror: true,
      standardColor: '#4a8ac4',
      mirrorColor: '#0d1a2d',
    },
    cityContext: { color: '#080c14' },
    landscape: {
      hedgeColor: '#2d5a3d',
      treeTrunkColor: '#3a2518',
      treeLeafColor: '#1a5a30',
      treeLeafEmissive: '#0a3a1a',
      treeLeafEmissiveIntensity: 0.3,
    },
    flowerBeds: {
      colors: ['#ff6b9d', '#ffd93d', '#6bcf7f', '#4d96ff'],
      emissiveIntensity: 0.2,
    },
    poi: {
      ringColor: '#00e5ff',
      dotColor: '#ffffff',
      pillarColor: '#00e5ff',
      lineColor: '#00e5ff',
    },
    bloom: { intensity: 0.6 },
    particle: { color: '#4a9eff', opacity: 0.4 },
    track: { baseColor: '#1a2535', laneColor: '#00e5ff' },
    environment: { preset: 'city' },
  },
}
