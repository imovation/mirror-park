# Header/Footer IOC 数字孪生大屏重构设计

## 目标
将现有 TopBar/BottomBar 重构为 IOC 指挥中心级 Header/Footer，达到省级智慧校园驾驶舱交付标准。

## 风格
科技蓝 #00D8FF / 深色背景 #020817 / 斜切角（无圆角）/ 发光描边 / 对称布局 / HUD 视觉语言

## Header 架构

```
120px 高度
┌──────────────────────────────────────────────────────┐
│ [天气/空气质量] [亮暗][昼夜]  ╲____标题____╱  [音乐][全屏] [时钟] │
└──────────────────────────────────────────────────────┘
```

### 组件拆分
| 组件 | 职责 | 位置 |
|------|------|------|
| `Header.tsx` | 容器，三区 flex 布局，120px | — |
| `HeaderTitle.tsx` | 盾形几何标题 + 蓝色能量条 + 左右折角科技线 + 流光 + 点阵 | 中央 |
| `HeaderStatus.tsx` | 天气图标 + 温度 + 空气质量（Mock 数据） | 左侧 |
| `HeaderClock.tsx` | 数字时钟 HH:MM:SS + 日期 + 星期 | 右侧 |

### 控件保留（从原 TopBar 迁移）
- 左侧标题旁：亮暗切换（useUIThemeStore）+ 白天/夜间切换（useTimeModeStore）
- 右侧时钟旁：音乐开关 + 全屏按钮

### 色调
```css
--bg: #020817 / #06152E / #081A3A
--primary: #00D8FF
--highlight: #3DAEFF
--glow: rgba(0,216,255,.8)
--stroke: rgba(90,180,255,.35)
```

## Footer 架构

```
110px 高度
      ┌─────────────┐
      │ 7 Nav Items │
──────┘             └──────
左右各两条发光线（上细下粗）
```

### 组件拆分
| 组件 | 职责 |
|------|------|
| `Footer.tsx` | 容器 + 左右科技线 |
| `FooterNav.tsx` | 7 项 Flex 均分 |
| `FooterNavItem.tsx` | 单导航项（icon + 中文 + 英文）+ 激活态 |

### 导航项
| 中文 | 英文 | Heroicon | ThemeId |
|------|------|----------|---------|
| 综合态势 | OVERVIEW | HomeIcon | overview |
| 教学研究 | RESEARCH | AcademicCapIcon | teaching-research |
| 行政办公 | ADMIN | BriefcaseIcon | admin |
| 智慧图书 | LIBRARY | BookOpenIcon | library |
| 智慧教学 | TEACHING | PresentationChartBarIcon | academics |
| 智慧安防 | SECURITY | ShieldCheckIcon | security |
| 智慧后勤 | LOGISTICS | BuildingOffice2Icon | logistics |

默认激活：智慧教学

### 激活样式
```css
background: rgba(0,120,255,.2)
border: 1px solid rgba(0,216,255,.8)
box-shadow: 0 0 15px rgba(0,216,255,.6)
```

## 动效
- 科技线流光：background-position 3s linear infinite
- 导航边框呼吸：opacity/scale 动画
- Hover 上浮：translateY(-2px)

## 状态管理
`useLayoutStore` (Zustand)
```ts
activeModule: ThemeId
setActiveModule: (id: ThemeId) => void
```

## 无圆角 / 无 Ant Design / 纯 IOC 风格
