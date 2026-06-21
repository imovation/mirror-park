import { useUIThemeStore } from '@/stores/useUIThemeStore'

export default function SceneInfo() {
  const uiTheme = useUIThemeStore((s) => s.uiTheme)
  return (
    <div style={{
      position: 'absolute',
      bottom: 4,
      left: '50%',
      transform: 'translateX(-50%)',
      color: 'var(--text-muted)',
      fontSize: 'var(--font-size-xs)',
      textShadow: uiTheme === 'dark' ? '0 1px 2px rgba(0,0,0,0.3)' : 'none',
      pointerEvents: 'none',
      zIndex: 10,
      whiteSpace: 'nowrap',
    }}>
      鼠标拖拽旋转 | 滚轮缩放 | 右键平移 | 点击建筑查看详情
    </div>
  )
}
