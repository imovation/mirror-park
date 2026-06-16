export type UpdateLevel = 'realtime' | 'near-realtime' | 'periodic' | 'base'

export interface ApiQueryConfig {
  level: UpdateLevel
  key: string
}

export const QUERY_KEYS = {
  overview: {
    schoolInfo: ['overview', 'schoolInfo'],
    personnel: ['overview', 'personnel'],
    teacherDist: ['overview', 'teacherDist'],
    studentInfo: ['overview', 'studentInfo'],
    activity: ['overview', 'activity'],
  },
} as const
