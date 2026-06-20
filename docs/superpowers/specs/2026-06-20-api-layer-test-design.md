# 测试补充 Phase 3 — 设计文档

**日期**: 2026-06-20  
**范围**: API 完整层测试 — SSE 客户端/SSE Mock/useSSEQuery/Query Hooks/MSW Handlers  
**方案**: 分层测试 — SSE (10 例) + Queries (15 例) + MSW Handlers (12 例)

---

## 1. SSE 层 (3 文件 × ~3-4 用例 = 10)

### 1.1 sse.test.ts
- mock `EventSource` 构造函数
- 验证: `onopen` 触发 → status='connected'
- 验证: `onmessage` 触发 → 事件解析 → 回调调用
- 验证: `onerror` 触发 + readyState=CLOSED → 指数退避重连
- 验证: `close()` → removeEventListener 被调用

### 1.2 sse.mock.test.ts
- 验证: 启动后 `setInterval` 创建
- 验证: 6 种事件类型的 listener 被调用
- 验证: status 变化: connecting → connected

### 1.3 useSSEQuery.test.ts
- 验证: SSE 事件触发 → `queryClient.setQueryData` 被调用
- 验证: 事件类型 → query key 映射正确
- 验证: 组件卸载 → SSE close 被调用

---

## 2. Query Hooks (6 文件 × ~2-3 用例 = 15)

### 2.1 测试策略
每个 topic 的 query 文件（overview/library/admin/teaching-research/academics/security）:
- 验证: 所有 hook 存在且可调用
- 验证: 正确的 query key 命名规则（如 `['overview', 'schoolInfo']`）
- 验证: refetchInterval 值匹配常量定义

示例伪代码:
```ts
it('useSchoolInfo has correct query key', async () => {
  const { result } = renderHook(() => useSchoolInfo())
  // hook returns Some<T>, verify it doesn't throw
  expect(result.current).toBeDefined()
})
```

---

## 3. MSW Handlers (6 文件 × ~2 用例 = 12)

### 3.1 测试策略
直接调用 handler 的 resolver 函数，用 `HttpResponse` 返回 mock 数据:
- 验证: handler URL 路径匹配
- 验证: 响应状态码 200
- 验证: 响应 JSON 结构包含预期字段

### 3.2 文件清单

| 文件 | 覆盖 handler |
|------|-------------|
| `overview-handlers.test.ts` | 8 端点: school-info, personnel, teacher-distribution, student-info, activity, assets, rooms, recent-activity |
| `teaching-research-handlers.test.ts` | 6 端点 |
| `admin-handlers.test.ts` | 6 端点 |
| `library-handlers.test.ts` | 4 端点 |
| `academics-handlers.test.ts` | 4 端点 |
| `security-handlers.test.ts` | 6 端点 |

---

## 4. 工作清单

| # | 任务 | 类型 | 用例 | 预估 |
|---|------|------|------|------|
| 1 | `sse.test.ts` | 单元 | 4 | 中 |
| 2 | `sse.mock.test.ts` | 单元 | 3 | 中 |
| 3 | `useSSEQuery.test.ts` | 单元 | 3 | 中 |
| 4 | `overview-queries.test.ts` | 单元 | 3 | 小 |
| 5 | `teaching-research-queries.test.ts` | 单元 | 2 | 小 |
| 6 | `admin-queries.test.ts` | 单元 | 2 | 小 |
| 7 | `library-queries.test.ts` | 单元 | 2 | 小 |
| 8 | `academics-queries.test.ts` | 单元 | 2 | 小 |
| 9 | `security-queries.test.ts` | 单元 | 2 | 小 |
| 10 | `overview-handlers.test.ts` | 单元 | 2 | 小 |
| 11 | `teaching-research-handlers.test.ts` | 单元 | 2 | 小 |
| 12 | `admin-handlers.test.ts` | 单元 | 2 | 小 |
| 13 | `library-handlers.test.ts` | 单元 | 2 | 小 |
| 14 | `academics-handlers.test.ts` | 单元 | 2 | 小 |
| 15 | `security-handlers.test.ts` | 单元 | 2 | 小 |
| 16 | 全量验证 | — | — | 小 |

**总计: ~37 新增用例**
