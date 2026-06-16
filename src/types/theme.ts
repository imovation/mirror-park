export enum ThemeId {
  OVERVIEW = 'overview',
  TEACHING_RESEARCH = 'teaching-research',
  ADMIN = 'admin',
  LIBRARY = 'library',
  ACADEMICS = 'academics',
  SECURITY = 'security',
}

export interface ThemeConfig {
  id: ThemeId
  label: string
  icon?: string
}

export const THEMES: ThemeConfig[] = [
  { id: ThemeId.OVERVIEW, label: '综合态势' },
  { id: ThemeId.TEACHING_RESEARCH, label: '教学研究' },
  { id: ThemeId.ADMIN, label: '行政办公' },
  { id: ThemeId.LIBRARY, label: '智慧图书' },
  { id: ThemeId.ACADEMICS, label: '智慧教学' },
  { id: ThemeId.SECURITY, label: '智慧安防' },
]
