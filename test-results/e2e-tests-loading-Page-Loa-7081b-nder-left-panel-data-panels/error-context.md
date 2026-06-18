# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e/tests/loading.spec.ts >> Page Load >> should render left panel data panels
- Location: e2e/tests/loading.spec.ts:16:3

# Error details

```
Error: page.goto: Protocol error (Page.navigate): Cannot navigate to invalid URL
Call log:
  - navigating to "/", waiting until "load"

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test'
  2  | 
  3  | test.describe('Page Load', () => {
  4  |   test('should display title and bottom bar', async ({ page }) => {
  5  |     await page.goto('/')
  6  |     await expect(page.getByText('智慧校园可视化平台').first()).toBeVisible()
  7  |     await expect(page.getByText(/v0\.2\.0/)).toBeVisible()
  8  |   })
  9  | 
  10 |   test('should show 3D scene container', async ({ page }) => {
  11 |     await page.goto('/')
  12 |     const scene = page.locator('#root canvas').first()
  13 |     await expect(scene).toBeAttached({ timeout: 10000 })
  14 |   })
  15 | 
  16 |   test('should render left panel data panels', async ({ page }) => {
> 17 |     await page.goto('/')
     |                ^ Error: page.goto: Protocol error (Page.navigate): Cannot navigate to invalid URL
  18 |     const panels = page.locator('text=学校概况')
  19 |     await expect(panels).toBeVisible({ timeout: 5000 })
  20 |   })
  21 | 
  22 |   test('should render right panel data panels', async ({ page }) => {
  23 |     await page.goto('/')
  24 |     const panels = page.locator('text=建筑详情')
  25 |     await expect(panels).toBeVisible({ timeout: 5000 })
  26 |   })
  27 | })
  28 | 
```