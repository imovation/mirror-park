import { test, expect } from '@playwright/test'

test.describe('Page Load', () => {
  test('should display title and bottom bar', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('智慧校园可视化平台').first()).toBeVisible()
    await expect(page.getByText(/v0\.2\.0/)).toBeVisible()
  })

  test('should show 3D scene container', async ({ page }) => {
    await page.goto('/')
    const scene = page.locator('#root canvas').first()
    await expect(scene).toBeAttached({ timeout: 10000 })
  })

  test('should render left panel data panels', async ({ page }) => {
    await page.goto('/')
    const panels = page.locator('text=学校概况')
    await expect(panels).toBeVisible({ timeout: 5000 })
  })

  test('should render right panel data panels', async ({ page }) => {
    await page.goto('/')
    const panels = page.locator('text=建筑详情')
    await expect(panels).toBeVisible({ timeout: 5000 })
  })
})
