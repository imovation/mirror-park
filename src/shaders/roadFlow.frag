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

  // 流动条纹 — 窄核心 + 强发光
  float stripe = fract(roadCoord * uStripeCount - uTime * uSpeed);
  // 缩窄核心，提高对比度以触发 Bloom
  float core = smoothstep(0.0, 0.02, stripe) * (1.0 - smoothstep(0.1, 0.2, stripe));
  float glow = smoothstep(0.0, 0.06, stripe) * (1.0 - smoothstep(0.3, 0.45, stripe));

  // 道路中央常亮主轴线
  float centerDist = abs(acrossCoord - 0.5);
  float centerLine = 1.0 - smoothstep(0.0, 0.02, centerDist);

  // 道路两侧发光边界线
  float edgeDist = abs(acrossCoord - 0.5) * 2.0;
  float edgeLine = step(0.93, edgeDist);

  // 路面基底灰色 (稍微调暗一点以突出发光条纹)
  vec3 base = vec3(0.06, 0.08, 0.12);
  
  // 核心发光使用 Additive 增强方式，混合强白色以触发 Bloom 辉光
  vec3 glowColor = mix(uColor, vec3(1.0), core * 0.5); // 核心带一点白光
  
  vec3 color = base;
  color = mix(color, glowColor, core * 0.95);
  color = mix(color, uColor, glow * 0.3);
  color = mix(color, uColor * 0.8, centerLine * 0.4);
  color = mix(color, uColor * 0.6, edgeLine * 0.4);

  // 路面边界过渡
  float edgeFade = 1.0 - smoothstep(0.92, 0.99, edgeDist);
  color = color * (0.4 + 0.6 * edgeFade);

  gl_FragColor = vec4(color, 1.0);
}
