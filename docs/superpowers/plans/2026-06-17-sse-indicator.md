# SSE Connection Status Indicator Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a real-time SSE connection status indicator to the BottomBar.

---

### Task 1: Update BottomBar.tsx and App.tsx

**Files:**
- Modify: `src/components/layout/BottomBar.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Update BottomBar.tsx**
Read `src/components/layout/BottomBar.tsx`.
Update the component to accept `status` prop.

```tsx
import { useState, useEffect } from 'react'

interface BottomBarProps {
  status?: 'connecting' | 'connected' | 'disconnected'
}

export default function BottomBar({ status = 'disconnected' }: BottomBarProps) {
  const [currentTime, setCurrentTime] = useState('--:--')

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString('zh-CN', { hour12: false }))
    }, 30000)
    return () => clearInterval(timer)
  }, [])

  const statusConfig = {
    connected: { icon: '🟢', text: '实时连接正常', color: 'var(--color-success)' },
    connecting: { icon: '🟡', text: '正在连接...', color: 'var(--color-warning)' },
    disconnected: { icon: '🔴', text: '连接已断开', color: 'var(--color-danger)' },
  }
  const currentStatus = statusConfig[status]

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '100%',
        padding: '0 16px',
        background: 'var(--bottombar-bg)',
        borderTop: '1px solid var(--border-light)',
        fontSize: '0.7em',
        color: 'var(--text-muted)',
      }}
    >
      <span>智慧校园可视化平台 v0.2.0 | 数据更新: {currentTime}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: currentStatus.color }}>
        <span style={{ fontSize: '0.9em' }}>{currentStatus.icon}</span>
        <span>{currentStatus.text}</span>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Update App.tsx**
Read `src/App.tsx`.
Change `<BottomBar />` at line 87 to `<BottomBar status={sseStatus} />`.

- [ ] **Step 3: Verify build**
Run: `pnpm build`
Expected: Build succeeds

- [ ] **Step 4: Commit**
```bash
git add src/components/layout/BottomBar.tsx src/App.tsx
git commit -m "feat(sse): add SSE connection status indicator to BottomBar"
```
