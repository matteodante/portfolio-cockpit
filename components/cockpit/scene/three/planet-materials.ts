import * as THREE from 'three'

const VERTEX = `
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying vec3 vView;
  #include <fog_pars_vertex>
  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vPosition = position;
    vNormal = normalize(normalMatrix * normal);
    vView = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
    #include <fog_vertex>
  }`

export function createAtmosphereMaterial() {
  return new THREE.ShaderMaterial({
    uniforms: THREE.UniformsUtils.merge([
      THREE.UniformsLib.fog,
      { tint: { value: new THREE.Color(0x71a9ed) } },
    ]),
    fog: true,
    vertexShader: VERTEX,
    fragmentShader: `
      uniform vec3 tint;
      varying vec3 vNormal;
      varying vec3 vView;
      #include <common>
      #include <fog_pars_fragment>
      void main() {
        float rim = pow(1.0 - abs(dot(normalize(vNormal), normalize(vView))), 2.5);
        gl_FragColor = vec4(tint, rim * 0.48);
        // Additive atmosphere must fade out, not add the fog colour.
        #ifdef USE_FOG
          #ifdef FOG_EXP2
            float fogFactor = 1.0 - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
          #else
            float fogFactor = smoothstep(fogNear, fogFar, vFogDepth);
          #endif
          gl_FragColor.a *= 1.0 - fogFactor;
        #endif
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
    side: THREE.BackSide,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
}

export function createRingMaterial(radius: number) {
  return new THREE.ShaderMaterial({
    uniforms: THREE.UniformsUtils.merge([
      THREE.UniformsLib.fog,
      {
        radius: { value: radius },
        tint: { value: new THREE.Color(0xd4bb95) },
      },
    ]),
    fog: true,
    vertexShader: VERTEX,
    fragmentShader: `
      uniform float radius;
      uniform vec3 tint;
      varying vec3 vPosition;
      #include <common>
      #include <fog_pars_fragment>
      void main() {
        float radial = (length(vPosition.xy) / radius - 1.4) / 0.5;
        float bands = 0.66 + 0.18 * sin(radial * 110.0) + 0.1 * sin(radial * 37.0);
        float edge = smoothstep(0.0, 0.06, radial) * (1.0 - smoothstep(0.92, 1.0, radial));
        float gap = 1.0 - 0.8 * (smoothstep(0.62, 0.64, radial) - smoothstep(0.67, 0.69, radial));
        gl_FragColor = vec4(tint * bands, edge * gap * 0.72);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
        #include <fog_fragment>
      }`,
    side: THREE.DoubleSide,
    transparent: true,
    depthWrite: false,
  })
}
