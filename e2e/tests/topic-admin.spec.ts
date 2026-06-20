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

test.describe('Topic: Admin', () => {
  test.beforeEach(async ({ page }) => {
    await navigateWithBlock3D(page)
    await waitForAllPanels(page)
    await navigateToTopic(page, 'admin')
    await waitForAllPanels(page)
    await hide3DCanvas(page)
  })

  test('dark theme — full page screenshot', async ({ page }) => {
    await expect(page).toHaveScreenshot('topic-admin.png', { fullPage: false, threshold: 0.3 })
  })

  test('light theme — full page screenshot', async ({ page }) => {
    await toggleUITheme(page, 'light')
    await expect(page).toHaveScreenshot('topic-admin-light.png', { fullPage: false, threshold: 0.3 })
  })

  test('collapsible panel folded — screenshot', async ({ page }) => {
    await collapsePanel(page, '教职工考勤')
    await expect(page).toHaveScreenshot('topic-admin-collapsed.png', { fullPage: false, threshold: 0.3 })
  })

  test('all panel titles visible', async ({ page }) => {
    await expect(page.getByText('通知公告').first()).toBeVisible()
    await expect(page.getByText('值班安排').first()).toBeVisible()
    await expect(page.getByText('会议管理').first()).toBeVisible()
    await expect(page.getByText('校历日程').first()).toBeVisible()
    await expect(page.getByText('教职工考勤').first()).toBeVisible()
  })
})
