import { test, expect } from '@playwright/test'
import {
  navigateWithBlock3D,
  navigateToTopic,
  waitForAllPanels,
  hide3DCanvas,
  toggleUITheme,
} from '../helpers/visual-utils'

test.describe('Topic: Teaching Research', () => {
  test.beforeEach(async ({ page }) => {
    await navigateWithBlock3D(page)
    await waitForAllPanels(page)
    await navigateToTopic(page, 'teaching-research')
    await waitForAllPanels(page)
    await hide3DCanvas(page)
  })

  test('dark theme — full page screenshot', async ({ page }) => {
    await expect(page).toHaveScreenshot('topic-teaching-research.png', { fullPage: false, threshold: 0.3 })
  })

  test('light theme — full page screenshot', async ({ page }) => {
    await toggleUITheme(page, 'light')
    await expect(page).toHaveScreenshot('topic-teaching-research-light.png', { fullPage: false, threshold: 0.3 })
  })

  test('all panel titles visible', async ({ page }) => {
    await expect(page.getByText('教学资源').first()).toBeVisible()
    await expect(page.getByText('资源统计').first()).toBeVisible()
    await expect(page.getByText('资源更新动态').first()).toBeVisible()
    await expect(page.getByText('教师课题').first()).toBeVisible()
    await expect(page.getByText('课题项目').first()).toBeVisible()
    await expect(page.getByText('名师工作室').first()).toBeVisible()
  })
})
