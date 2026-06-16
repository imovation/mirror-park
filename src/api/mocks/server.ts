import { setupWorker } from 'msw/browser'
import { overviewHandlers } from './handlers/overview'
import { libraryHandlers } from './handlers/library'
import { securityHandlers } from './handlers/security'

export const worker = setupWorker(...overviewHandlers, ...libraryHandlers, ...securityHandlers)
