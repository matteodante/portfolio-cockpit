import * as THREE from 'three'
import helvetikerBold from 'three/examples/fonts/helvetiker_bold.typeface.json'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import { type Font, FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'

type BackdropTextBundle = {
  mesh: THREE.Mesh
  light: THREE.PointLight
  update(dt: number): void
  dispose(): void
}

type Options = {
  text?: string
  position?: THREE.Vector3
  /** Size of the glyphs in world units. */
  size?: number
  depth?: number
}

// Shared font instance — parsing the typeface JSON once and reusing it
// keeps the hot path quick and the module tree-shakable.
const font: Font = new FontLoader().parse(
  helvetikerBold as unknown as Parameters<FontLoader['parse']>[0]
)

export function createBackdropText(
  scene: THREE.Scene,
  renderer: THREE.WebGLRenderer,
  { text = 'MATTEO DANTE', position, size = 16, depth = 2 }: Options = {}
): BackdropTextBundle {
  const geo = new TextGeometry(text, {
    font,
    size,
    depth,
    curveSegments: 10,
    bevelEnabled: true,
    bevelThickness: 0.35,
    bevelSize: 0.25,
    bevelSegments: 4,
  })
  geo.computeBoundingBox()
  geo.center()

  // PMREM env from a tiny RoomEnvironment scene. Without an envMap the
  // clearcoat layer reads as flat; this gives the clearcoat actual
  // specular highlights to grab onto, redrawing the glyph borders even
  // when the emissive is on. Kept on the material only (not bound to
  // scene.environment) so other meshes — astronaut, planets — don't
  // suddenly inherit a different IBL.
  const pmrem = new THREE.PMREMGenerator(renderer)
  const envTexture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
  pmrem.dispose()

  // Physical material: dark metallic base + moderate warm emissive +
  // clearcoat lacquer on top. The clearcoat is what redraws the silhouette
  // — its specular highlights "ink" the bevel edges no matter how bright
  // the inner emissive gets, so the lettering stays readable.
  const mat = new THREE.MeshPhysicalMaterial({
    color: 0x060202,
    emissive: 0xff8a3c,
    emissiveIntensity: 1.5,
    metalness: 0.55,
    roughness: 0.18,
    clearcoat: 1.0,
    clearcoatRoughness: 0.15,
    envMap: envTexture,
    envMapIntensity: 1.2,
  })
  const mesh = new THREE.Mesh(geo, mat)

  // Spawn camera is at (0, 16, -130) looking toward +Z (the BH); "behind
  // the camera" means more negative Z. Place the sign there so at spawn
  // its light rakes the astronaut's back — the camera only sees the sign
  // itself when the player turns around.
  const pos = position ?? new THREE.Vector3(0, 10, -220)
  mesh.position.copy(pos)
  scene.add(mesh)

  // Warm point light co-located with the text: gives the astronaut a
  // strong warm rim from behind, matching the BH-like palette. Decay=1
  // so the light reaches the player + the BH ~220 units away.
  const light = new THREE.PointLight(0xff8a3c, 260, 0, 1)
  light.position.copy(pos)
  scene.add(light)

  return {
    mesh,
    light,
    update(_dt) {
      // Breath in sync with the rest of the scene (same 1.25s period as
      // the BH disc pulse in cockpit-scene.tsx).
      const t = performance.now() * 0.00125
      const pulse = 0.5 + 0.5 * Math.sin(t)
      mat.emissiveIntensity = 1.2 + 0.6 * pulse
      light.intensity = 200 + 90 * pulse
    },
    dispose() {
      scene.remove(mesh)
      scene.remove(light)
      geo.dispose()
      mat.dispose()
      envTexture.dispose()
    },
  }
}
