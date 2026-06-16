import { setupWorker } from 'msw/browser'
import { overviewHandlers } from './handlers/overview'

export const worker = setupWorker(...overviewHandlers)
