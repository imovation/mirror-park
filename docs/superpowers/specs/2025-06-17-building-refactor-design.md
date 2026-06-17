# 建筑模型优化设计文档

## 背景

参考实景图，当前 3D 场景中的建筑模型过于"写字楼"风格：每个建筑是一个简单的 Box，没有学校建筑特有的结构特征（如楼板带、外走廊、连廊、拱门等）。需要重设计使其更接近真实镇远中学。

参考图特征：
- **多翼连通的复合格式**：中央主楼 + 两侧副楼 + 连廊
- **白/灰色横向楼板带**：每层之间有白色混凝土楼板
- **外走廊**：每层外侧有凸出的走廊
- **中央拱门**：主楼中央有贯通两翼的拱门
- **22 层宿舍楼**：密集窗户网格

## 目标

让所有建筑在保留可点击交互和不破坏建筑布局的前提下，呈现真实学校建筑的结构特征：楼板带 + 外走廊 + 连廊 + 拱门。

## 设计原则

1. **保留几何位置** — 9 栋建筑的中心点位置不变
2. **保留交互逻辑** — 点击、飞向、Html 标签、selected 状态完全不变
3. **新增结构细节** — 楼板带、外走廊、女儿墙、连廊、拱门
4. **颜色配置化** — 新增结构使用 `building.facadeColor` 字段，跟随 day/night 模式

## 建筑分类

| 类别 | 建筑 | 特点 |
|------|------|------|
| **连体教学楼** | 崇德/崇智/崇信 | 主体 + 楼板带 + 外走廊 + 互相 2-3 层连廊 + 崇智中央拱门 |
| **独立中型楼** | 崇文(图书馆)/食堂 | 主体 + 楼板带 + 外走廊 |
| **高层建筑** | 崇雅/崇思(宿舍)/钟楼 | 主体 + 密集楼板带 + 顶部装饰 |
| **特殊建筑** | 体育馆 | 保留现有 Box 主体，仅加楼板带 |

## 视觉细节

### 崇智楼（中央主楼，含拱门）剖面

```
        ┌─── 屋顶女儿墙 (白)
   ┌────┤
   │  6F│── 楼板带 (白, every 1.5m) ×5
   │    │   主体红砖带窗户
   │    │── 外走廊 (白, 凸出 0.6m, every 1.5m)
   │    │   主体红砖
   │  3F│── 楼板带
   │ 拱门│  主体红砖
   │ ╱╲  │  拱门洞
   └────┘
```

### 崇德/崇信楼（4层副楼）剖面

```
   ┌─── 女儿墙 (白)
   ┤
   │ 楼板带 (白, every 1.5m) ×3
   │ 主体红砖 + 窗户
   │ 外走廊 (白, 凸出)
   └
```

### 宿舍楼剖面（22层）

```
   ┌─── 女儿墙 (白)
   ┤
   │ 楼板带 (白, every 3m) ×6-7
   │ 主体红砖 + 密集窗户
   │ (宿舍楼层高 3m，比教学楼层高 1.5m 大)
   └
```

## BUILDINGS 几何数据调整

```typescript
// 教学复合体 — 视作连通的 3 栋楼 + 钟楼置于崇智楼顶部
{ id: 'chongde',    position: [-13, 3,    6],   size: [8, 6, 6]  },  // 4层副楼（左）
{ id: 'chongzhi',   position: [ 0,  4.5,  10],  size: [14, 9, 7] },  // 6层主楼（中,含拱门）
{ id: 'chongxin',   position: [ 13, 3,    6],   size: [8, 6, 6]  },  // 4层副楼（右）
{ id: 'bell-tower', position: [ 0,  9.5,  10],  size: [2, 4, 2]  },  // 钟楼（在崇智楼顶部）

// 独立中型楼
{ id: 'chongwen',   position: [-10, 2,    -7],  size: [12, 4, 7] },  // 2层图书馆
{ id: 'canteen',    position: [-10, 2,    -13], size: [10, 4, 8] },  // 食堂

// 高层建筑
{ id: 'chongya',    position: [-22, 8,    -14], size: [7, 16, 7] },  // 22层宿舍（用高度表示层数）
{ id: 'chongsi',    position: [  2, 6,    -14], size: [7, 12, 7] },  // 15层宿舍

// 体育馆（保持原样）
{ id: 'gymnasium',  position: [-24, 5.1,  0],  size: [14, 10, 18] },
```

