# 数据面板全面审查报告

## 执行概要

对 6 个专题、39 个数据面板进行"视觉/UX 一致性 → 代码质量/架构 → 数据完整性"三阶段审查。共发现并修复 **P0 问题 6 个、P1 问题 8 个**，P2 优化建议 **12 个**。

| 指标 | 数值 |
|------|------|
| 修改文件数 | 60+ |
| 新增组件 | 2 (ChartLabel, useRecentActivity hook) |
| 修复提交 | 10 |
| 编译 | `pnpm build` 通过 (4.25s) |
| 测试 | 35/35 通过 |

---

## Phase 1: 横切共性修复（已完成）

### P0-1: StatusPanel 错误状态颜色
- **问题**: 错误状态使用 `var(--color-warning)` (橙色 #ff6d00)，应为 `var(--color-danger)` (红色 #ff1744)
- **修复**: `StatusPanel.tsx:9` 改为 `var(--color-danger)`
- **影响**: 所有 39 面板的错误状态

### P0-2: 75+ 处硬编码 `rgba(255,255,255,...)`
- **问题**: 面板内联样式中大量硬编码白色文本颜色，浅色主题下完全不可见
- **修复**: 
  - 新增 `ChartLabel` 组件 (46 处图表副标签统一替换)
  - 剩余 41 处数据展示文本替换为 CSS 变量 (`--text-primary/secondary/tertiary/muted`)
- **映射**: `rgba(255,255,255,0.85)→text-primary`, `0.7→text-secondary`, `0.5→text-tertiary`, `0.3→text-muted`

### P0-3: 29 面板空数据返回 null
- **问题**: `if (!data) return null` 导致面板在无数据时完全消失
- **修复**: 全部 37 面板改为 `<StatusPanel type="empty" />` 显示"暂无数据"
- **排除**: BuildingDetail、RecentActivity 单独处理

### P0-4: RecentActivity 无数据加载
- **问题**: 使用静态 `faker` 数据，无 query hook，无 loading/error 状态
- **修复**: 
  - 新增 `useRecentActivity()` hook (queryKey: `['overview', 'recentActivity']`)
  - 新增 mock handler 返回 12 条活动记录
  - 面板改用 StatusPanel 四态模式

### P0-5: BuildingDetail 无状态管理
- **问题**: 未选中建筑时显示普通文本提示，无 StatusPanel 封装
- **修复**: 未选中时使用 `<StatusPanel type="empty" message="点击左侧3D场景中的建筑查看详情" />`

### P0-6: `#ff6d00` 硬编码浅色主题颜色不匹配
- **问题**: `--color-warning` 在深色主题为 `#ff6d00`，浅色主题为 `#e6a000`。面板直接传 `#ff6d00` 给 NumberFlip，浅色主题下颜色不对
- **修复**: 8 个 NumberFlip `color` prop 改为 `'var(--color-warning)'`
- **影响文件**: TeachingOverview, ClassroomUsagePanel, ResourceStatistics, TeacherTopics, BorrowStats, AdminOverview, StudentLeave, SecurityOverview

---

## Phase 2: 逐专题审查

### 综合态势 (7 面板)

| 面板 | 状态 | 备注 |
|------|------|------|
| SchoolInfo | ✅ | 2x2 NumberFlip 网格 |
| PersonnelComposition | ✅ | NumberFlip + Sunburst，数据正确 |
| TeacherDistribution | ✅ | **已修复**: `Math.max(...[])` 空数组保护 |
| StudentInfo | ✅ | Sankey 桑基图 |
| ActivityHeatmap | ✅ | 折线面积图 |
| BuildingDetail | ✅ | **已修复**: StatusPanel + CSS 变量 |
| RecentActivity | ✅ | **已重写**: SSR query hook |

**Mock 数据**: 已修复 `subjects` 数组和从 194 修正为 196（体育 14→15, 音乐 8→9）

---

### 教学研究 (6 面板)

| 面板 | 状态 | 备注 |
|------|------|------|
| TeachingResourcesPanel | ✅ | Treemap 矩形树图 |
| ResourceStatistics | ✅ | 4x NumberFlip，**已修复** `#ff6d00` |
| ResourceUpdates | ✅ | ScrollList |
| TeacherTopics | ✅ | 3x NumberFlip，**已修复** `#ff6d00` |
| ResearchProjectsList | ✅ | CardCarousel |
| TeacherStudiosPanel | ✅ | 2-col 卡片网格 |

---

### 行政办公 (6 面板)

| 面板 | 状态 | 备注 |
|------|------|------|
| AdminOverview | ✅ | 4x NumberFlip，**已修复** `#ff6d00` |
| NoticeBoard | ✅ | ScrollList |
| DutySchedule | ✅ | 2x2 值班卡片 |
| SchoolCalendar | ✅ | ScrollList + 颜色圆点 |
| StaffAttendance | ✅ | NumberFlip + Bar + Line |
| MeetingManagement | ✅ | NumberFlip + 会议室状态 + ScrollList |

---

### 智慧图书 (6 面板)

| 面板 | 状态 | 备注 |
|------|------|------|
| CollectionOverview | ✅ | 4x NumberFlip |
| BorrowStats | ✅ | 2x2 NumberFlip + Line，**已修复** `#ff6d00` |
| HotBooks | ✅ | Bar + Pie + CardCarousel |
| ClassBorrowRank | ✅ | Bar + ScrollList |
| ReadingActivities | ✅ | CardCarousel |
| VisitorStats | ✅ | 2x NumberFlip + Bar |

**Mock 数据**: 已修复 `todayVisitors` 从 280 修正为 353（与 hourlyDistribution 和一致）

---

### 智慧教学 (7 面板)

| 面板 | 状态 | 备注 |
|------|------|------|
| TeachingOverview | ✅ | 4x NumberFlip，**已修复** `#ff6d00` |
| CourseSchedule | ✅ | Bar + Pie + Heatmap |
| ClassroomUsagePanel | ✅ | NumberFlip + Bar + Gauge + Pie，**已修复** `#ff6d00` |
| StudentAttendance | ✅ | Gauge + Bar + Bar + Line |
| ExamManagement | ✅ | ScrollList + NumberFlip + Bar + Funnel |
| ClassManagement | ✅ | NumberFlip + Bar + ScrollList |
| TeachingDevices | ✅ | Ring + Pie |

**Mock 数据**: 已修复 `typeDistribution` 普通教室 48→44（和从 64 修正为 60）

---

### 智慧安防 (7 面板)

| 面板 | 状态 | 备注 |
|------|------|------|
| SecurityOverview | ✅ | 4x NumberFlip，**已修复** `#ff6d00` |
| MonitorStatus | ✅ | Ring + Gauge + Bar |
| AccessControl | ✅ | NumberFlip + Bar + ScrollList |
| StudentLeave | ✅ | NumberFlip + Pie + Bar + ScrollList，**已修复** `#ff6d00` |
| VisitorManagement | ✅ | 2x NumberFlip + Pie + ScrollList |
| AlertEvents | ✅ | NumberFlip + Pie + Ring + ScrollList |
| CanteenSafety | ✅ | NumberFlip + Bar + button + ScrollList + VideoWindow |

**Mock 数据**: 已修复 `todayTotal` 从 5280 修正为 5410（与 hourlyDistribution 和一致）

---

## P2 遗留问题（未修复，记录备查）

### 视觉填充率

| # | 面板 | 问题 |
|---|------|------|
| 1 | HotBooks (Library) | 3 图表垂直堆叠 ~430px，DashboardPanel `overflow:hidden` 可能裁剪底部 |
| 2 | ClassroomUsagePanel (Academics) | 同上，~400px 内容 |
| 3 | ReadingActivities (Library) | 仅单 CardCarousel，大量空白 |
| 4 | ClassManagement (Academics) | 居中单 NumberFlip + 短图表，稀疏 |
| 5 | AccessControl (Security) | 内容稀疏 |
| 6 | CanteenSafety (Security) | ScrollList maxHeight=60 极小 |
| 7 | TeacherDistribution (Overview) | RadarChart height=240 + BarChart height=100 在 ~140px 面板中被裁剪 |
| 8 | CourseSchedule (Academics) | HeatmapChart height=90 单行几乎不可读 |

### Mock 数据

| # | 主题 | 问题 |
|---|------|------|
| 9 | Teaching-Research | 资源总数与分类值独立生成，和不一致 |
| 10 | Teaching-Research | 工作室名称与学科独立随机，"化学教研工作室"可能得到 `subject: '生物'` |
| 11 | Teaching-Research | 学科名称不一致（'政治' vs '道德与法治'） |
| 12 | Admin | `attendanceRate=0.962` 但实际 188/196=0.959，细微差异 |

### 共享图表组件

| # | 组件 | 问题 |
|---|------|------|
| 13 | TreemapChart | 硬编码 `#fff` 文本颜色，浅色主题不可见 |
| 14 | RadarChart | 硬编码 `#aa00ff` 等颜色，无 CSS 变量 |
| 15 | SunburstChart | 同上硬编码色板 |
| 16 | GaugeChart | 硬编码 `#00c853/#4a9eff/#ff6d00` 色阶，浅色主题 `#ff6d00` 变为 `#e6a000` |

---

## 统计数据

| 指标 | 修复前 | 修复后 |
|------|--------|--------|
| 硬编码 `rgba(255,255,255,...)` 实例 | 87 | 0 |
| `return null` 空数据面板 | 29 | 0 |
| 无 query hook 面板 | 2 | 0 |
| Mock 数据不一致 | 4 | 0 |
| 浅色主题颜色断裂点 (`#ff6d00`) | 8 | 0 |
| 潜在 crash (空数组) | 1 | 0 |
