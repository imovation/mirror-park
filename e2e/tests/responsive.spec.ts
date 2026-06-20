import { test, expect } from '@playwright/test'
import { waitForAllPanels, hide3DCanvas } from '../helpers/visual-utils'

test.describe('Responsive Layout', () => {
  test('Desktop 1920x1080 — layout intact', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.goto('/')
    await waitForAllPanels(page)
    await hide3DCanvas(page)
    await expect(page.getByText('智慧校园可视化平台').first()).toBeVisible()
    await expect(page.getByText('教职工全景态势').first()).toBeVisible()
    await expect(page).toHaveScreenshot('responsive-desktop.png', {
      fullPage: true,
      threshold: 0.3,
    })
  })

  test('Tablet 1024x768 — layout intact', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 })
    await page.goto('/')
    await waitForAllPanels(page)
    await hide3DCanvas(page)
    await expect(page.getByText('智慧校园可视化平台').first()).toBeVisible()
    await expect(page).toHaveScreenshot('responsive-tablet.png', {
      fullPage: true,
      threshold: 0.3,
    })
  })
})
