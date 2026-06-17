# Playwright E2E 测试 — Design Doc

## Overview

添加 Playwright E2E 测试，覆盖核心演示流程：6 专题切换、3D 场景交互、数据面板渲染、告警弹窗、主题切换。确保所有关键功能在 Chrome 中正常工作。

## Scope

### 核心测试用例

| # | 测试 | 说明 |
|---|------|------|
| 1 | 页面加载 | 标题显示、3D 场景容器可见、左侧面板有数据 |
| 2 | 6 专题切换 | 点击每个专题 Tab，确认面板内容切换，3D 场景镜头过渡 |
| 3 | 3D 建筑点击 | 点击建筑 → 右侧出现建筑详情面板 |
| 4 | 数据面板渲染 | 每个面板有数据（非 loading/error 状态） |
| 5 | UI 主题切换 | 点击亮色/暗色按钮，确认 body 背景色变化 |
| 6 | 告警弹窗 | 告警出现并可点击关闭 |
| 7 | 响应式布局 | 在 1920×1080 下布局正常 |

### 非本次范围
- 3D 场景渲染输出（Playwright 截图对比不稳定，后续可按需加）
- MSW mock 数据验证（单元测试覆盖）
- 性能测试

## Setup

```bash
pnpm add -D @playwright/test
npx playwright install chromium
```

## 文件结构

```
e2e/
├── playwright.config.ts
├── tests/
│   ├── loading.spec.ts
│   ├── theme-switch.spec.ts
│   ├── topic-navigation.spec.ts
│   └── building-interaction.spec.ts
└── global-setup.ts
```

## 测试策略

- 使用 `webServer` 配置自动启动 `pnpm dev`
- Mock 数据通过 MSW 自动生效（开发模式默认开启）
- 每个 spec 文件一个独立的测试用例组
- 使用 `test.describe` 组织相关测试

## Verification

- `pnpm exec playwright test` passes
- `pnpm build` still works
- All 35 unit tests still pass
