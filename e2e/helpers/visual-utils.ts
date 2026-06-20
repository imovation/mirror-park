// e2e/helpers/visual-utils.ts
import { type Page, expect } from '@playwright/test'

const TOPIC_LABELS: Record<string, string> = {
  overview: '综合态势',
  'teaching-research': '教学研究',
  admin: '行政办公',
  library: '智慧图书',
  academics: '智慧教学',
  security: '智慧安防',
}

const TOPIC_FIRST_PANEL: Record<string, string> = {
  overview: '教职工全景态势',
  'teaching-research': '教学资源',
  admin: '通知公告',
  library: '借阅统计',
  academics: '课表与空间调度',
  security: '监控状态',
}

export async function navigateToTopic(page: Page, topicId: string) {
  const label = TOPIC_LABELS[topicId]
  await page.getByText(label, { exact: true }).click()
  await page.waitForTimeout(600)
  const firstPanel = TOPIC_FIRST_PANEL[topicId]
  await expect(page.getByText(firstPanel).first()).toBeVisible({ timeout: 10000 })
}

export async function waitForAllPanels(page: Page) {
  await page.waitForTimeout(2000)
  const loading = page.getByText('加载中...')
  try {
    await loading.waitFor({ state: 'hidden', timeout: 10000 })
  } catch {
    // panels may have loaded synchronously
  }
}

export async function hide3DCanvas(page: Page) {
  await page.locator('#root canvas').first().evaluate((el) => {
    (el as HTMLElement).style.display = 'none'
  })
}

export async function toggleUITheme(page: Page, target: 'dark' | 'light') {
  const currentTheme = await page.locator('html').getAttribute('data-ui-theme')
  if (currentTheme === target) return
  if (target === 'light') {
    await page.getByText('☀️ 亮色').click()
  } else {
    await page.getByText('🌙 暗色').click()
  }
  await page.waitForTimeout(300)
  await expect(page.locator('html')).toHaveAttribute('data-ui-theme', target)
}

export async function collapsePanel(page: Page, panelTitle: string) {
  const panel = page.locator('h3', { hasText: panelTitle }).locator('..')
  const collapseBtn = panel.locator('button')
  const btnText = await collapseBtn.textContent()
  if (btnText?.includes('▼')) {
    await collapseBtn.click()
    await page.waitForTimeout(300)
  }
}

export async function expandPanel(page: Page, panelTitle: string) {
  const panel = page.locator('h3', { hasText: panelTitle }).locator('..')
  const collapseBtn = panel.locator('button')
  const btnText = await collapseBtn.textContent()
  if (btnText?.includes('▶')) {
    await collapseBtn.click()
    await page.waitForTimeout(300)
  }
}
