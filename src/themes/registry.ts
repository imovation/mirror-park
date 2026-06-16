import { ThemeId } from '@/types/theme'
import type { PanelConfig } from '@/types/panel'
import type { ReactNode } from 'react'
import {
  overviewScene,
  overviewPanels,
  renderOverviewPanel,
} from './overview'
import {
  teachingResearchScene,
  teachingResearchPanels,
  renderTeachingResearchPanel,
} from './teaching-research'
import {
  adminScene,
  adminPanels,
  renderAdminPanel,
} from './admin'
import {
  libraryScene,
  libraryPanels,
  renderLibraryPanel,
} from './library'
import {
  academicsScene,
  academicsPanels,
  renderAcademicsPanel,
} from './academics'
import {
  securityScene,
  securityPanels,
  renderSecurityPanel,
} from './security'

type SceneRenderer = () => ReactNode
type PanelRenderer = (panelId: string) => ReactNode

interface ThemeEntry {
  scene: SceneRenderer
  panels: { left: PanelConfig[]; right: PanelConfig[] }
  renderPanel: PanelRenderer
}

const registry: Record<ThemeId, ThemeEntry> = {
  [ThemeId.OVERVIEW]: {
    scene: overviewScene,
    panels: overviewPanels,
    renderPanel: renderOverviewPanel,
  },
  [ThemeId.TEACHING_RESEARCH]: {
    scene: teachingResearchScene,
    panels: teachingResearchPanels,
    renderPanel: renderTeachingResearchPanel,
  },
  [ThemeId.ADMIN]: {
    scene: adminScene,
    panels: adminPanels,
    renderPanel: renderAdminPanel,
  },
  [ThemeId.LIBRARY]: {
    scene: libraryScene,
    panels: libraryPanels,
    renderPanel: renderLibraryPanel,
  },
  [ThemeId.ACADEMICS]: {
    scene: academicsScene,
    panels: academicsPanels,
    renderPanel: renderAcademicsPanel,
  },
  [ThemeId.SECURITY]: {
    scene: securityScene,
    panels: securityPanels,
    renderPanel: renderSecurityPanel,
  },
}

export function getThemeEntry(theme: ThemeId): ThemeEntry {
  return registry[theme]
}
