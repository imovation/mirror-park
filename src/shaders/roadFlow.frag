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
  float centerLine = 1.0 - smoothstep(0.0, 0.02, centerDist);

  // 道路两侧发光边界线
  float edgeDist = abs(acrossCoord - 0.5) * 2.0;
  float edgeLine = step(0.92, edgeDist);

  // 调亮路面基底颜色
  vec3 base = vec3(0.14, 0.16, 0.22);
  vec3 color = mix(base, uColor, core * 0.8);
  color = mix(color, uColor, glow * 0.15);
  color = mix(color, uColor, centerLine * 0.4);
  color = mix(color, uColor, edgeLine * 0.35); // 叠加边缘光线

  // 路面边界过渡
  float edgeFade = 1.0 - smoothstep(0.9, 0.99, edgeDist);
  color = color * (0.5 + 0.5 * edgeFade);

  gl_FragColor = vec4(color, 1.0);
}
