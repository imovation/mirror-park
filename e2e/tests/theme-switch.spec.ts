import { test, expect } from '@playwright/test'
import { navigateWithBlock3D } from '../helpers/visual-utils'

test.describe('UI Theme Switch', () => {
  test('should toggle between dark and light mode', async ({ page }) => {
    await navigateWithBlock3D(page)
    await expect(page.locator('html')).toHaveAttribute('data-ui-theme', 'dark')

    await page.getByTitle('切换亮色').click()
    await expect(page.locator('html')).toHaveAttribute('data-ui-theme', 'light')

    await page.getByTitle('切换暗色').click()
    await expect(page.locator('html')).toHaveAttribute('data-ui-theme', 'dark')
  })

  test('should keep theme consistent across topic switches', async ({ page }) => {
    await navigateWithBlock3D(page)
    await page.waitForTimeout(2000)

    await page.getByTitle('切换亮色').click()
    await expect(page.locator('html')).toHaveAttribute('data-ui-theme', 'light')

    const topics = ['教学研究', '智慧图书', '智慧安防']
    for (const topic of topics) {
      await page.getByText(topic, { exact: true }).click()
      await page.waitForTimeout(500)
      await expect(page.locator('html')).toHaveAttribute('data-ui-theme', 'light')
    }

    await page.getByTitle('切换暗色').click()
    await expect(page.locator('html')).toHaveAttribute('data-ui-theme', 'dark')
  })
})
