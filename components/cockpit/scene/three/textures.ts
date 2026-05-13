import * as THREE from 'three'
import type { CockpitSectionId } from '@/lib/data/cockpit-sections'

// Planet texture manifest — kept close to the loader so adding a new planet
// only requires editing this file.
export const PLANET_TEXTURES: Partial<
  Record<CockpitSectionId, { color: string; clouds?: string }>
> = {
  about: { color: '/textures/planets/mercury_2k.jpg' },
  experience: { color: '/textures/planets/jupiter_2k.jpg' },
  projects: { color: '/textures/planets/mars_2k.jpg' },
  skills: { color: '/textures/planets/neptune_2k.jpg' },
  contact: {
    color: '/textures/planets/earth_day_2k.jpg',
    clouds: '/textures/planets/earth_clouds_2k.jpg',
  },
}

export function loadPlanetTexture(
  loader: THREE.TextureLoader,
  path: string
): THREE.Texture {
  const tex = loader.load(path)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.wrapS = THREE.RepeatWrapping
  tex.wrapT = THREE.ClampToEdgeWrapping
  tex.anisotropy = 4
  // The loader sets needsUpdate itself once the image finishes loading.
  // Forcing it here would make WebGLRenderer warn every frame.
  return tex
}

// Canvas-rendered label floating above each planet.
const LABEL_CANVAS_W = 512
const LABEL_CANVAS_H = 128

export function buildLabelTexture(label: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = LABEL_CANVAS_W
  canvas.height = LABEL_CANVAS_H
  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.clearRect(0, 0, LABEL_CANVAS_W, LABEL_CANVAS_H)
    ctx.font = 'bold 48px "Architects Daughter", monospace'
    ctx.fillStyle = '#ffffff'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(label.toUpperCase(), LABEL_CANVAS_W / 2, LABEL_CANVAS_H / 2)
  }
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.needsUpdate = true
  return tex
}
