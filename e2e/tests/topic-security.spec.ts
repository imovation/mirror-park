import { test, expect } from '@playwright/test'
import {
  navigateWithBlock3D,
  navigateToTopic,
  waitForAllPanels,
  hide3DCanvas,
  toggleUITheme,
  collapsePanel,
} from '../helpers/visual-utils'

test.describe('Topic: Security', () => {
  test.beforeEach(async ({ page }) => {
    await navigateWithBlock3D(page)
    await waitForAllPanels(page)
    await navigateToTopic(page, 'security')
    await waitForAllPanels(page)
    await hide3DCanvas(page)
  })

  test('dark theme — full page screenshot', async ({ page }) => {
    await expect(page).toHaveScreenshot('topic-security.png', { fullPage: false, threshold: 0.3 })
  })

  test('light theme — full page screenshot', async ({ page }) => {
    await toggleUITheme(page, 'light')
    await expect(page).toHaveScreenshot('topic-security-light.png', { fullPage: false, threshold: 0.3 })
  })

  test('collapsible panel folded — screenshot', async ({ page }) => {
    await collapsePanel(page, '学生请假管理')
    await expect(page).toHaveScreenshot('topic-security-collapsed.png', { fullPage: false, threshold: 0.3 })
  })

  test('all panel titles visible', async ({ page }) => {
    await expect(page.getByText('监控状态').first()).toBeVisible()
    await expect(page.getByText('门禁管理').first()).toBeVisible()
    await expect(page.getByText('学生请假管理').first()).toBeVisible()
    await expect(page.getByText('访客管理').first()).toBeVisible()
    await expect(page.getByText('告警事件').first()).toBeVisible()
    await expect(page.getByText('食堂安全').first()).toBeVisible()
  })
})
