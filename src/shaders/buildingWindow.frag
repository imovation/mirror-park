varying vec2 vUv;
varying vec3 vNormal;
uniform float uWindowDensity;
uniform float uLitChance;
uniform vec3 uBaseColor;
uniform vec3 uWindowColor;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {
  // 屏蔽顶部(屋顶)和底部 — 只有侧立面才画窗户
  if (abs(vNormal.y) > 0.5) {
    gl_FragColor = vec4(uBaseColor, 1.0);
    return;
  }

  // 划分窗格 — densityX 控制竖向密度(条数)，densityY 控制横向间距
  float densityX = uWindowDensity * 2.0;
  float densityY = uWindowDensity * 0.6;
  vec2 gridUv = fract(vec2(vUv.x * densityX, vUv.y * densityY));
  vec2 cellId = floor(vec2(vUv.x * densityX, vUv.y * densityY));

  // 竖条窗：水平留大边距(0.25)，垂直留小边距(0.08)
  float wx = step(0.25, gridUv.x) * step(0.25, 1.0 - gridUv.x);
  float wy = step(0.08, gridUv.y) * step(0.08, 1.0 - gridUv.y);
  float windowMask = wx * wy;

  float lit = step(1.0 - uLitChance, hash(cellId));

  // 降低发光强度，更柔和
  vec3 color = mix(uBaseColor, uWindowColor, windowMask * lit * 0.6);
  gl_FragColor = vec4(color, 1.0);
}
