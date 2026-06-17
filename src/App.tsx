import { useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useThemeStore } from '@/stores/useThemeStore'
import { useUIThemeStore } from '@/stores/useUIThemeStore'
import ScreenLayout from '@/components/layout/ScreenLayout'
import TopBar from '@/components/layout/TopBar'
import LeftPanel from '@/components/layout/LeftPanel'
import RightPanel from '@/components/layout/RightPanel'
import BottomBar from '@/components/layout/BottomBar'
import DashboardPanel from '@/components/ui/DashboardPanel'
import AlertPopup from '@/components/ui/AlertPopup'
import ErrorBoundary from '@/components/layout/ErrorBoundary'
import SceneCanvas from '@/components/scene/SceneCanvas'
import { getThemeEntry } from '@/themes/registry'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

function App() {
  const currentTheme = useThemeStore((s) => s.currentTheme)
  const uiTheme = useUIThemeStore((s) => s.uiTheme)
  const entry = getThemeEntry(currentTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-ui-theme', uiTheme)
  }, [uiTheme])

  return (
    <QueryClientProvider client={queryClient}>
      <ScreenLayout
        topBar={<ErrorBoundary name="顶部导航"><TopBar /></ErrorBoundary>}
        leftPanel={
          <ErrorBoundary name="左侧面板" fallback={<div style={{ color: '#6b7280', textAlign: 'center', padding: 16 }}>左侧面板异常</div>}>
            <LeftPanel>
              {entry.panels.left.map((p) => (
                <DashboardPanel key={p.id} title={p.title}>
                  <ErrorBoundary name={p.title}>
                    {entry.renderPanel(p.id)}
                  </ErrorBoundary>
                </DashboardPanel>
              ))}
            </LeftPanel>
          </ErrorBoundary>
        }
        scene={
          <ErrorBoundary name="3D 场景" fallback={
            <div style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#0a1628',
              color: '#6b7280',
              fontSize: '0.875rem',
            }}>
              3D 场景不可用
            </div>
          }>
            <SceneCanvas>{entry.scene()}</SceneCanvas>
          </ErrorBoundary>
        }
        rightPanel={
          <ErrorBoundary name="右侧面板" fallback={<div style={{ color: '#6b7280', textAlign: 'center', padding: 16 }}>右侧面板异常</div>}>
            <RightPanel>
              {entry.panels.right.map((p) => (
                <DashboardPanel key={p.id} title={p.title}>
                  <ErrorBoundary name={p.title}>
                    {entry.renderPanel(p.id)}
                  </ErrorBoundary>
                </DashboardPanel>
              ))}
            </RightPanel>
          </ErrorBoundary>
        }
        bottomBar={<BottomBar />}
      />
      <AlertPopup />
    </QueryClientProvider>
  )
}

export default App
