export type BlackHoleConfig = {
  blackHoleMass?: number
  diskInnerRadius?: number
  diskOuterRadius?: number
  diskBrightness?: number
  diskRotationSpeed?: number
  diskTiltAngle?: number
  sphereRadius?: number
  maxRayDistance?: number
  stepSize?: number
  lensingStrength?: number
}

// rs = 2 * blackHoleMass. The captured-shadow radius is 2.6 * rs, so the
// disc inner MUST stay outside that — ISCO ≈ 3 * rs is the physical analogue.
export const BLACK_HOLE_DEFAULTS: Required<BlackHoleConfig> = {
  blackHoleMass: 0.55,
  diskInnerRadius: 3.2,
  diskOuterRadius: 7,
  diskBrightness: 1.7,
  diskRotationSpeed: -2.4,
  diskTiltAngle: 0,
  // Acts as a skybox (camera always inside); the shader writes gl_FragDepth
  // so BH content occludes geometry physically behind it.
  sphereRadius: 800,
  maxRayDistance: 300,
  stepSize: 2.0,
  // Multiplier on the Newtonian-analog deflection. Strong enough that
  // rays passing within ~5 rs of the BH bend far enough to sample a
  // planet on the other side — otherwise a body behind the horizon
  // would not produce a visible lensing arc.
  lensingStrength: 1.8,
}
