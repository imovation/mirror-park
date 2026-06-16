# 镇远中学 3D 场景赛博风格重构设计

> 日期: 2026-06-16
> 目标: 在保留镇远中学真实建筑布局的前提下，将 3D 场景的视觉风格完全对齐参考图（黑暗基底 + 青蓝霓虹描边 + 动态光流 + 窗户发光）
> 参考: 用户提供的智慧园区可视化参考图（Tron/Cyberpunk 风格）

---

## 1. 总体目标

将 CampusBase 3D 场景从"红砖白墙古典风"彻底重构为"黑暗基底 + 青蓝霓虹描边"的赛博朋克数据大屏风格，达到参考图约 90% 的视觉效果。

### 1.1 不动的内容

| 组件 | 原因 |
|------|------|
| BUILDINGS 数组 (位置/尺寸/标签) | 保持镇远中学真实布局 |
| DataRings (扫描光环) | 已有，仅统一颜色为 #00e5ff |
| LightPillar (钟楼光柱) | 同上 |
| Reservoir (镜面湖) | 保持 MeshReflectorMaterial |
| Trees, RunningTrack | 保持 |
| CityContext (周边暗影白模) | 保持，已是纯黑不透 |
| Environment, ContactShadows, Bloom, 灯光 | 保持 |

### 1.2 新增的内容

| 特效 | 优先级 | 描述 |
|------|-------|------|
| GlowRoads (地面发光车道) | P0 | 道路上流动的橙/青色光带 |
| Building Windows (立面窗户发光) | P0 | 建筑墙面随机亮窗的幽蓝光块 |
| 3D 双层悬浮网格 | P1 | 平面网格上方加悬浮透明网格层 |

---

## 2. 特效 1: GlowRoads — 地面发光车道

### 2.1 视觉效果

将现有 `Roads` 组件中的每条路段的静态灰色材质替换为动态 Shader 材质，产生沿道路方向流动的辉光条纹。Bloom 后处理会让条纹边缘进一步泛光。

### 2.2 技术方案

- **文件**: `src/shaders/roadFlow.frag` (新建)
- **适用**: Roads 组件中所有 Box 平面，替换 `meshStandardMaterial` → `shaderMaterial`
- **Shader 逻辑**:
  - 输入: `uTime`, `uColor`, `uSpeed`, `uStripeCount` uniform
  - 沿 UV.x (道路方向) 生成 `fract(uv * stripeCount - time * speed)` 流动条纹
  - `smoothstep` 做条纹边缘柔光
  - 基底暗色 (`#050a14`) 与辉光色混合

### 2.3 道路分级

| 类型 | 颜色 | 流速 | 条纹密度 | 示例路段 |
|------|------|------|---------|---------|
| 主路 (橙色) | `#ff6b35` | 0.3 units/s | 3-4 条/路宽 | 入校大道, 东西连接道 |
| 支路 (青色) | `#00e5ff` | 0.15 units/s | 1-2 条/路宽 | 花园小径, 建筑间步道 |

### 2.4 实现步骤

1. 创建 `src/shaders/roadFlow.glsl` (vertex + fragment)
2. 在 Roads 组件中，根据路段类型分配主路/支路标识
3. 替换 `meshStandardMaterial` 为 `shaderMaterial`，传入对应 uniforms
4. 用 `useFrame` 更新 `uTime` uniform
5. 删除 `SouthBoulevard` 独立组件，将其路段并入 Roads

---

## 3. 特效 2: Building Windows — 立面窗户发光

### 3.1 视觉效果

建筑表面不再是纯黑色，而是在每个面上生成规则的窗格网格。通过伪随机 `hash()` 函数决定每个窗格是否"亮灯"，亮灯窗格呈现柔和的青蓝色辉光。配合 Bloom 后处理，亮窗光线会向外微微扩散。

### 3.2 技术方案

- **文件**: `src/shaders/buildingWindow.glsl` (新建)
- **适用**: BuildingMesh 中每个 Box 的材质
- **Shader 逻辑**:
  - `fract(uv * gridSize)` 划窗格
  - 在每个窗格内画一定边距的小矩形（窗户本体）
  - `hash(floor(uv * gridSize))` 决定该窗亮/灭
  - 亮窗色 `#00e5ff`、墙面色 `#06101e`
  - 通过 `uniforms` 为不同建筑传入不同参数

### 3.3 建筑差异化参数