注：实际渲染时宿舍楼在中心坐标 5 单位高 16 米 = ~8 层（每层 2m），但视觉上仍呈现高层塔状，与原来类似。

## 新增 BuildingMesh 结构

每个建筑渲染为以下 4 层结构：

```tsx
<group position={building.position}>
  {/* 1. 主体（红砖+窗户shader） */}
  <Box args={building.size}>
    <primitive object={shaderMaterial} attach="material" />
  </Box>
  
  {/* 2. 楼板带（白色水平条带） */}
  {Array.from({length: floorBandCount}, (_, i) => (
    <Box key={i} 
         args={[W+0.3, 0.3, D+0.3]} 
         position={[0, -H/2 + (i+1) * (H/(floorBandCount+1)), 0]}>
      <meshStandardMaterial color={cfg.building.facadeColor} />
    </Box>
  ))}
  
  {/* 3. 外走廊（正面凸出条带） */}
  {Array.from({length: balconyCount}, (_, i) => (
    <Box key={i} 
         args={[W*0.8, 0.5, 0.6]} 
         position={[0, balconyY[i], D/2 + 0.3]}>
      <meshStandardMaterial color={cfg.building.facadeColor} />
    </Box>
  ))}
  
  {/* 4. 顶部女儿墙 */}
  <Box args={[W+0.4, 0.6, D+0.4]} 
       position={[0, H/2 + 0.3, 0]}>
    <meshStandardMaterial color={cfg.building.facadeColor} />
  </Box>
</group>
```

### 楼板带数量规则

- **教学楼 (4-6 层)**: 3-5 条楼板带
- **中型楼 (2-4 层)**: 1-3 条楼板带
- **高层楼 (8+ 层)**: 6-8 条楼板带

楼板带间距 = `building.size[1] / (floorBandCount + 1)`

### 外走廊规则

- 每个楼板带下方 0.3 单位处设置外走廊（高度 0.5）
- 凸出距离 0.6 单位
- 长度 = building 宽度 × 0.8

## 连廊设计

教学三栋楼之间通过 2-3 层高度的连廊连接：

```
     崇德楼 (-13)            崇智楼 (0)             崇信楼 (13)
   ┌───────────┐            ┌──────────┐          ┌───────────┐
   │           │ ────连廊1─→ │          │ ←─连廊2─── │           │
   │  4F副楼  │  (低层)    │  6F主楼  │   (低层)  │  4F副楼   │
   │           │            │  含拱门  │          │           │
   └───────────┘            └──────────┘          └───────────┘
```

### 连廊 1（崇德楼 → 崇智楼）

- 起点：崇德楼正面 (x=-9, y=2, z=6)  (崇德楼中心+13-8/2=9 宽度一半)
- 终点：崇智楼侧面 (x=-7, y=2, z=10)
- 长度：约 2-3 单位
- 高度：1.5 单位
- 材质：混凝土白（与楼板带相同）

### 连廊 2（崇智楼 → 崇信楼）

- 对称于连廊 1

### 渲染

新增 `ConnectingCorridors` 组件（在 BuildingMesh 渲染完成后挂载）：

```tsx
function ConnectingCorridors() {
  // 崇德楼 → 崇智楼 的连廊
  return (
    <group>
      <Box args={[length, height, width]} 
           position={midpoint}
           rotation={rotationY}>
        {facadeMaterial}
      </Box>
    </group>
  )
}
```

