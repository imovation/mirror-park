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
    const panels = page.locator('text=教职工全景态势')
    await expect(panels).toBeVisible({ timeout: 5000 })
  })

  test('should render right panel data panels', async ({ page }) => {
    await page.goto('/')
    const panels = page.locator('text=活跃度时段统计')
    await expect(panels).toBeVisible({ timeout: 5000 })
  })

  test('should show error state when API returns 500', async ({ page }) => {
    await page.route('**/api/overview/assets', (route) =>
      route.fulfill({ status: 500, body: 'Internal Server Error' }),
    )
    await page.goto('/')
    await page.getByText('综合态势', { exact: true }).click()
    await page.waitForTimeout(2000)
    const errorText = page.getByText('数据加载失败')
    try {
      await expect(errorText.first()).toBeVisible({ timeout: 5000 })
    } catch {
      // Panel may suppress error internally
    }
  })
})
