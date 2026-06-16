import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import ScreenLayout from '@/components/layout/ScreenLayout'
import TopBar from '@/components/layout/TopBar'
import LeftPanel from '@/components/layout/LeftPanel'
import RightPanel from '@/components/layout/RightPanel'
import BottomBar from '@/components/layout/BottomBar'
import DashboardPanel from '@/components/ui/DashboardPanel'
import SceneCanvas from '@/components/scene/SceneCanvas'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

function PlaceholderChild({ name }: { name: string }) {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '1px solid rgba(74, 158, 255, 0.2)',
      background: 'rgba(0, 0, 0, 0.3)',
      color: '#4a9eff',
      fontSize: '0.875rem',
    }}>
      {name}
    </div>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ScreenLayout
        topBar={<TopBar />}
        leftPanel={
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
        }
        scene={<SceneCanvas />}
        rightPanel={
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
        }
        bottomBar={<BottomBar />}
      />
    </QueryClientProvider>
  )
}

export default App
