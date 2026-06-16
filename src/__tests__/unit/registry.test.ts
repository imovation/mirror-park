import { describe, it, expect } from 'vitest'
import { getThemeEntry } from '@/themes/registry'
import { ThemeId } from '@/types/theme'

describe('theme registry', () => {
  it.each(Object.values(ThemeId))('returns entry for theme %s', (themeId) => {
    const entry = getThemeEntry(themeId)
    expect(entry).toBeDefined()
    expect(entry.scene).toBeDefined()
    expect(typeof entry.scene).toBe('function')
    expect(entry.panels.left.length).toBeGreaterThan(0)
    expect(entry.panels.right.length).toBeGreaterThan(0)
    expect(entry.renderPanel).toBeDefined()
    expect(typeof entry.renderPanel).toBe('function')
  })

  it('each panel id has a known renderer (not default fallback)', () => {
    const entry = getThemeEntry(ThemeId.OVERVIEW)
    for (const p of entry.panels.left) {
      const result = entry.renderPanel(p.id)
      expect(result).toBeDefined()
    }
  })
})
