export type SSEStatus = 'connecting' | 'connected' | 'disconnected'

interface SSEClientOptions {
  url?: string
  onMessage: (event: string, data: unknown) => void
  onStatusChange: (status: SSEStatus) => void
}

import { createMockSSEClient } from './sse.mock'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'
const USE_MOCK = import.meta.env.DEV && !import.meta.env.VITE_DISABLE_MOCK_SSE

export function createSSEClient(options: SSEClientOptions) {
  if (USE_MOCK) {
    return createMockSSEClient(options)
  }
  const { url = `${BASE_URL}/sse`, onMessage, onStatusChange } = options
  let eventSource: EventSource | null = null
  let retryDelay = 1000
  let retryTimer: ReturnType<typeof setTimeout> | null = null
  let destroyed = false

  function connect() {
    if (destroyed) return

    onStatusChange('connecting')
    eventSource = new EventSource(url)

    eventSource.onopen = () => {
      onStatusChange('connected')
      retryDelay = 1000
    }

    eventSource.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data)
        if (msg.type && msg.payload !== undefined) {
          onMessage(msg.type, msg.payload)
        }
      } catch {
        // non-JSON messages are ignored
      }
    }

    eventSource.onerror = () => {
      eventSource?.close()
      onStatusChange('disconnected')
      scheduleReconnect()
    }
  }

  function scheduleReconnect() {
    if (destroyed) return
    if (retryTimer) clearTimeout(retryTimer)
    retryTimer = setTimeout(() => {
      retryDelay = Math.min(retryDelay * 2, 30000)
      connect()
    }, retryDelay)
  }

  function destroy() {
    destroyed = true
    if (retryTimer) clearTimeout(retryTimer)
    eventSource?.close()
    eventSource = null
    onStatusChange('disconnected')
  }

  connect()

  return { destroy }
}
