varying vec2 vUv;
uniform float uTime;
uniform vec3 uColor;
uniform float uSpeed;
uniform float uStripeCount;
uniform float uFlowAxis;

void main() {
  float coord = uFlowAxis < 0.5 ? vUv.x : vUv.y;
  float stripe = fract(coord * uStripeCount - uTime * uSpeed);
  float core = smoothstep(0.0, 0.06, stripe) * (1.0 - smoothstep(0.22, 0.45, stripe));
  float glow = smoothstep(0.0, 0.15, stripe) * (1.0 - smoothstep(0.65, 1.0, stripe));
  vec3 base = vec3(0.02, 0.02, 0.06);
  vec3 color = mix(base, uColor, core * 0.9);
  color = mix(color, uColor, glow * 0.2);
  float edgeDist = min(min(vUv.x, 1.0 - vUv.x), min(vUv.y, 1.0 - vUv.y));
  float edgeFade = smoothstep(0.0, 0.2, edgeDist);
  gl_FragColor = vec4(color * (0.3 + 0.7 * edgeFade), 1.0);
}
