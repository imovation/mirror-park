import { test, expect } from '@playwright/test'
import {
  navigateWithBlock3D,
  waitForAllPanels,
  hide3DCanvas,
  toggleUITheme,
} from '../helpers/visual-utils'

test.describe('Header & Footer', () => {
  test.beforeEach(async ({ page }) => {
    await navigateWithBlock3D(page)
    await waitForAllPanels(page)
    await hide3DCanvas(page)
  })

  test('dark theme — viewport screenshot', async ({ page }) => {
    await expect(page).toHaveScreenshot('header-footer.png', { fullPage: false, threshold: 0.3 })
  })

  test('light theme — viewport screenshot', async ({ page }) => {
    await toggleUITheme(page, 'light')
    await expect(page).toHaveScreenshot('header-footer-light.png', { fullPage: false, threshold: 0.3 })
  })

  test('header controls visible', async ({ page }) => {
    await expect(page.getByTitle('切换亮色').or(page.getByTitle('切换暗色'))).toBeVisible()
    await expect(page.getByTitle('切换夜景').or(page.getByTitle('切换白天'))).toBeVisible()
    await expect(page.getByTitle('全屏显示')).toBeVisible()
    await expect(page.getByTitle('关闭背景音乐').or(page.getByTitle('开启背景音乐'))).toBeVisible()
  })

  test('footer navigation items visible', async ({ page }) => {
    await expect(page.getByText('综合态势').first()).toBeVisible()
    await expect(page.getByText('教学研究').first()).toBeVisible()
    await expect(page.getByText('行政办公').first()).toBeVisible()
    await expect(page.getByText('智慧图书').first()).toBeVisible()
    await expect(page.getByText('智慧教学').first()).toBeVisible()
    await expect(page.getByText('智慧安防').first()).toBeVisible()
    await expect(page.getByText('智慧后勤').first()).toBeVisible()
  })
})
