import { test, expect } from '@playwright/test'
import { navigateWithBlock3D, waitForAllPanels, hide3DCanvas } from '../helpers/visual-utils'

const VIEWPORTS = [
  { name: 'desktop', width: 1920, height: 1080 },
  { name: 'tablet', width: 1024, height: 768 },
  { name: '1366x768', width: 1366, height: 768 },
  { name: '1600x900', width: 1600, height: 900 },
  { name: '2560x1440', width: 2560, height: 1440 },
  { name: '3840x2160', width: 3840, height: 2160 },
] as const

test.describe('Responsive Layout', () => {
  for (const vp of VIEWPORTS) {
    test(`${vp.name} ${vp.width}x${vp.height} — layout intact`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height })
      await navigateWithBlock3D(page)
      await waitForAllPanels(page)
      await hide3DCanvas(page)
      await expect(page.getByText('智慧校园可视化平台').first()).toBeVisible()
      await expect(page.getByText('教职工组成').first()).toBeVisible()
      await expect(page).toHaveScreenshot(`responsive-${vp.name}.png`, {
        fullPage: true,
        threshold: 0.3,
      })
    })
  }
})
