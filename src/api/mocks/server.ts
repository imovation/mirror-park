import { setupWorker } from 'msw/browser'
import { overviewHandlers } from './handlers/overview'
import { libraryHandlers } from './handlers/library'
import { securityHandlers } from './handlers/security'
import { academicsHandlers } from './handlers/academics'
import { adminHandlers } from './handlers/admin'

export const worker = setupWorker(...overviewHandlers, ...libraryHandlers, ...securityHandlers, ...academicsHandlers, ...adminHandlers)
