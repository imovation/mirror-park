import { test, expect } from '@playwright/test'

test.describe('UI Theme Switch', () => {
  test('should toggle between dark and light mode', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('html')).toHaveAttribute('data-ui-theme', 'dark')

    await page.getByText('☀️ 亮色').click()
    await expect(page.locator('html')).toHaveAttribute('data-ui-theme', 'light')

    await page.getByText('🌙 暗色').click()
    await expect(page.locator('html')).toHaveAttribute('data-ui-theme', 'dark')
  })
})
