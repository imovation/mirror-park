# UI Fixes — 5 项修复设计

## 1. 告警弹窗 → 右下角

**文件**: `src/components/ui/AlertPopup.tsx`
**改动**: 定位从 `left: 50% + translateX(-50%)` 居中底部 → `right: 24, bottom: 56, left: auto, transform: none`

## 2. 3D 操作说明避开左侧面板

**文件**: `src/components/scene/SceneInfo.tsx`
**改动**: `left: 12` → `left: calc(max(260px, 20vw) + 16px)`，使提示文字位于左侧面板右边

## 3. 白天模式校名黑色

**文件**: `src/components/scene/CampusBase.tsx`
**改动**: `color: '#ffffff'` → `timeMode === 'day' ? '#000000' : '#ffffff'`

## 4. 暗色模式顶部导航栏

**文件**: `src/index.css`, `src/components/layout/TopBar.tsx`
**改动**:
- `--topbar-bg` 暗色: `linear-gradient(...)` → `#0A1628`
- TopBar 组件: 暗色模式下系统名、按钮文字、时间日期全部白色

## 5. 声音开关按钮重新设计

**文件**: `src/components/layout/TopBar.tsx`
**改动**: emoji+小方框 → 36×36 圆形按钮 + 半透背景 + hover 高亮 + 播放态主题色
