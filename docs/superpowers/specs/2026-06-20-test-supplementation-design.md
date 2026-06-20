# 测试补充计划 — 设计文档

**日期**: 2026-06-20  
**范围**: E2E 视觉回归全覆盖（6 专题 × 38 面板）+ 单元测试增强 + 集成测试  
**方案**: A (均衡型) — E2E 视觉回归为主

---

## 1. 测试基础设施

### 1.1 renderWithProviders 工具
`src/__tests__/test-utils.tsx`

```typescript
// 包装 @testing-library/react 的 render
// 自动注入:
//   - QueryClientProvider (new QueryClient, retry: false, 每个 test 独立实例)
//   - useUIThemeStore 可控 (默认 dark)
//   - 导出 renderWithProviders, createTestQueryClient, 所有 RTL 方法
```

### 1.2 Vitest 配置变更
`vitest.config.ts` — 添加 coverage 块:
- provider: 'v8'
- thresholds: statements 60%, branches 50%, functions 55%, lines 60%
- include: `['src/**/*.{ts,tsx}']`
- exclude: `['src/**/*.d.ts', 'src/**/__tests__/**', 'src/api/mocks/**']`

### 1.3 Playwright 配置变更
`e2e/playwright.config.ts`:
- `screenshot: 'only-on-failure'`
- 新增 `snapshotPathTemplate: '{testDir}/../screenshots/{testFilePath}/{arg}-{projectName}-dark.png'`
- 新增 project `Tablet` (viewport 1024×768, 继承默认配置)
- baseline screenshots 存储在 `e2e/screenshots/`

### 1.4 Setup 增强
`src/__tests__/setup.ts`:
- `@testing-library/jest-dom` 已 import
- 添加 `vi.spyOn(console, 'error').mockImplementation(() => {})`

---

## 2. E2E 视觉回归全覆盖（核心）

### 2.1 测试策略

| 维度 | 方式 |
|------|------|
| 布局/溢出 | `toMatchSnapshot()` 全页截图对比，threshold: 0.3 |
| 配色 | 深色+浅色各截图，同一专题双图对比 |
| 3D 场景 | `mask: [page.locator('#root canvas')]` 遮罩，避免渲染差异 |
| 折叠面板 | 额外截图折叠态 |
| 面板加载 | 等待 DashboardPanel 容器 + StatusPanel 消失 |

### 2.2 文件结构

```
e2e/
├── tests/
│   ├── loading.spec.ts                  (保留，追加错误状态)
│   ├── theme-switch.spec.ts             (保留，扩展全专题验证)
│   ├── topic-navigation.spec.ts         (保留，追加collapsible折叠)
│   ├── building-interaction.spec.ts     (保留，不变)
│   ├── topic-overview.spec.ts           (新 — 6 面板)
│   ├── topic-teaching-research.spec.ts  (新 — 7 面板)
│   ├── topic-admin.spec.ts              (新 — 6 面板)
│   ├── topic-library.spec.ts            (新 — 5 面板)
│   ├── topic-academics.spec.ts          (新 — 5 面板)
│   ├── topic-security.spec.ts           (新 — 7 面板)
│   ├── alert-popup.spec.ts              (新)
│   └── responsive.spec.ts               (新)
├── helpers/
│   └── visual-utils.ts                  (新 — 共享工具)
└── screenshots/                         (新 — baseline screenshots)
```

### 2.3 共享工具 `e2e/helpers/visual-utils.ts`

```typescript
// navigateToTopic(page, 'overview')        → 点击 tab 并等待面板加载
// waitForAllPanels(page)                   → 等待 SidePanel 内所有 DashboardPanel 无 loading/error
// takeTopicSnapshot(page, topic, theme)    → 截图并遮罩 3D canvas
// toggleUITheme(page, 'light'|'dark')      → 点主题按钮切换
// collapsePanel(page, panelTitle)          → 点击 collapsible 面板标题
// expandPanel(page, panelTitle)            → 展开面板
```

### 2.4 6 个专题 E2E 文件 — 每文件测试模板

