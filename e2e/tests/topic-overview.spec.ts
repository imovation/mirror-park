import { test, expect } from '@playwright/test'
import {
  navigateWithBlock3D,
  navigateToTopic,
  waitForAllPanels,
  hide3DCanvas,
  toggleUITheme,
  collapsePanel,
  expandPanel,
} from '../helpers/visual-utils'

test.describe('Topic: Overview', () => {
  test.beforeEach(async ({ page }) => {
    await navigateWithBlock3D(page)
    await waitForAllPanels(page)
    await navigateToTopic(page, 'overview')
    await waitForAllPanels(page)
    await hide3DCanvas(page)
  })

  test('dark theme — full page screenshot', async ({ page }) => {
    await expect(page).toHaveScreenshot('topic-overview.png', { fullPage: false, threshold: 0.3 })
  })

  test('light theme — full page screenshot', async ({ page }) => {
    await toggleUITheme(page, 'light')
    await expect(page).toHaveScreenshot('topic-overview-light.png', { fullPage: false, threshold: 0.3 })
  })

  test('all panel titles visible', async ({ page }) => {
    await expect(page.getByText('教职工组成').first()).toBeVisible()
    await expect(page.getByText('教职工结构').first()).toBeVisible()
    await expect(page.getByText('学生基础信息').first()).toBeVisible()
    await expect(page.getByText('活跃度时段统计').first()).toBeVisible()
    await expect(page.getByText('资产概况').first()).toBeVisible()
    await expect(page.getByText('功能室分布').first()).toBeVisible()
  })
})
