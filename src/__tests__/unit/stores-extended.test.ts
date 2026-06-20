import { describe, it, expect, beforeEach } from 'vitest'
import { useSceneStore } from '@/stores/useSceneStore'
import { useUIStore } from '@/stores/useUIStore'
import { useThemeStore } from '@/stores/useThemeStore'
import { useUIThemeStore } from '@/stores/useUIThemeStore'
import { ThemeId } from '@/types/theme'

describe('useSceneStore', () => {
  beforeEach(() => {
    useSceneStore.setState({
      cameraTarget: [0, 0, 0],
      selectedObjectId: null,
      isSceneLoaded: false,
      flyToRequest: null,
    })
  })

  it('selects and deselects an object', () => {
    useSceneStore.getState().selectObject('chongde')
    expect(useSceneStore.getState().selectedObjectId).toBe('chongde')
    useSceneStore.getState().selectObject(null)
    expect(useSceneStore.getState().selectedObjectId).toBeNull()
  })

  it('sets scene loaded flag', () => {
    useSceneStore.getState().setSceneLoaded(true)
    expect(useSceneStore.getState().isSceneLoaded).toBe(true)
  })

  it('requests flyTo with position and lookAt', () => {
    useSceneStore.getState().requestFlyTo([10, 15, 20], [5, 5, 5])
    const req = useSceneStore.getState().flyToRequest
    expect(req).not.toBeNull()
    expect(req!.position).toEqual([10, 15, 20])
    expect(req!.lookAt).toEqual([5, 5, 5])
    expect(req!.requestId).toBeGreaterThan(0)
  })
})

describe('useUIStore', () => {
  beforeEach(() => {
    useUIStore.setState({ modalStack: [], alertQueue: [] })
  })

  it('adds and dismisses alerts', () => {
    useUIStore.getState().addAlert({ type: 'warning', message: 'Test alert' })
    expect(useUIStore.getState().alertQueue).toHaveLength(1)
    expect(useUIStore.getState().alertQueue[0].type).toBe('warning')
    expect(useUIStore.getState().alertQueue[0].message).toBe('Test alert')

    const id = useUIStore.getState().alertQueue[0].id
    useUIStore.getState().dismissAlert(id)
    expect(useUIStore.getState().alertQueue).toHaveLength(0)
  })

  it('adds multiple alerts and keeps order', () => {
    useUIStore.getState().addAlert({ type: 'error', message: 'First' })
    useUIStore.getState().addAlert({ type: 'info', message: 'Second' })
    expect(useUIStore.getState().alertQueue).toHaveLength(2)
    expect(useUIStore.getState().alertQueue[0].type).toBe('error')
    expect(useUIStore.getState().alertQueue[1].type).toBe('info')
  })

  it('manages modal stack', () => {
    useUIStore.getState().pushModal('modal-1')
    useUIStore.getState().pushModal('modal-2')
    expect(useUIStore.getState().modalStack).toEqual(['modal-1', 'modal-2'])
    useUIStore.getState().popModal()
    expect(useUIStore.getState().modalStack).toEqual(['modal-1'])
    useUIStore.getState().clearModals()
    expect(useUIStore.getState().modalStack).toEqual([])
  })
})

describe('useThemeStore', () => {
  beforeEach(() => {
    useThemeStore.setState({ currentTheme: ThemeId.OVERVIEW, isTransitioning: false })
  })

  it('finishes transition', () => {
    useThemeStore.setState({ isTransitioning: true })
    useThemeStore.getState().finishTransition()
    expect(useThemeStore.getState().isTransitioning).toBe(false)
  })

  it('has all 6 themes in allThemes', () => {
    const themes = useThemeStore.getState().allThemes
    expect(themes).toHaveLength(6)
    expect(themes.map(t => t.id)).toContain(ThemeId.OVERVIEW)
    expect(themes.map(t => t.id)).toContain(ThemeId.SECURITY)
  })
})

// ======= useUIThemeStore =======
describe('useUIThemeStore', () => {
  beforeEach(() => {
    useUIThemeStore.setState({ uiTheme: 'dark' })
  })

  it('starts with dark theme', () => {
    const theme = useUIThemeStore.getState().uiTheme
    expect(theme).toBe('dark')
  })

  it('toggleUITheme switches dark→light→dark', () => {
    const store = useUIThemeStore.getState()
    store.toggleUITheme()
    expect(useUIThemeStore.getState().uiTheme).toBe('light')
    useUIThemeStore.getState().toggleUITheme()
    expect(useUIThemeStore.getState().uiTheme).toBe('dark')
  })

  it('setUITheme explicitly sets theme', () => {
    useUIThemeStore.getState().setUITheme('light')
    expect(useUIThemeStore.getState().uiTheme).toBe('light')
    useUIThemeStore.getState().setUITheme('dark')
    expect(useUIThemeStore.getState().uiTheme).toBe('dark')
  })
})