```
describe('Topic: {名称}', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await waitForAllPanels(page)
    await navigateToTopic(page, '{topicId}')
    await waitForAllPanels(page)
    // 遮罩 3D canvas 避免干扰
    await page.locator('#root canvas').first().evaluate(el => el.style.display = 'none')
  })

  // — 深色主题 —
  test('{专题} 深色主题 — 全页截图', async ({ page }) => {
    await expect(page).toHaveScreenshot(`topic-{id}-dark.png`, { fullPage: false })
  })

  // — 浅色主题 —
  test('{专题} 浅色主题 — 全页截图', async ({ page }) => {
    await toggleUITheme(page, 'light')
    await expect(page).toHaveScreenshot(`topic-{id}-light.png`, { fullPage: false })
  })

  // — 折叠面板截图 —
  test('{专题} collapsible 面板折叠态', async ({ page }) => {
    // 对每个 collapsible='true' 的面板点折叠按钮
    await collapsePanel(page, '{面板标题}')
    await expect(page).toHaveScreenshot(`topic-{id}-collapsed.png`, { fullPage: false })
  })

  // — 面板内容校验 —
  test('{面板标题} 渲染正确', async ({ page }) => {
    await expect(page.getByText('{关键指标/文本}')).toBeVisible()
    // 图表容器存在
    await expect(page.locator('.echarts-container, canvas')).toBeAttached()
  })
})
```

### 2.5 面板覆盖清单

| 专题 | 面板数 | collapsible 面板 | 截图数 |
|------|--------|-----------------|--------|
| 综合态势 overview | 6 | AssetOverview, ActivityTimeStats | 深1+浅1+折叠1=3 |
| 教学研究 teaching-research | 7 | TeachingResourcesPanel, ResourceStatistics, TeacherTopics | 深1+浅1+折叠1=3 |
| 行政办公 admin | 6 | StaffAttendance, SchoolCalendar, MeetingManagement | 深1+浅1+折叠1=3 |
| 智慧图书 library | 5 | BorrowStats, BookBorrowRank, VisitorStats | 深1+浅1+折叠1=3 |
| 智慧教学 academics | 5 | ScheduleSpace, ExamManagement, TeachingDevices | 深1+浅1+折叠1=3 |
| 智慧安防 security | 7 | MonitorStatus, AccessControl, AlertEvents, CanteenSafety | 深1+浅1+折叠1=3 |

**总计: 6 × 3 = 18 张截图 baseline**

### 2.6 跨专题 E2E 用例

**`alert-popup.spec.ts`** (新增):
| # | 用例 |
|---|------|
| 1 | 导航到安防专题 → 等待 SSE 推送告警 → alert 弹窗可见且有文字 |
| 2 | 点击弹窗关闭按钮 → 弹窗消失 |
| 3 | 多个告警弹出 → 队列中正确显示最新 |

**`responsive.spec.ts`** (新增):
| # | 用例 |
|---|------|
| 1 | 1920×1080: 左右面板均有内容，无溢出 |
| 2 | 1024×768 (iPad): TopBar/SidePanel 可见，布局不折行 |

**`loading.spec.ts`** (追加):
| # | 用例 |
|---|------|
| 5 | 拦截 API 返回 500 → 面板显示"数据加载失败" |

**`topic-navigation.spec.ts`** (追加):
| # | 用例 |
|---|------|
| 4 | 面板折叠 → 点击 collapsible 头部 → 内容区折叠/展开 |

**`theme-switch.spec.ts`** (扩展):
| # | 用例 |
|---|------|
| 2 | 在 6 个专题下各切一次主题 → 面板无闪烁/无消失 |

---

## 3. 集成测试

### 3.1 测试文件
`src/__tests__/integration/panel-rendering.test.tsx`

### 3.2 测试用例 (8 个)

| # | 用例 | 验证 |
|---|------|------|
| 1 | AssetOverview 加载完成 | 标题"学校概况"可见→图表 canvas 存在→数字指标渲染 |
| 2 | AssetOverview 空数据 | handler 返回空数组→StatusPanel "暂无数据" |
| 3 | TeachingResourcesPanel 加载完成 | loading→ready→Treemap canvas |
| 4 | TeachingResourcesPanel API 错误 | handler 返回 500→StatusPanel "数据加载失败" |
| 5 | BorrowStats 加载完成 | 多图表渲染→关键文本可见 |
| 6 | BorrowStats 空数据 | 空数组→StatusPanel empty |
| 7 | useOverviewQuery 返回结构 | hook 返回字段完整性 |
| 8 | useOverviewQuery 错误处理 | handler 抛 500 → error 状态 |

