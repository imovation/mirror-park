import { useEffect, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useSSE } from '@/api/useSSEQuery'
import { parseFlexGrow } from '@/types/panel'
import { useWindowSize } from '@/hooks/useWindowSize'
import { useThemeStore } from '@/stores/useThemeStore'
import { useUIStore } from '@/stores/useUIStore'
import { useUIThemeStore } from '@/stores/useUIThemeStore'
import ScreenLayout from '@/components/layout/ScreenLayout'
import Header from '@/components/layout/Header/Header'
import SidePanel from '@/components/layout/SidePanel'
import Footer from '@/components/layout/Footer/Footer'
import DashboardPanel from '@/components/ui/DashboardPanel'
import AlertPopup from '@/components/ui/AlertPopup'
import ErrorBoundary from '@/components/layout/ErrorBoundary'
import SceneCanvas from '@/components/scene/SceneCanvas'
import { getThemeEntry } from '@/themes/registry'
import { applyThemeColor } from '@/config/themeColors'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

function FullscreenOverlay({ onEnter }: { onEnter: () => void }) {
  const [leaving, setLeaving] = useState(false)
  const isDark = useUIThemeStore((s) => s.uiTheme) === 'dark'
  if ((window as any).__E2E__) return null

  const handleClick = () => {
    setLeaving(true)
    document.documentElement.requestFullscreen().catch(() => {})
    setTimeout(() => onEnter(), 400)
  }

  return (
    <div
      onClick={handleClick}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        background: leaving ? 'transparent' : isDark
          ? 'rgba(0,0,0,0.55)'
          : 'rgba(255,255,255,0.55)',
        backdropFilter: leaving ? 'none' : 'blur(4px)',
        WebkitBackdropFilter: leaving ? 'none' : 'blur(4px)',
        transition: 'all 0.4s ease',
        userSelect: 'none',
      }}
    >
      <div style={{
        textAlign: 'center',
        opacity: leaving ? 0 : 1,
        transform: leaving ? 'scale(0.9)' : 'scale(1)',
        transition: 'all 0.4s ease',
      }}>
        <div style={{
          fontSize: 28,
          fontWeight: 300,
          color: 'var(--text-primary, #fff)',
          marginBottom: 12,
          letterSpacing: 4,
        }}>
          智慧校园可视化系统
        </div>
        <div style={{
          width: 40,
          height: 1,
          background: 'var(--theme-primary, #00d8ff)',
          margin: '0 auto 16px',
        }} />
        <div style={{
          fontSize: 14,
          color: 'var(--text-secondary, rgba(255,255,255,0.6))',
          letterSpacing: 2,
        }}>
          点击任意处进入全屏
        </div>
      </div>
    </div>
  )
}

function AppContent() {
  const [showOverlay, setShowOverlay] = useState(true)
  const currentTheme = useThemeStore((s) => s.currentTheme)
  const uiTheme = useUIThemeStore((s) => s.uiTheme)
  const { status: sseStatus } = useSSE()
  const { height: viewportHeight } = useWindowSize()
  const entry = getThemeEntry(currentTheme)
  const TopMetricsComponent = entry.topMetrics

  useEffect(() => {
    document.documentElement.setAttribute('data-ui-theme', uiTheme)
  }, [uiTheme])

  useEffect(() => {
    applyThemeColor(currentTheme)
  }, [currentTheme])

  useEffect(() => {
    console.log(`[SSE] ${sseStatus}`)
  }, [sseStatus])

  useEffect(() => {
    useUIStore.getState().clearAlerts()
  }, [currentTheme])

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <ErrorBoundary name="3D 场景" fallback={
          <div style={{
            width: '100%', height: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'var(--page-bg)', color: 'var(--text-tertiary)', fontSize: '0.875rem',
          }}>
            3D 场景不可用
          </div>
        }>
          <SceneCanvas>{entry.scene()}</SceneCanvas>
        </ErrorBoundary>
      </div>
      <div style={{ position: 'relative', zIndex: 1, width: '100%', height: '100%', pointerEvents: 'none' }}>
        <ScreenLayout
          topBar={<ErrorBoundary name="顶部导航"><Header /></ErrorBoundary>}
          topMetrics={TopMetricsComponent ? <TopMetricsComponent /> : undefined}
          leftPanel={
            <ErrorBoundary name="左侧面板" fallback={<div style={{ color: 'var(--text-tertiary)', textAlign: 'center', padding: 16 }}>左侧面板异常</div>}>
              <SidePanel>
                {entry.panels.left.map((p, idx) => (
                  <DashboardPanel
                      key={p.id}
                      title={p.title}
                      flexGrow={parseFlexGrow(p.height, viewportHeight)}
                      collapsible={p.collapsible}
                      collapsedSummary={p.collapsedSummary}
                      style={{ '--stagger-delay': `${idx * 0.08}s` } as React.CSSProperties}
                    >
                    <ErrorBoundary name={p.title}>
                      {entry.renderPanel(p.id)}
                    </ErrorBoundary>
                  </DashboardPanel>
                ))}
              </SidePanel>
            </ErrorBoundary>
          }
          rightPanel={
            <ErrorBoundary name="右侧面板" fallback={<div style={{ color: 'var(--text-tertiary)', textAlign: 'center', padding: 16 }}>右侧面板异常</div>}>
              <SidePanel>
                {entry.panels.right.map((p, idx) => (
                  <DashboardPanel
                      key={p.id}
                      title={p.title}
                      flexGrow={parseFlexGrow(p.height, viewportHeight)}
                      collapsible={p.collapsible}
                      collapsedSummary={p.collapsedSummary}
                      style={{ '--stagger-delay': `${idx * 0.08}s` } as React.CSSProperties}
                    >
                    <ErrorBoundary name={p.title}>
                      {entry.renderPanel(p.id)}
                    </ErrorBoundary>
                  </DashboardPanel>
                ))}
              </SidePanel>
            </ErrorBoundary>
          }
          bottomBar={<Footer status={sseStatus} />}
        />
      </div>
      {showOverlay && <FullscreenOverlay onEnter={() => setShowOverlay(false)} />}
    </div>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
      <AlertPopup />
    </QueryClientProvider>
  )
}

export default App
