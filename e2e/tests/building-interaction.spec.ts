import { test, expect } from '@playwright/test'

test.describe('Building Interaction', () => {
  test('should show building detail panel', async ({ page }) => {
    await page.goto('/')
    const buildingDetail = page.locator('text=建筑详情').first()
    await expect(buildingDetail).toBeVisible({ timeout: 10000 })
  })
})
