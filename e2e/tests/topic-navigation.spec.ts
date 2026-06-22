import { test, expect } from '@playwright/test'
import { navigateWithBlock3D, navigateToTopic, waitForAllPanels } from '../helpers/visual-utils'

const topicPanel: Record<string, string> = {
  '综合态势': '教职工组成',
  '教学研究': '教学资源',
  '行政办公': '通知公告',
  '智慧图书': '借阅统计',
  '智慧教学': '课表分布',
  '智慧安防': '监控状态',
  '智慧后勤': '学生请假管理',
}

test.describe('Topic Navigation', () => {
  test('should switch between all 7 topics', async ({ page }) => {
    await navigateWithBlock3D(page)

    for (const [topic, panelTitle] of Object.entries(topicPanel)) {
      await page.getByText(topic, { exact: true }).click()
      await page.waitForTimeout(500)
      await expect(page.getByText(panelTitle).first()).toBeVisible({ timeout: 5000 })
    }
  })

  test('should keep scene canvas mounted after topic switch', async ({ page }) => {
    await navigateWithBlock3D(page)
    const canvas = page.locator('#root canvas').first()

    await page.getByText('行政办公').click()
    await page.waitForTimeout(500)
    await expect(canvas).toBeAttached()

    await page.getByText('智慧安防').click()
    await page.waitForTimeout(500)
    await expect(canvas).toBeAttached()
  })

  test('should collapse and expand a collapsible panel', async ({ page }) => {
    await navigateWithBlock3D(page)
    await waitForAllPanels(page)
    await navigateToTopic(page, 'library')
    await waitForAllPanels(page)
    const bookRankPanel = page.getByText('图书借阅排行').first()
    await expect(bookRankPanel).toBeVisible({ timeout: 5000 })

    const collapseBtn = page.locator('h3', { hasText: '图书借阅排行' }).locator('..').locator('button')
    const btnText = await collapseBtn.textContent()
    if (btnText?.includes('▼')) {
      await collapseBtn.click()
      await page.waitForTimeout(300)
      await expect(page.getByText('热门图书、班级排行')).toBeVisible()
      await collapseBtn.click()
      await page.waitForTimeout(300)
    }
  })
})
