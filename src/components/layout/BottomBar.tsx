export default function BottomBar() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        padding: '0 24px',
        background: 'rgba(0,0,0,0.4)',
        borderTop: '1px solid rgba(74, 158, 255, 0.1)',
        fontSize: 11,
        color: 'rgba(255,255,255,0.3)',
      }}
    >
      <span>智慧校园可视化平台 v0.1.0 | 数据更新时间: --</span>
    </div>
  )
}