---

## 4. 单元测试

| 文件 | 测试内容 | 用例数 |
|------|---------|-------|
| `unit/stores-extended.test.ts` (追加) | useUIThemeStore: 初始 dark、toggle、localStorage | +3 |
| `component/BarChart.test.tsx` | 渲染 canvas、空数组 | 2 |
| `component/PieChart.test.tsx` | 渲染 canvas、空数组 | 2 |
| `component/ErrorBoundary.test.tsx` | 正常 children、捕获异常→fallback | 2 |
| `component/ScrollList.test.tsx` | 列表渲染、header 表头 | 2 |
| `unit/api-client.test.ts` | fetchApi 成功/失败/异常 | 3 |
| `unit/chart-theme.test.ts` | useChartTheme 深色/浅色 token 不同 | 1 |

---

## 5. 工作清单

| # | 任务 | 类型 | 用例 | 预估 |
|---|------|------|------|------|
| 1 | 创建 `test-utils.tsx` (renderWithProviders) | 基础设施 | — | 小 |
| 2 | 创建 `e2e/helpers/visual-utils.ts` | 基础设施 | — | 小 |
| 3 | 更新 `vitest.config.ts` (coverage) | 基础设施 | — | 小 |
| 4 | 更新 `e2e/playwright.config.ts` (screenshot+Tablet) | 基础设施 | — | 小 |
| 5 | `src/__tests__/unit/stores-extended.test.ts` 追加 | 单元 | +3 | 小 |
| 6 | `src/__tests__/unit/api-client.test.ts` | 单元 | +3 | 小 |
| 7 | `src/__tests__/unit/chart-theme.test.ts` | 单元 | +1 | 小 |
| 8 | `src/__tests__/component/ErrorBoundary.test.tsx` | 单元 | +2 | 小 |
| 9 | `src/__tests__/component/BarChart.test.tsx` | 单元 | +2 | 小 |
| 10 | `src/__tests__/component/PieChart.test.tsx` | 单元 | +2 | 小 |
| 11 | `src/__tests__/component/ScrollList.test.tsx` | 单元 | +2 | 小 |
| 12 | `src/__tests__/integration/panel-rendering.test.tsx` | 集成 | +8 | 中 |
| 13 | `e2e/tests/topic-overview.spec.ts` | E2E | +8 | 中 |
| 14 | `e2e/tests/topic-teaching-research.spec.ts` | E2E | +9 | 中 |
| 15 | `e2e/tests/topic-admin.spec.ts` | E2E | +8 | 中 |
| 16 | `e2e/tests/topic-library.spec.ts` | E2E | +7 | 中 |
| 17 | `e2e/tests/topic-academics.spec.ts` | E2E | +7 | 中 |
| 18 | `e2e/tests/topic-security.spec.ts` | E2E | +9 | 中 |
| 19 | `e2e/tests/alert-popup.spec.ts` | E2E | +3 | 小 |
| 20 | `e2e/tests/responsive.spec.ts` | E2E | +2 | 小 |
| 21 | `e2e/tests/loading.spec.ts` 追加 | E2E | +1 | 小 |
| 22 | `e2e/tests/topic-navigation.spec.ts` 追加 | E2E | +1 | 小 |
| 23 | `e2e/tests/theme-switch.spec.ts` 扩展 | E2E | +1 | 小 |
| 24 | `pnpm test` + `pnpm test:e2e` 全量验证 | 验证 | — | 小 |

**总计: ~75 新增用例 + 18 张截图 baseline**

---

## 6. 已知风险

| 风险 | 缓解 |
|------|------|
| ECharts canvas 渲染在 jsdom 不可用 | 单元测试仅验证容器存在，E2E 用截图验证图表内容 |
| 3D 场景 canvas 渲染差异导致截图误报 | mask 遮罩 + threshold: 0.3 |
| MSW 在 E2E 中与 dev server 共享状态 | 每个 test 独立 `page.route` 或接受现有 handler |
| SSE 推送时间不确定 (告警测试) | 用 `page.evaluate` 直接调 `useUIStore.addAlert()` 触发 |
