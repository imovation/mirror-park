import { useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useSSE } from '@/api/useSSEQuery'
import { useThemeStore } from '@/stores/useThemeStore'
import { useUIStore } from '@/stores/useUIStore'
import { useUIThemeStore } from '@/stores/useUIThemeStore'
import ScreenLayout from '@/components/layout/ScreenLayout'
import TopBar from '@/components/layout/TopBar'
import SidePanel from '@/components/layout/SidePanel'
import BottomBar from '@/components/layout/BottomBar'
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

function AppContent() {
  const currentTheme = useThemeStore((s) => s.currentTheme)
  const uiTheme = useUIThemeStore((s) => s.uiTheme)
  const { status: sseStatus } = useSSE()
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
          <SceneCanvas key={currentTheme}>{entry.scene()}</SceneCanvas>
        </ErrorBoundary>
      </div>
      <div style={{ position: 'relative', zIndex: 1, width: '100%', height: '100%', pointerEvents: 'none' }}>
        <ScreenLayout
          topBar={<ErrorBoundary name="顶部导航"><TopBar /></ErrorBoundary>}
          topMetrics={TopMetricsComponent ? <TopMetricsComponent /> : undefined}
          leftPanel={
            <ErrorBoundary name="左侧面板" fallback={<div style={{ color: 'var(--text-tertiary)', textAlign: 'center', padding: 16 }}>左侧面板异常</div>}>
              <SidePanel>
                {entry.panels.left.map((p, idx) => (
                  <DashboardPanel
                      key={p.id}
                      title={p.title}
                      flexGrow={p.height === 'flex-2' ? 2 : p.height === 'flex-3' ? 3 : 1}
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
                      flexGrow={p.height === 'flex-2' ? 2 : p.height === 'flex-3' ? 3 : 1}
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
          bottomBar={<BottomBar status={sseStatus} />}
        />
      </div>
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
