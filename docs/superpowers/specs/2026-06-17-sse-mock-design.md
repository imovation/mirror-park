# SSE Mock for Dev Mode — Design Doc

## Problem

`EventSource` API cannot be intercepted by MSW. In dev mode, the SSE client connects to `/api/sse` which doesn't exist, causing an immediate connection error and fallback to polling.

## Solution

Create a mock SSE client for dev mode that simulates SSE events via `setInterval`. The mock pushes the same mock data that MSW serves for REST endpoints, but through the SSE channel. The `createSSEClient` function in `sse.ts` detects dev mode and uses the mock automatically.

## Architecture

```
sse.ts
  createSSEClient()
    ├── DEV ? createMockSSEClient()   ← new
    └── PROD ? createRealSSEClient()  ← existing EventSource logic
```

## Mock Data Source

Import existing mock data from MSW handlers to push via SSE. Each registered query key gets an interval that pushes data every 10-30s (configurable).

## Files

| File | Change |
|------|--------|
| `src/api/sse.mock.ts` | Create — mock SSE client that pushes data at intervals |
| `src/api/sse.ts` | Modify — route to mock in dev mode |
| `src/api/mocks/server.ts` | Modify — export mock data for re-use (optional, can also duplicate) |

## Data Events

The mock pushes updates for the same events the real SSE would send. Events are emitted at fixed intervals (every 15s per event type, staggered to avoid flooding):

| Event | Interval | Data |
|-------|----------|------|
| `overview.activity` | 15s | ActivityData |
| `overview.personnel` | 30s | PersonnelComposition |
| `security.alerts` | 10s | Dynamic alert list |
| (more as needed) | - | - |

## Verification

- Dev mode: SSE connects successfully (status = 'connected')
- MSW REST handlers still work for initial page load
- build succeeds, tests pass
