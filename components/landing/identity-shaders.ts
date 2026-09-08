export const IDENTITY_VERTEX = `
attribute vec2 position;
varying vec2 uv;
void main() {
  uv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}
`

// Registered photographic plates, refractive scan-front and temporal tearing.
// The clean endpoints sample the original plates without any color treatment.
export const IDENTITY_FRAGMENT = `
precision highp float;
uniform sampler2D astronaut;
uniform sampler2D matteo;
uniform float progress;
uniform float strength;
uniform float time;
varying vec2 uv;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0)), f.x), f.y);
}
float field(vec2 p) {
  return noise(p) * 0.64 + noise(p * 2.07 + 3.1) * 0.26
    + noise(p * 4.13 - 1.8) * 0.10;
}
float reveal(vec2 p) {
  float cells = hash(floor(p * vec2(9.0, 37.0)));
  float contour = field(p * vec2(5.0, 11.0) + time * 0.25);
  float threshold = (1.0 - p.y) * 0.76
    + contour * 0.16 + cells * 0.08;
  return smoothstep(threshold - 0.025, threshold + 0.025,
    progress * 1.12 - 0.06);
}
vec3 plate(vec2 p, float blend) {
  p = clamp(p, vec2(0.001), vec2(0.999));
  return mix(texture2D(astronaut, p).rgb,
    texture2D(matteo, p).rgb, blend);
}
float heightMap(vec2 p) {
  return dot(plate(p, progress), vec3(0.2126, 0.7152, 0.0722));
}
void main() {
  if (strength < 0.001) {
    gl_FragColor = vec4(plate(uv, progress), 1.0);
    return;
  }
  float tick = floor(time * 18.0);
  float band = floor(uv.y * 47.0);
  float randomBand = hash(vec2(band, tick));
  float tear = step(0.72, randomBand)
    * (hash(vec2(band + 19.0, tick)) - 0.5);
  float sweep = abs((1.0 - uv.y) - progress);
  float front = 1.0 - smoothstep(0.025, 0.24, sweep);
  float refraction = field(uv * vec2(6.0, 13.0) + vec2(time * 0.7, 0.0));
  vec2 normal = vec2(
    heightMap(uv + vec2(0.004, 0.0)) - heightMap(uv - vec2(0.004, 0.0)),
    heightMap(uv + vec2(0.0, 0.004)) - heightMap(uv - vec2(0.0, 0.004))
  );
  float ripple = sin(sweep * 82.0 - time * 14.0) * exp(-sweep * 16.0);
  vec2 displacement = vec2(
    tear * 0.080 + (refraction - 0.5) * 0.048 * front,
    (noise(uv * 14.0 + time) - 0.5) * 0.013 * front
  );
  displacement += normal * front * 0.085
    + (uv - vec2(0.5, 0.74)) * ripple * 0.028;
  displacement *= strength;
  vec2 p = uv + displacement;
  float blend = reveal(p);
  float fringe = strength * (0.0008 + front * 0.005 + abs(tear) * 0.020);
  vec3 color = vec3(
    plate(p + vec2(fringe, 0.001 * strength), blend).r,
    plate(p, blend).g,
    plate(p - vec2(fringe, 0.001 * strength), blend).b
  );

  // A displaced optical echo stays local to the interference wave.
  vec3 echo = plate(p - displacement * 1.4, reveal(p - displacement));
  color = mix(color, max(color, echo * 0.72), front * strength * 0.30);
  float detail = max(color.r, max(color.g, color.b));
  float exposure = 1.0 + strength * front * 0.18;
  color *= exposure;
  float fracture = pow(max(0.0, 1.0 - abs(blend - 0.5) * 2.0), 4.0);
  color += vec3(0.25, 0.13, 0.055) * fracture * strength
    * smoothstep(0.035, 0.3, detail);
  float line = step(0.965, fract(uv.y * 410.0 + tick * 0.23));
  color *= 1.0 - line * strength * front * 0.17;
  float grain = hash(floor(uv * vec2(960.0, 1200.0)) + tick) - 0.5;
  color += grain * 0.045 * strength * smoothstep(0.03, 0.2, detail);
  gl_FragColor = vec4(color, 1.0);
}
`
