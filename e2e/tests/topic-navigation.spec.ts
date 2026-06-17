import { test, expect } from '@playwright/test'

const topicPanel: Record<string, string> = {
  '教学研究': '教学资源',
  '行政办公': '办公概况',
  '智慧图书': '馆藏概况',
  '智慧教学': '教学概况',
  '智慧安防': '安防概况',
}

test.describe('Topic Navigation', () => {
  test('should switch between all 6 topics', async ({ page }) => {
    await page.goto('/')

    for (const [topic, panelTitle] of Object.entries(topicPanel)) {
      await page.getByText(topic, { exact: true }).click()
      await page.waitForTimeout(500)
      await expect(page.getByText(panelTitle).first()).toBeVisible({ timeout: 5000 })
    }
  })

  test('should keep scene canvas mounted after topic switch', async ({ page }) => {
    await page.goto('/')
    const canvas = page.locator('#root canvas').first()

    await page.getByText('行政办公').click()
    await page.waitForTimeout(500)
    await expect(canvas).toBeAttached()

    await page.getByText('智慧安防').click()
    await page.waitForTimeout(500)
    await expect(canvas).toBeAttached()
  })
})
