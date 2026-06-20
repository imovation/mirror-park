import { setupWorker } from 'msw/browser'
import { overviewHandlers } from './handlers/overview'
import { libraryHandlers } from './handlers/library'
import { securityHandlers } from './handlers/security'
import { academicsHandlers } from './handlers/academics'
import { adminHandlers } from './handlers/admin'
import { teachingResearchHandlers } from './handlers/teaching-research'
import { logisticsHandlers } from './handlers/logistics'

export const worker = setupWorker(...overviewHandlers, ...libraryHandlers, ...securityHandlers, ...academicsHandlers, ...adminHandlers, ...teachingResearchHandlers, ...logisticsHandlers)
