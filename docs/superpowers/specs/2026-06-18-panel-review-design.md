# 数据面板全面审查与优化 — 设计文档

## 概述

对 6 个专题共 39 个数据面板做全面审查：视觉/UX 一致性、代码质量/架构、数据完整性。采用"先横切共性，再逐专题"策略。

## 审查框架

### 第一阶段：横切共性审查（6 维度）

#### 1. 面板骨架统一

检查所有面板是否使用统一的 CSS 变量：
- 面板容器：`padding`、`border-radius`、`background`、`box-shadow`、`backdrop-filter`
- Header：`font-size`（`--font-size-lg`）、`font-weight`、颜色、图标尺寸
- 标题栏高度、标题/副标题间距

识别并修复硬编码值。

#### 2. StatusPanel 模式覆盖

| 现有状态 | 面板数 |
|---------|--------|
| loading/error/null（正确） | 34 |
| `<StatusPanel type="empty" />` | 1（TeachingResourcesPanel） |
| 无状态管理 | 3（BuildingDetail、RecentActivity、AlertEvents） |

修复：
- BuildingDetail：选中/未选中双态改为 StatusPanel 风格
- RecentActivity：接入 query hook 并用 StatusPanel
- AlertEvents：保持现状（hook 在 guard 前调用）已验证合规

#### 3. 图表颜色规范

- 所有 ECharts 图表需使用 `useChartTheme()` 返回的主题 token
- 检查是否有硬编码颜色字符串
- 语义化颜色：蓝=正常/在校、绿=完成/通过、橙=告警/警告、红=故障/离校、灰=离线/未知

#### 4. 重复代码抽取

高频模式及抽取方向：

| 模式 | 出现次数 | 抽取为 |
|------|---------|--------|
| NumberFlip×4 一行四列 | ~10 面板 | `<StatsRow items={[...]}>` |
| 双图表上下排列 | ~6 面板 | `<ChartPair top={...} bottom={...}>` |
| 标题 + 数字 + 图表 | ~8 面板 | 保持现有 DashboardPanel wrapper |
| ScrollList + 徽章状态 | ~5 面板 | 确保 ScrollList itemRenderer 统一 |

#### 5. 数字格式化

- 统一 `formatNumber()` 使用
- 单位标注一致性（人/个/间/册/%）
- 超大数缩写（≥10000 → 1.2万）

#### 6. Hook & 数据流规范

- queryKey 唯一性检查
- refetchInterval 与四级更新机制对齐
- SSE 事件是否正确 `queryClient.setQueryData`

### 第二阶段：逐专题审查

每个专题检查：
1. **视觉填充率**：内容是否撑满面板、图表尺寸、文字截断
2. **Mock 数据合理性**：数值范围可信、面板间数据一致
3. **交互功能**：联动、滚动、轮播、筛选
4. **边界情况**：0 值、极值、空列表、单条数据

## 问题分级

| 级别 | 含义 | 处理 |
|------|------|------|
| P0 | 阻塞问题（崩溃/白屏/数据错误） | 立即修复 |
| P1 | 重要问题（不一致/体验差） | 本轮修复 |
| P2 | 优化建议（锦上添花） | 可选修复 |

## 产出

1. `docs/superpowers/specs/panel-review-report.md` — 审查报告（按维度/专题列出所有问题+级别）
2. 代码修复 — 按 P0→P1→P2 顺序逐批提交
