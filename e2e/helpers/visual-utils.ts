// e2e/helpers/visual-utils.ts
import { type Page, expect } from '@playwright/test'

const TOPIC_LABELS: Record<string, string> = {
  overview: '综合态势',
  'teaching-research': '教学研究',
  admin: '行政办公',
  library: '智慧图书',
  academics: '智慧教学',
  security: '智慧安防',
  logistics: '智慧后勤',
}

const TOPIC_FIRST_PANEL: Record<string, string> = {
  overview: '教职工组成',
  'teaching-research': '教学资源',
  admin: '通知公告',
  library: '借阅统计',
  academics: '课表分布',
  security: '监控状态',
  logistics: '学生请假管理',
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

export async function navigateWithBlock3D(page: Page) {
  await page.addInitScript(() => {
    ;(window as any).__E2E__ = true
    const orig = HTMLCanvasElement.prototype.getContext
    HTMLCanvasElement.prototype.getContext = function (
      this: HTMLCanvasElement,
      type: string,
      ...args: unknown[]
    ) {
      if (type === 'webgl' || type === 'webgl2' || type === 'experimental-webgl') return null
      return orig.apply(this, [type as any, ...args])
    }
  })
  await page.goto('/')
}

export async function dismissOverlay(page: Page) {
  // no-op: handled via __E2E__ flag now
}

export async function hide3DCanvas(page: Page) {
  await page.addStyleTag({ content: 'canvas { display: none !important; }' })
  // Stop SSE mock intervals that push data updates
  await page.evaluate(() => {
    const maxId = window.setTimeout(() => {}, 0)
    // Clear all intervals (SSE mock uses setInterval for data pushes)
    for (let i = 1; i <= maxId; i++) {
      window.clearInterval(i)
    }
    // Stop requestAnimationFrame-based animations
    window.requestAnimationFrame = (() => 0) as typeof window.requestAnimationFrame
  })
}

export async function toggleUITheme(page: Page, target: 'dark' | 'light') {
  const currentTheme = await page.locator('html').getAttribute('data-ui-theme')
  if (currentTheme === target) return
  if (target === 'light') {
    await page.getByTitle('切换亮色').click()
  } else {
    await page.getByTitle('切换暗色').click()
  }
  await page.waitForTimeout(300)
  await expect(page.locator('html')).toHaveAttribute('data-ui-theme', target)
}

export async function collapsePanel(page: Page, panelTitle: string) {
  const panel = page.locator('h3', { hasText: panelTitle }).locator('..')
  const collapseBtn = panel.getByRole('button')
  const btnText = await collapseBtn.textContent()
  if (btnText?.includes('▼')) {
    await collapseBtn.click({ force: true })
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
