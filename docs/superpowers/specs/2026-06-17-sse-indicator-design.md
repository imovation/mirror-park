# SSE Connection Status Indicator — Design Doc

## Overview
Add a visual indicator in the `BottomBar` to show the current Server-Sent Events (SSE) connection status. This improves UX by making the real-time push status visible to users.

## Changes

1. **Modify `BottomBar.tsx`**:
   - Add a `status` prop of type `'connecting' | 'connected' | 'disconnected'`.
   - Render a small status indicator next to the current time, e.g., `🟢 实时连接正常` or `🔴 连接已断开`.

2. **Modify `App.tsx`**:
   - Pass the `sseStatus` value returned by `useSSE()` down to `<BottomBar status={sseStatus} />`.

## Status Map
- `connected`: 🟢 实时连接正常 (color: success)
- `connecting`: 🟡 正在连接... (color: warning)
- `disconnected`: 🔴 连接已断开 (color: danger)

## Verification
- `pnpm build` succeeds
- `BottomBar` renders the correct status in the UI.
