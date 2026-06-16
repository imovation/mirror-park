export default function SceneInfo() {
  return (
    <div style={{
      position: 'absolute',
      bottom: 12,
      left: 12,
      background: 'rgba(0,0,0,0.6)',
      border: '1px solid rgba(74,158,255,0.2)',
      borderRadius: 6,
      padding: '8px 14px',
      color: 'rgba(255,255,255,0.5)',
      fontSize: 11,
      pointerEvents: 'none',
      zIndex: 10,
    }}>
      <span>鼠标拖拽旋转 | 滚轮缩放 | 右键平移 | 点击建筑查看详情</span>
    </div>
  )
}
