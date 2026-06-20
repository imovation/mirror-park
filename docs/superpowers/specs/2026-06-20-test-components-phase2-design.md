# 测试补充 Phase 2 — 设计文档

**日期**: 2026-06-20  
**范围**: 图表组件 (9) + 布局组件 (4) + UI 组件 (6) 单元测试补齐  
**方案**: A (全量) — 每组件基本渲染 + 边界测试

---

## 1. 图表组件 (9 个 × 2 用例 = 18)

### 1.1 统一测试模式

每个图表组件测试：
- 有数据时渲染容器（`container.firstElementChild` 非 null）
- 空数组时渲染不崩溃
- 使用 `renderWithProviders`（图表内部调用 `useChartTheme` 需 Provider）

### 1.2 文件清单

| 文件 | 组件 | Props 类型 |
|------|------|-----------|
| `src/__tests__/component/LineChart.test.tsx` | LineChart | data: `{name,value}[]` |
| `src/__tests__/component/RingChart.test.tsx` | RingChart | data: `{name,value}[]` |
| `src/__tests__/component/GaugeChart.test.tsx` | GaugeChart | data: `{name,value}[]` 或 number |
| `src/__tests__/component/HeatmapChart.test.tsx` | HeatmapChart | data: `{x,y,value}[]` |
| `src/__tests__/component/TreemapChart.test.tsx` | TreemapChart | data: `{name,value}[]` |
| `src/__tests__/component/SankeyChart.test.tsx` | SankeyChart | data: `{nodes, links}` |
| `src/__tests__/component/SunburstChart.test.tsx` | SunburstChart | data: hierarchical |
| `src/__tests__/component/FunnelChart.test.tsx` | FunnelChart | data: `{name,value}[]` |
| `src/__tests__/component/RadarChart.test.tsx` | RadarChart | data: `{name,value}[]` |

---

## 2. 布局组件 (4 个 × 3 用例 = 12)

### 2.1 TopBar

| # | 用例 |
|---|------|
| 1 | 渲染标题 "智慧校园可视化平台" |
| 2 | 6 个专题按钮全部可见（综合态势/教学研究/行政办公/智慧图书/智慧教学/智慧安防） |
| 3 | 深色/亮色切换按钮存在（☀️ 亮色） |

### 2.2 SidePanel

| # | 用例 |
|---|------|
| 1 | 渲染 children 内容 |
| 2 | 空 children 不崩溃 |
| 3 | 滚动容器 overflow-y: auto 存在 |

### 2.3 BottomBar

| # | 用例 |
|---|------|
| 1 | 显示版本号 v0.2.0 |
| 2 | 显示 SSE 连接状态文本 |
| 3 | 底部栏容器可见 |

### 2.4 ScreenLayout

| # | 用例 |
|---|------|
| 1 | 渲染 topMetrics 插槽内容 |
| 2 | 渲染 left/right SidePanel |
| 3 | 渲染 BottomBar |

---

## 3. UI 组件 (6 个 × 约3 用例 = 18)

### 3.1 AlertPopup

| # | 用例 |
|---|------|
| 1 | 空队列时不渲染弹窗 |
| 2 | 有告警时显示消息文本 |
| 3 | 多条告警时最多显示 3 条 |

### 3.2 CardCarousel

| # | 用例 |
|---|------|
| 1 | 渲染卡片列表 |
| 2 | 空列表安全处理 |

### 3.3 ChartLabel

| # | 用例 |
|---|------|
| 1 | 渲染文本内容 |
| 2 | left/center 对齐样式正确 |
| 3 | 空文本不崩溃 |

### 3.4 Modal

| # | 用例 |
|---|------|
| 1 | open=true 渲染内容 |
| 2 | open=false 不渲染 |
| 3 | onClose 回调触发 |

### 3.5 TopMetricsCard

| # | 用例 |
|---|------|
| 1 | 渲染标题和数值 |
| 2 | 自定义颜色样式 |

### 3.6 VideoWindow

| # | 用例 |
|---|------|
| 1 | 渲染视频窗口容器 |
| 2 | 关闭按钮存在 |
| 3 | 关闭触发回调 |

---

## 4. 工作清单

| # | 任务 | 用例 | 预估 |
|---|------|------|------|
| 1 | LineChart.test.tsx | +2 | 小 |
| 2 | RingChart.test.tsx | +2 | 小 |
| 3 | GaugeChart.test.tsx | +2 | 小 |
| 4 | HeatmapChart.test.tsx | +2 | 小 |
| 5 | TreemapChart.test.tsx | +2 | 小 |
| 6 | SankeyChart.test.tsx | +2 | 小 |
| 7 | SunburstChart.test.tsx | +2 | 小 |
| 8 | FunnelChart.test.tsx | +2 | 小 |
| 9 | RadarChart.test.tsx | +2 | 小 |
| 10 | TopBar.test.tsx | +3 | 中 |
| 11 | SidePanel.test.tsx | +3 | 小 |
| 12 | BottomBar.test.tsx | +3 | 小 |
| 13 | ScreenLayout.test.tsx | +3 | 中 |
| 14 | AlertPopup.test.tsx | +3 | 中 |
| 15 | CardCarousel.test.tsx | +2 | 小 |
| 16 | ChartLabel.test.tsx | +3 | 小 |
| 17 | Modal.test.tsx | +3 | 小 |
| 18 | TopMetricsCard.test.tsx | +2 | 小 |
| 19 | VideoWindow.test.tsx | +3 | 小 |
| 20 | 全量验证 `pnpm test` | — | 小 |

**总计: ~48 新增用例**
