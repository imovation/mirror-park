import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import ScreenLayout from '@/components/layout/ScreenLayout'
import TopBar from '@/components/layout/TopBar'
import LeftPanel from '@/components/layout/LeftPanel'
import RightPanel from '@/components/layout/RightPanel'
import BottomBar from '@/components/layout/BottomBar'
import DashboardPanel from '@/components/ui/DashboardPanel'
import ErrorBoundary from '@/components/layout/ErrorBoundary'
import SceneCanvas from '@/components/scene/SceneCanvas'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ScreenLayout
        topBar={<ErrorBoundary name="顶部导航"><TopBar /></ErrorBoundary>}
        leftPanel={
          <ErrorBoundary name="左侧面板" fallback={<div style={{ color: '#6b7280', textAlign: 'center', padding: 16 }}>左侧面板异常</div>}>
            <LeftPanel>
              <DashboardPanel title="面板左-1">
                <span style={{ color: '#6b7280', fontSize: '0.75rem' }}>数据面板内容</span>
              </DashboardPanel>
              <DashboardPanel title="面板左-2">
                <span style={{ color: '#6b7280', fontSize: '0.75rem' }}>数据面板内容</span>
              </DashboardPanel>
              <DashboardPanel title="面板左-3">
                <span style={{ color: '#6b7280', fontSize: '0.75rem' }}>数据面板内容</span>
              </DashboardPanel>
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
            <SceneCanvas />
          </ErrorBoundary>
        }
        rightPanel={
          <ErrorBoundary name="右侧面板" fallback={<div style={{ color: '#6b7280', textAlign: 'center', padding: 16 }}>右侧面板异常</div>}>
            <RightPanel>
              <DashboardPanel title="面板右-1">
                <span style={{ color: '#6b7280', fontSize: '0.75rem' }}>数据面板内容</span>
              </DashboardPanel>
              <DashboardPanel title="面板右-2">
                <span style={{ color: '#6b7280', fontSize: '0.75rem' }}>数据面板内容</span>
              </DashboardPanel>
              <DashboardPanel title="面板右-3">
                <span style={{ color: '#6b7280', fontSize: '0.75rem' }}>数据面板内容</span>
              </DashboardPanel>
            </RightPanel>
          </ErrorBoundary>
        }
        bottomBar={<BottomBar />}
      />
    </QueryClientProvider>
  )
}

export default App
