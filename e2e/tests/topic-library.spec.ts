import { test, expect } from '@playwright/test'
import {
  navigateToTopic,
  waitForAllPanels,
  hide3DCanvas,
  toggleUITheme,
  collapsePanel,
} from '../helpers/visual-utils'

test.describe('Topic: Library', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await waitForAllPanels(page)
    await navigateToTopic(page, 'library')
    await waitForAllPanels(page)
    await hide3DCanvas(page)
  })

  test('dark theme — full page screenshot', async ({ page }) => {
    await expect(page).toHaveScreenshot('topic-library.png', { fullPage: false, threshold: 0.3 })
  })

  test('light theme — full page screenshot', async ({ page }) => {
    await toggleUITheme(page, 'light')
    await expect(page).toHaveScreenshot('topic-library-light.png', { fullPage: false, threshold: 0.3 })
  })

  test('collapsible panel folded — screenshot', async ({ page }) => {
    await collapsePanel(page, '图书借阅多维排行')
    await expect(page).toHaveScreenshot('topic-library-collapsed.png', { fullPage: false, threshold: 0.3 })
  })

  test('all panel titles visible', async ({ page }) => {
    await expect(page.getByText('借阅统计').first()).toBeVisible()
    await expect(page.getByText('图书借阅多维排行').first()).toBeVisible()
    await expect(page.getByText('阅读活动').first()).toBeVisible()
    await expect(page.getByText('入馆统计').first()).toBeVisible()
  })
})
