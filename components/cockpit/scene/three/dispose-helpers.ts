import * as THREE from 'three'

// Walk own properties so new MeshPhysicalMaterial map slots don't leak
// when Three adds them; an explicit allow-list silently drifts.
export function disposeMaterial(m: THREE.Material | null | undefined) {
  if (!m) return
  for (const key in m) {
    const v = (m as unknown as Record<string, unknown>)[key]
    if (v instanceof THREE.Texture) v.dispose()
  }
  m.dispose()
}

export function disposeSceneGraph(root: THREE.Object3D) {
  root.traverse((obj) => {
    if (obj instanceof THREE.Mesh || obj instanceof THREE.Points) {
      obj.geometry?.dispose()
      const m = obj.material as THREE.Material | THREE.Material[] | undefined
      if (Array.isArray(m)) for (const x of m) disposeMaterial(x)
      else disposeMaterial(m)
    } else if (obj instanceof THREE.Sprite) {
      disposeMaterial(obj.material)
    }
  })
}
