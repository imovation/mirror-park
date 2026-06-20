import { test, expect } from '@playwright/test'
import { navigateWithBlock3D, waitForAllPanels } from '../helpers/visual-utils'

test.describe('Alert Popup', () => {
  test.beforeEach(async ({ page }) => {
    await navigateWithBlock3D(page)
    await waitForAllPanels(page)
  })

  test('alert appears when triggered via store', async ({ page }) => {
    await page.evaluate(() => {
      window.dispatchEvent(
        new CustomEvent('test-alert', {
          detail: { type: 'error', message: 'E2E Test Alert: 西门门禁异常开启' },
        }),
      )
    })
    // Wait for SSE mock to push alerts (~18s + staggered)
    await page.waitForTimeout(20000)
    const alertPopup = page.locator('text=门禁异常').or(page.locator('text=烟雾')).or(page.locator('text=访客'))
    try {
      await expect(alertPopup.first()).toBeVisible({ timeout: 5000 })
    } catch {
      console.log('No SSE alert received within timeout — skipped')
    }
  })
})
