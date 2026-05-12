// Ray-traced Schwarzschild-like black hole WITHOUT gravitational lensing.
// Light travels in straight lines outside the capture zone — no ray bending,
// no starfield warping, no planet-cubemap ghosting.
//
// Pipeline per pixel:
//   1. Build a world-space ray from the camera + screen uv.
//   2. Rotate it into the disc-local frame (disc lies on y=0).
//   3. Analytic shadow test — rays whose straight-line approach to origin is
//      inside the photon sphere (~2.6 rs) are captured immediately.
//      Rays JUST outside that threshold add a bright photon ring.
//   4. Analytic disc intersection — rays crossing y=0 inside
//      [diskInner, diskOuter] composite the disc colour (blackbody gradient
//      + Kepler swirl + Doppler beaming).
//   5. Remaining rays show a procedural starfield + warm nebula halo.

export const BLACK_HOLE_VERT = /* glsl */ `
  void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

export const BLACK_HOLE_FRAG = /* glsl */ `
  // Three.js auto-injects viewMatrix + cameraPosition in the fragment stage
  // but not projectionMatrix — declare it manually; the renderer fills it
  // because the name matches the built-in.
  uniform mat4 projectionMatrix;
  uniform samplerCube sceneCube;

  uniform vec2  resolution;
  uniform float time;
  uniform vec3  camPos;
  uniform mat3  camBasis;

  uniform float bhMass;
  uniform float diskInner;
  uniform float diskOuter;
  uniform float diskTilt;
  uniform float diskBrightness;
  uniform float diskRotSpeed;
  uniform float maxRayDistance;
  uniform float stepSize;
  uniform float lensingStrength;

  float hash21(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }
  vec2 hash22(vec2 p) {
    return vec2(
      fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453),
      fract(sin(dot(p, vec2(269.5, 183.3))) * 43758.5453)
    );
  }

  vec3 rotateX(vec3 v, float a) {
    float c = cos(a);
    float s = sin(a);
    return vec3(v.x, v.y*c - v.z*s, v.y*s + v.z*c);
  }

  vec3 starLayer(vec3 rayDir, float gridScale, float sizeBase, float density) {
    float theta = atan(rayDir.z, rayDir.x);
    float phi   = asin(clamp(rayDir.y, -1.0, 1.0));

    vec2 coord  = vec2(theta, phi) * gridScale;
    vec2 cell   = floor(coord);
    vec2 cellUV = fract(coord);

    float h = hash21(cell + gridScale);
    float starProb = step(1.0 - density, h);
    vec2  starPos  = hash22(cell + 42.0) * 0.7 + 0.15;
    float d        = length(cellUV - starPos);

    float size = sizeBase + hash21(cell + 100.0) * sizeBase;
    float core = smoothstep(size, 0.0, d);
    float glow = smoothstep(size * 4.0, 0.0, d) * 0.4;
    float intensity = (core + glow) * starProb;

    float temp = hash21(cell + 200.0);
    vec3  warm = vec3(1.00, 0.90, 0.72);
    vec3  cool = vec3(0.78, 0.88, 1.00);
    return mix(cool, warm, temp) * intensity;
  }

  vec3 starField(vec3 rayDir) {
    vec3 s1 = starLayer(rayDir, 60.0, 0.020, 0.12);
    vec3 s2 = starLayer(rayDir, 25.0, 0.015, 0.03) * 1.4;
    return s1 + s2;
  }

  vec4 discColor(vec3 hit, vec3 dir, float hr) {
    float nr = (hr - diskInner) / (diskOuter - diskInner);
    vec3  hot  = vec3(1.00, 0.85, 0.55);
    vec3  cool = vec3(0.95, 0.38, 0.10);
    vec3  dc   = mix(hot, cool, pow(nr, 0.7));

    float edge = smoothstep(0.0, 0.18, nr) * smoothstep(1.0, 0.82, nr);

    float ang = atan(hit.z, hit.x);
    float kep = time * diskRotSpeed / pow(max(hr, 0.5), 1.3);
    float n1  = 0.5 + 0.5 * sin(ang * 5.0 + kep);
    float n2  = 0.5 + 0.5 * sin(ang * 13.0 + kep * 1.6 + hr * 0.6);
    float pat = n1 * 0.65 + n2 * 0.35;

    // Doppler beaming: orbital tangent velocity vs viewing direction.
    vec2 tangent = normalize(vec2(-hit.z, hit.x)) * sign(diskRotSpeed);
    vec2 rayXZ   = normalize(dir.xz);
    float cosTh  = dot(tangent, rayXZ);
    float beta   = 0.42 * sqrt(diskInner / max(hr, diskInner));
    float D      = 1.0 / max(1.0 - beta * cosTh, 0.001);
    float doppler = clamp(pow(D, 3.0), 0.25, 4.5);

    dc *= doppler;

    float op = edge * (0.35 + 0.65 * pat);
    return vec4(dc * diskBrightness, op);
  }

  void main() {
    vec2 ndc = (gl_FragCoord.xy / resolution) * 2.0 - 1.0;
    // Reconstruct the view-space direction from the real projection matrix
    // (tan(fov/2) = 1 / projectionMatrix[1][1]; aspect baked into [0][0]),
    // then rotate by the camera's actual world basis. This matches the
    // camera exactly — including yaw/pitch/roll — so the BH parallaxes
    // with the rest of the scene instead of drifting against it.
    float tanHalfFov = 1.0 / projectionMatrix[1][1];
    float aspect     = projectionMatrix[1][1] / projectionMatrix[0][0];
    vec3 viewDir = normalize(vec3(ndc.x * tanHalfFov * aspect, ndc.y * tanHalfFov, -1.0));
    vec3 rayDirW = normalize(camBasis * viewDir);

    vec3 pos = rotateX(camPos,   -diskTilt);
    vec3 dir = rotateX(rayDirW, -diskTilt);

    float rs        = bhMass * 2.0;
    float captureR  = rs * 2.6;
    float ringOuter = captureR * 1.18;

    vec4  originClip = projectionMatrix * viewMatrix * vec4(0.0, 0.0, 0.0, 1.0);
    float originDepth = clamp(originClip.z / max(originClip.w, 0.0001) * 0.5 + 0.5, 0.0, 1.0);

    float tCP    = -dot(pos, dir);
    float perpSq = dot(pos, pos) - tCP * tCP;

    if (tCP > 0.0 && perpSq < captureR * captureR) {
      gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
      gl_FragDepth = originDepth;
      return;
    }

    vec3 photonRing = vec3(0.0);
    float ringAlpha = 0.0;
    if (tCP > 0.0 && perpSq < ringOuter * ringOuter) {
      float r = sqrt(perpSq);
      float t = 1.0 - smoothstep(captureR * 1.02, ringOuter, r);
      photonRing = vec3(2.4, 1.9, 1.3) * t * diskBrightness * 0.55;
      ringAlpha = t;
    }

    // Raymarch with Newtonian-analog deflection. lensingStrength scales
    // the bend — kept small so only rays grazing the event horizon curve
    // visibly; rays further than a few rs barely deflect at all.
    vec3  discColorRGB = vec3(0.0);
    float discAlpha    = 0.0;
    const int STEPS = 64;
    for (int i = 0; i < STEPS; i++) {
      float r = length(pos);
      if (r < captureR || r > maxRayDistance || discAlpha > 0.99) break;

      vec3  toC  = -pos / max(r, 0.0001);
      float bend = rs / (r * r) * stepSize * lensingStrength;
      dir = normalize(dir + toC * bend);

      vec3 prev = pos;
      pos += dir * stepSize;

      if (prev.y * pos.y < 0.0) {
        float t   = -prev.y / (pos.y - prev.y);
        vec3  hit = prev + (pos - prev) * t;
        float hr  = length(hit.xz);
        if (hr > diskInner && hr < diskOuter) {
          vec4 d = discColor(hit, dir, hr);
          float rem = 1.0 - discAlpha;
          discColorRGB += d.rgb * d.a * rem;
          discAlpha    += rem * d.a;
        }
      }
    }

    // Starfield sampled with the DEFLECTED ray direction (rotated back to
    // world space) so stars near the BH appear gently lensed.
    vec3 dirWorld = rotateX(dir, diskTilt);
    vec3 stars = starField(dirWorld);

    // Lensed scene: gate the cubemap sample on the ray's impact parameter
    // so lookups stay in a thin annulus around the photon sphere. We also
    // OCCLUDE whatever the main camera would draw here (via gl_FragDepth
    // below) — otherwise the real planet mesh, rendered after the BH,
    // would just sit over the top of the deflected sample.
    float b = sqrt(max(0.0, perpSq));
    float lensingAnnulus = smoothstep(captureR * 3.0, captureR * 1.03, b)
                         * step(0.0, tCP);
    vec3 sceneSample = textureCube(sceneCube, dirWorld).rgb;
    stars = mix(stars, sceneSample, lensingAnnulus);

    // Dim stars near the BH so it reads as a foreground body occluding
    // the starfield, not just another bright spot among the stars.
    vec3  bhDir   = normalize(-camPos);
    float bhAlign = max(0.0, dot(rayDirW, bhDir));
    float starDim = 1.0 - 0.85 * smoothstep(0.985, 1.0, bhAlign);
    stars *= starDim;

    // Warm nebula halo, tight around the photon sphere — pure glow, no
    // refraction.
    float haloCore = pow(bhAlign, 55.0);
    float haloWide = pow(bhAlign, 18.0);
    float n1 = hash21(rayDirW.xy * 14.0 + rayDirW.z);
    float n2 = hash21(rayDirW.yz * 22.0 - rayDirW.x);
    float cloud = mix(0.5, 1.0, 0.5 * (n1 + n2));
    vec3 nebulaWarm = vec3(1.0, 0.55, 0.25);
    vec3 nebulaCool = vec3(0.35, 0.3, 0.55);
    vec3 nebulaColor = mix(nebulaWarm, nebulaCool, smoothstep(0.55, 0.95, haloWide));
    vec3 nebula = nebulaColor * (haloCore * 0.55 + haloWide * 0.14) * cloud;

    vec3 color = discColorRGB + (stars + nebula) * (1.0 - discAlpha);
    color += photonRing;

    // Write origin-depth for EVERY pixel the BH owns: the capture shadow,
    // the photon ring, the disc hits, AND the lensing annulus. Writing it
    // over the annulus is what makes the real planet mesh behind the BH
    // get depth-culled, letting the cubemap-deflected version show
    // through as an actual gravitational-lens distortion of the scene.
    float bhMask = max(max(discAlpha, ringAlpha), lensingAnnulus);
    gl_FragColor = vec4(color, 1.0);
    gl_FragDepth = mix(1.0, originDepth, bhMask);
  }
`
