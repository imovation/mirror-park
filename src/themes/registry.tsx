import { lazy } from 'react'
import type { ReactNode } from 'react'
import { ThemeId } from '@/types/theme'
import type { PanelConfig } from '@/types/panel'

const OverviewScene = lazy(() => import('./overview/OverviewScene'))
const TeachingResearchScene = lazy(() => import('./teaching-research/TeachingResearchScene'))
const AdminScene = lazy(() => import('./admin/AdminScene'))
const LibraryScene = lazy(() => import('./library/LibraryScene'))
const AcademicsScene = lazy(() => import('./academics/AcademicsScene'))
const SecurityScene = lazy(() => import('./security/SecurityScene'))

import { overviewPanels, renderOverviewPanel } from './overview'
import { teachingResearchPanels, renderTeachingResearchPanel } from './teaching-research'
import { adminPanels, renderAdminPanel } from './admin'
import { libraryPanels, renderLibraryPanel } from './library'
import { academicsPanels, renderAcademicsPanel } from './academics'
import { securityPanels, renderSecurityPanel } from './security'

type SceneRenderer = () => ReactNode
type PanelRenderer = (panelId: string) => ReactNode

interface ThemeEntry {
  scene: SceneRenderer
  panels: { left: PanelConfig[]; right: PanelConfig[] }
  renderPanel: PanelRenderer
}

const registry: Record<ThemeId, ThemeEntry> = {
  [ThemeId.OVERVIEW]: {
    scene: () => <OverviewScene />,
    panels: overviewPanels,
    renderPanel: renderOverviewPanel,
  },
  [ThemeId.TEACHING_RESEARCH]: {
    scene: () => <TeachingResearchScene />,
    panels: teachingResearchPanels,
    renderPanel: renderTeachingResearchPanel,
  },
  [ThemeId.ADMIN]: {
    scene: () => <AdminScene />,
    panels: adminPanels,
    renderPanel: renderAdminPanel,
  },
  [ThemeId.LIBRARY]: {
    scene: () => <LibraryScene />,
    panels: libraryPanels,
    renderPanel: renderLibraryPanel,
  },
  [ThemeId.ACADEMICS]: {
    scene: () => <AcademicsScene />,
    panels: academicsPanels,
    renderPanel: renderAcademicsPanel,
  },
  [ThemeId.SECURITY]: {
    scene: () => <SecurityScene />,
    panels: securityPanels,
    renderPanel: renderSecurityPanel,
  },
}

export function getThemeEntry(theme: ThemeId): ThemeEntry {
  return registry[theme]
}
