varying vec2 vUv;
uniform float uWindowDensity;
uniform float uLitChance;
uniform vec3 uBaseColor;
uniform vec3 uWindowColor;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {
  vec2 gridUv = fract(vUv * uWindowDensity);
  vec2 cellId = floor(vUv * uWindowDensity);
  float margin = 0.12;
  float wx = step(margin, gridUv.x) * step(margin, 1.0 - gridUv.x);
  float wy = step(margin, gridUv.y) * step(margin, 1.0 - gridUv.y);
  float windowMask = wx * wy;
  float lit = step(1.0 - uLitChance, hash(cellId));
  vec3 color = mix(uBaseColor, uWindowColor, windowMask * lit * 0.85);
  gl_FragColor = vec4(color, 1.0);
}