| 建筑类型 | gridSize (密度) | litChance (亮灯率) | 包含建筑 |
|---------|----------------|-------------------|---------|
| 教学楼 | 5 | 0.45 | 崇德楼, 崇智楼, 崇信楼 |
| 宿舍楼 | 6 | 0.55 | 崇雅楼(22层), 崇思楼(15层) |
| 体育馆/食堂 | 3 | 0.35 | 体育馆, 食堂 |
| 钟楼/图书馆 | 4 | 0.40 | 钟楼, 崇文楼 |

### 3.4 与 Edges 的关系

- Edges 框线保持独立（仍是 Box 的独立子元素），材质不受影响
- BuildingMesh 的 `emissive` 属性移除（改由 Shader 内部控制发光）
- 选中/悬浮状态仍然通过 Edges 线宽和颜色变化体现

### 3.5 实现步骤

1. 创建 `src/shaders/buildingWindow.glsl`
2. 在 BuildingMesh 中将 `meshStandardMaterial` 替换为 `shaderMaterial`
3. 为每个建筑类型准备对应的 uniforms 配置
4. Edges 组件保持不变
5. Html 卡片样式微调，边框色改为 `#00e5ff`

---

## 4. 特效 3: 3D 双层悬浮网格

### 4.1 视觉效果

在现有的地面平面网格 (`y=0.01`) 上方 `y=1.5` 处叠加一层半透明的低透明度网格。两层空间错位产生视差感，像全息沙盘的投影网格悬浮在空中。

### 4.2 技术方案

- 复用 `@react-three/drei` 的 `<Grid>` 组件
- 底层: `position=[0, 0.01, 0]`, 颜色保持现有 (`#1a3a5c`)
- 悬浮层: `position=[0, 1.5, 0]`, 颜色更亮 (`#00e5ff`), 透明度约 0.1-0.15

### 4.3 备选方案

如果 Grid 组件不支持直接 opacity 控制，则：
- 使用 `Plane` + 自定义 `shaderMaterial` 绘制网格
- 或使用 `Box`(极薄) + 带透明度的网格纹理

### 4.4 实现步骤

1. 在 CampusBase 中添加第二层 `<Grid>`
2. 调参：颜色、透明度、高度
3. 必要时改用自定义网格 Shader

---

## 5. 全局视觉统一

### 5.1 颜色系统

所有科技元素统一为 `#00e5ff` (Cyan)：

| 元素 | 改动 |
|------|------|
| DataRings | `color="#4a9eff"` → `"#00e5ff"` |
| LightPillar | `color="#4a9eff"` → `"#00e5ff"` |
| 悬浮网格 | 新色 `#00e5ff` |
| Html 卡片边框 | `#4a9eff` → `#00e5ff` |
| 跑道刻线 | `#4a9eff` → `#00e5ff` |

### 5.2 Bloom 参数调整

由于新 Shader 材质（窗户发光、道路光流）的亮度分布与之前不同，可能需要微调 Bloom 参数：
- 当前: `luminanceThreshold={0.6}`, `intensity={0.8}`
- 建议调整为: `luminanceThreshold={0.5}`, `intensity={0.6}` (降低以免窗户过曝)

### 5.3 其他组件

| 组件 | 处理 |
|------|------|
| Archways (拱廊) | 材质同步 BuildingMesh（暗黑 + Edges + 窗户） |
| Roads | 完全替换为 GlowRoads Shader |
| SouthBoulevard | 删除，路段并入 Roads |
| Courtyards | 保持墨绿色 (`#0b2a26`)，不修改 |
| CityContext | 保持纯黑不透 (`#080c14`)，不修改 |

---

## 6. 文件变更清单

| 文件 | 操作 | 说明 |
|------|------|------|
| `src/shaders/roadFlow.glsl` | **新建** | 道路光流 Shader (vert + frag) |
| `src/shaders/buildingWindow.glsl` | **新建** | 建筑窗户 Shader (vert + frag) |
| `src/components/scene/CampusBase.tsx` | **修改** | BuildingMesh 换 Shader · Roads 换 GlowRoads · 双层 Grid · 删 SouthBoulevard · 颜色统一 |
| `src/components/scene/SceneCanvas.tsx` | **可能微调** | Bloom 参数 |

---

## 7. 测试验证

- `pnpm build` 必须通过
- `pnpm dev` 启动后浏览器验证:
  - 9 栋建筑均有窗户发光效果
  - 路面有流动光带
  - 双层网格可见
  - 点击建筑后卡片正常弹出/关闭
  - 数据光环和光柱颜色统一为青色
  - 帧率保持 ≥ 30fps（避免 Shader 性能问题）

---

## 8. 不在范围内

- 立面扫描光带（二期）
- 建筑轮廓双重辉光（二期，现有 Bloom 已够用）
- 自定义 Shader 替代 CityContext
- 新建筑模型或布局调整
