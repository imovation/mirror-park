import { test, expect } from '@playwright/test'
import {
  navigateWithBlock3D,
  navigateToTopic,
  waitForAllPanels,
  hide3DCanvas,
  toggleUITheme,
  collapsePanel,
} from '../helpers/visual-utils'

test.describe('Topic: Academics', () => {
  test.beforeEach(async ({ page }) => {
    await navigateWithBlock3D(page)
    await waitForAllPanels(page)
    await navigateToTopic(page, 'academics')
    await waitForAllPanels(page)
    await hide3DCanvas(page)
  })

  test('dark theme — full page screenshot', async ({ page }) => {
    await expect(page).toHaveScreenshot('topic-academics.png', { fullPage: false, threshold: 0.3 })
  })

  test('light theme — full page screenshot', async ({ page }) => {
    await toggleUITheme(page, 'light')
    await expect(page).toHaveScreenshot('topic-academics-light.png', { fullPage: false, threshold: 0.3 })
  })

  test('collapsible panels folded — screenshot', async ({ page }) => {
    await collapsePanel(page, '出勤排名与趋势')
    await collapsePanel(page, '空间使用率')
    await collapsePanel(page, '考试管理')
    await expect(page).toHaveScreenshot('topic-academics-collapsed.png', { fullPage: false, threshold: 0.3 })
  })

  test('all panel titles visible', async ({ page }) => {
    await expect(page.getByText('课表分布').first()).toBeVisible()
    await expect(page.getByText('教学设备').first()).toBeVisible()
    await expect(page.getByText('学生出勤概况').first()).toBeVisible()
    await expect(page.getByText('出勤排名与趋势').first()).toBeVisible()
    await expect(page.getByText('空间使用率').first()).toBeVisible()
    await expect(page.getByText('考试管理').first()).toBeVisible()
  })
})
