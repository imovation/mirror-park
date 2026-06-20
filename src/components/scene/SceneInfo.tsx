export default function SceneInfo() {
  return (
    <div style={{
      position: 'absolute',
      bottom: 12,
      left: 12,
      background: 'var(--panel-bg)',
      border: '1px solid var(--border)',
      borderRadius: 6,
      padding: '8px 14px',
      color: 'var(--text-secondary)',
      fontSize: 'var(--font-size-xs)',
      pointerEvents: 'none',
      zIndex: 10,
    }}>
      <span>鼠标拖拽旋转 | 滚轮缩放 | 右键平移 | 点击建筑查看详情</span>
    </div>
  )
}
