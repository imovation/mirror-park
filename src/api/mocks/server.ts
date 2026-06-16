import { setupWorker } from 'msw/browser'
import { overviewHandlers } from './handlers/overview'
import { libraryHandlers } from './handlers/library'

export const worker = setupWorker(...overviewHandlers, ...libraryHandlers)
