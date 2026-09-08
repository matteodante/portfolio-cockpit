import * as THREE from 'three'

type BackdropTextBundle = {
  mesh: THREE.Mesh
  light: THREE.PointLight
  dispose(): void
}

type Options = {
  text?: string
  position?: THREE.Vector3
  size?: number
}

/** The same outlined/solid wordmark as the landing, rendered into the scene. */
export function createBackdropText(
  scene: THREE.Scene,
  { text = 'MATTEO DANTE', position, size = 16 }: Options = {}
): BackdropTextBundle {
  const canvas = document.createElement('canvas')
  canvas.width = 2048
  canvas.height = 320
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  const geometry = new THREE.PlaneGeometry(size * 10, size * 1.56)
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    toneMapped: false,
    depthWrite: false,
  })
  const mesh = new THREE.Mesh(geometry, material)
  const pos = position ?? new THREE.Vector3(0, 10, -220)
  mesh.position.copy(pos)
  scene.add(mesh)
  const light = new THREE.PointLight(0xff6b35, 210, 0, 1)
  light.position.copy(pos)
  scene.add(light)
  let disposed = false
  const draw = () => {
    if (disposed) return
    const context = canvas.getContext('2d')
    if (!context) return
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.font = '900 170px "Unbounded"'
    context.textBaseline = 'middle'
    const width = context.measureText(text).width
    const scale = Math.min(1, 1920 / width)
    context.save()
    context.translate((canvas.width - width * scale) / 2, canvas.height / 2)
    context.scale(scale, scale)
    context.strokeStyle = '#f2ede3'
    context.fillStyle = '#f2ede3'
    context.lineWidth = 3
    const space = text.indexOf(' ')
    const first = space < 0 ? text : text.slice(0, space)
    context.strokeText(first, 0, 0)
    if (space >= 0)
      context.fillText(
        text.slice(space + 1),
        context.measureText(`${first} `).width,
        0
      )
    context.restore()
    texture.needsUpdate = true
  }
  void document.fonts.load('900 170px "Unbounded"').then(draw)
  draw()
  return {
    mesh,
    light,
    dispose() {
      disposed = true
      scene.remove(mesh, light)
      geometry.dispose()
      material.dispose()
      texture.dispose()
    },
  }
}
