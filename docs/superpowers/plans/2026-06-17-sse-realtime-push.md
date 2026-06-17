# SSE Real-Time Push Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add SSE (Server-Sent Events) infrastructure for real-time data push, replacing polling as the primary update mechanism.

**Architecture:** Create an SSE client that connects to `/api/sse`, parses events with queryKey as event name, and updates the TanStack Query cache via `queryClient.setQueryData()`. A single hook call in App.tsx starts the connection. Existing `useQuery` panels react automatically.

**Tech Stack:** React 18, TanStack Query v5, native `EventSource` API

---

### Task 1: Create SSE client + hook

**Files:**
- Create: `src/api/sse.ts`
- Create: `src/api/useSSEQuery.ts`

- [ ] **Step 1: Create SSE client**

Write `src/api/sse.ts`:

```ts
export type SSEStatus = 'connecting' | 'connected' | 'disconnected'

interface SSEClientOptions {
  url?: string
  onMessage: (event: string, data: unknown) => void
  onStatusChange: (status: SSEStatus) => void
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

export function createSSEClient(options: SSEClientOptions) {
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
        // Expected format: { type: "overview.schoolInfo", payload: { ... } }
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
```

- [ ] **Step 2: Create useSSEQuery hook**

Write `src/api/useSSEQuery.ts`:

```ts
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
```

- [ ] **Step 3: Verify build**

Run: `pnpm build`
Expected: Build succeeds with no errors

- [ ] **Step 4: Commit**

```bash
git add src/api/sse.ts src/api/useSSEQuery.ts
git commit -m "feat(sse): add SSE client and useSSE hook for real-time data push"
```

---

### Task 2: Integrate SSE in App.tsx

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: Add SSE hook to App.tsx**

Read `src/App.tsx`. Add the SSE hook call below the existing `useThemeStore` and `useUIThemeStore` hooks. The connection status can be logged or displayed via a small badge.

Add import:
```tsx
import { useSSE } from '@/api/useSSEQuery'
```

Inside the `App` function, add after the `const uiTheme = ...` line:
```tsx
const { status: sseStatus } = useSSE()
```

To make connection status visible (for debugging), add to the top bar or use a simple console log. Add a `useEffect`:
```tsx
useEffect(() => {
  console.log(`[SSE] ${sseStatus}`)
}, [sseStatus])
```

- [ ] **Step 2: Verify build**

Run: `pnpm build`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add src/App.tsx
git commit -m "feat(sse): integrate SSE connection in App.tsx"
```

---

### Task 3: Final verification

- [ ] **Step 1: Run full test suite**

Run: `pnpm test --run`
Expected: All 35 tests pass

- [ ] **Step 2: Run final build**

Run: `pnpm build`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "chore: verify all tests and build after SSE real-time push"
```
