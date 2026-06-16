import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import ScreenLayout from '@/components/layout/ScreenLayout'
import TopBar from '@/components/layout/TopBar'

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
        leftPanel={<PlaceholderChild name="LeftPanel" />}
        scene={<PlaceholderChild name="3D Scene" />}
        rightPanel={<PlaceholderChild name="RightPanel" />}
        bottomBar={<PlaceholderChild name="BottomBar" />}
      />
    </QueryClientProvider>
  )
}

export default App
