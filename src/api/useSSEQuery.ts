import { useEffect, useRef, useState, useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { createSSEClient, type SSEStatus } from './sse'

export function useSSE() {
  const queryClient = useQueryClient()
  const [status, setStatus] = useState<SSEStatus>('disconnected')
  const clientRef = useRef<ReturnType<typeof createSSEClient> | null>(null)

  const onMessage = useCallback(
    (event: string, data: unknown) => {
      const key = event.split('.')
      queryClient.setQueryData(key, data)
    },
    [queryClient],
  )

  useEffect(() => {
    const client = createSSEClient({
      onMessage,
      onStatusChange: setStatus,
    })
    clientRef.current = client
    return () => client.destroy()
  }, [onMessage])

  return { status }
}
