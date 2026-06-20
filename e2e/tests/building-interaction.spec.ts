import { test, expect } from '@playwright/test'

test.describe('Building Interaction', () => {
  test('should show building labels in 3D scene', async ({ page }) => {
    await page.goto('/')
    const buildingLabel = page.locator('text=崇智楼').first()
    await expect(buildingLabel).toBeVisible({ timeout: 10000 })
  })
})