## 拱门设计

崇智楼（中央主楼）正面中央开拱门。

### 几何

- 位置：崇智楼正面中央 (x=0, y=1.5, z=13.5)
- 高度：3 米
- 宽度：2.5 米
- 形状：半圆拱（用 LatheGeometry 或 CylinderGeometry 旋转）

### 实现方式

用 `<mesh>` + 圆柱体旋转 180° + 切割模拟拱门（最简单）。或者在主 Box 上挖洞（最复杂，box geometry 不直接支持）。

**简化方案**：在崇智楼前面叠加一个深色/空心 Box 作为"拱门洞"。视觉上看起来像有个洞。

```tsx
{/* 拱门洞（黑色 Box 凸出在崇智楼正面中央） */}
<Box args={[2.5, 3, 0.5]} 
     position={[0, 1.5, 10/2 + 0.3]}>
  <meshStandardMaterial color={timeMode === 'day' ? '#1a1a1a' : '#000000'} />
</Box>

{/* 拱门顶部白色装饰 */}
<Box args={[3, 0.3, 0.6]} 
     position={[0, 3.2, 10/2 + 0.3]}>
  <meshStandardMaterial color={cfg.building.facadeColor} />
</Box>
```

**注意**：拱门只对 chongzhi 渲染。

## 颜色配置

### dayNightTheme.ts 新增字段

```typescript
building: {
  baseColor: string
  windowColor: string
  litChance: number
  facadeColor: string  // 新增：楼板带/外走廊/女儿墙/连廊/拱门装饰条
}
```

### 默认值

| 模式 | facadeColor |
|------|-------------|
| 白天 | `#f0f4f8` (混凝土白) |
| 夜间 | `#1a2a3a` (暗蓝灰) |

## 文件变更

| 操作 | 文件 | 说明 |
|------|------|------|
| 修改 | `src/config/dayNightTheme.ts` | 添加 `building.facadeColor` 字段 |
| 修改 | `src/components/scene/CampusBase.tsx` | 重构 `BuildingMesh`、新增 `ConnectingCorridors`、新增 `ArchwayGate` 组件 |
| 修改 | BUILDINGS 数组位置/尺寸 | 调整教学复合体几何 |

## 不变的部分

- 道路、景观、跑道、水库、城市背景、POI 标注
- 摄像头、告警等安防元素
- 场景交互（点击、飞向、Html 标签）
- 钟楼始终是单独一栋（id='bell-tower'）
- 9 栋建筑的 id/label/info 字段保持不变

## 实施顺序

1. 修改 `dayNightTheme.ts` 添加 `facadeColor` 字段
2. 调整 `BUILDINGS` 数组位置/尺寸
3. 重构 `BuildingMesh` 组件（4 层结构：主体+楼板带+外走廊+女儿墙）
4. 新增 `ConnectingCorridors` 组件
5. 在 `chongzhi` 渲染中央拱门
6. 验证 `pnpm build` + `pnpm test`

## 风险点

1. **楼板带位置计算**：不同高度建筑需要不同数量的楼板带，间距需要均匀
2. **外走廊对齐**：必须在每个楼板带下方 0.3 单位（视觉上像"挂在楼板下"）
3. **连廊定位**：从崇德楼正面到崇智楼侧面，几何上需要正确计算 midpoint 和 rotation
4. **拱门简化的视觉欺骗**：拱门洞用 Box 模拟，需要在视觉上让人相信那是个洞
5. **钟楼位置**：原来钟楼在 z=8，现在在 chongzhi 顶部 z=10，需要确认不会和 chongzhi 主体冲突
6. **建筑 shader 不再应用于楼板带**：楼板带用普通材质，需要和主体的红砖颜色有明显对比
7. **BuildingMesh 复杂化**：单个组件多了 5-10 倍的 mesh 数量，可能影响性能
