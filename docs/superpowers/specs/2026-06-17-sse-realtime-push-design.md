# SSE Real-Time Push — Design Doc

## Overview

Replace polling (`refetchInterval`) with SSE (Server-Sent Events) for real-time data updates. SSE events update the TanStack Query cache via `queryClient.setQueryData()`, so existing `useQuery` hooks and panels require zero changes.

## Architecture

```
Server (/api/sse)                     Client
─────────────────                     ──────
  event: overview.schoolInfo     →    EventSource.onmessage
  data: {"landArea":73,...}      →    queryClient.setQueryData(
                                       ['overview','schoolInfo'], data
                                     )
                                     → useQuery consumers re-render
```

- **SSE endpoint**: `GET /api/sse` — server pushes events with queryKey as `event` field
- **Client**: `EventSource` + reconnection logic in a custom hook
- **Cache update**: `queryClient.setQueryData(eventName, data)` — panels react automatically
- **Fallback**: On SSE disconnect, the original `refetchInterval` polling kicks in

## SSE Protocol

```
event: overview.schoolInfo
data: {"landArea":73,"buildingArea":88000,...}

event: overview.activity
data: {"hours":["08:00","09:00",...],"values":[120,85,...]}
```

`event` name matches the existing queryKey segments (joined by `.`).  
`data` is JSON matching the existing API response types.

## Files

| File | Purpose |
|------|---------|
| `src/api/sse.ts` | SSE client: connect, reconnect (exponential backoff), parse, dispatch |
| `src/api/useSSEQuery.ts` | Hook: takes queryKey → SSE event name, returns `{ isConnected }` |
| `src/App.tsx` | Start SSE connection on mount (one hook call) |

## Reconnection Strategy

- Initial retry delay: 1s
- Exponential backoff: ×2 each attempt
- Max delay: 30s
- Reset on successful connection
- `isConnected` state for UI indicator

## Non-Goals

- No changes to existing query hooks (`api/queries/*.ts`) or panels
- No changes to MSW handlers (MSW can be extended later for SSE mock)
- No changes to the REST API client (`api/client.ts`)
- No bidirectional messaging (dashboard is read-only)

## Verification

- `pnpm build` succeeds
- All 35 tests pass
- SSE client connects and dispatches data correctly
- Fallback polling works when SSE disconnects
