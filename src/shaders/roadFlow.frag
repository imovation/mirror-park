varying vec2 vUv;
uniform float uTime;
uniform vec3 uColor;
uniform float uSpeed;
uniform float uStripeCount;
uniform float uFlowAxis;

void main() {
  // 沿路方向坐标 (roadCoord) 和垂直于路的方向坐标 (acrossCoord)
  float roadCoord = uFlowAxis < 0.5 ? vUv.x : vUv.y;
  float acrossCoord = uFlowAxis < 0.5 ? vUv.y : vUv.x;

  // 流动条纹 — 窄核心 + 微弱拖尾
  float stripe = fract(roadCoord * uStripeCount - uTime * uSpeed);
  float core = smoothstep(0.0, 0.03, stripe) * (1.0 - smoothstep(0.15, 0.25, stripe));
  float glow = smoothstep(0.0, 0.08, stripe) * (1.0 - smoothstep(0.35, 0.5, stripe));

  // 道路中央常亮主轴线
  float centerDist = abs(acrossCoord - 0.5);
  float centerLine = 1.0 - smoothstep(0.0, 0.03, centerDist);

  vec3 base = vec3(0.02, 0.02, 0.06);
  vec3 color = mix(base, uColor, core * 0.85);
  color = mix(color, uColor, glow * 0.15);
  color = mix(color, uColor, centerLine * 0.5);

  // 路面边界柔化
  float acrossEdge = abs(acrossCoord - 0.5) * 2.0;
  float edgeFade = 1.0 - smoothstep(0.6, 0.95, acrossEdge);
  color = color * (0.3 + 0.7 * edgeFade);

  gl_FragColor = vec4(color, 1.0);
}
