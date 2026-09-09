import type { IdentityPointerFrame } from '@/components/landing/identity-pointer'
import {
  IDENTITY_FRAGMENT,
  IDENTITY_VERTEX,
} from '@/components/landing/identity-shaders'

/** One quad, two textures. No Three.js bundle or continuous idle rendering. */
export function createIdentityRenderer(
  canvas: HTMLCanvasElement,
  images: readonly HTMLImageElement[]
) {
  const gl = canvas.getContext('webgl', {
    alpha: false,
    antialias: false,
    depth: false,
    powerPreference: 'low-power',
    preserveDrawingBuffer: false,
  })
  if (!gl) return null

  const shaders: WebGLShader[] = []
  const textures: WebGLTexture[] = []
  const program = gl.createProgram()
  const buffer = gl.createBuffer()
  const dispose = () => {
    for (const texture of textures) gl.deleteTexture(texture)
    for (const shader of shaders) gl.deleteShader(shader)
    gl.deleteBuffer(buffer)
    gl.deleteProgram(program)
  }
  if (!(program && buffer)) {
    dispose()
    return null
  }
  const sources = [
    [gl.VERTEX_SHADER, IDENTITY_VERTEX],
    [gl.FRAGMENT_SHADER, IDENTITY_FRAGMENT],
  ] as const
  for (const [type, source] of sources) {
    const shader = gl.createShader(type)
    if (!shader) {
      dispose()
      return null
    }
    shaders.push(shader)
    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      dispose()
      return null
    }
    gl.attachShader(program, shader)
  }
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    dispose()
    return null
  }
  // biome-ignore lint/correctness/useHookAtTopLevel: WebGL API, not a React hook
  gl.useProgram(program)
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
    gl.STATIC_DRAW
  )
  const position = gl.getAttribLocation(program, 'position')
  gl.enableVertexAttribArray(position)
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
  for (const [index, image] of images.entries()) {
    const texture = gl.createTexture()
    if (!texture) {
      dispose()
      return null
    }
    textures.push(texture)
    gl.activeTexture(gl.TEXTURE0 + index)
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
    const name = index === 0 ? 'astronaut' : 'matteo'
    gl.uniform1i(gl.getUniformLocation(program, name), index)
  }
  const uniforms = {
    progress: gl.getUniformLocation(program, 'progress'),
    strength: gl.getUniformLocation(program, 'strength'),
    time: gl.getUniformLocation(program, 'time'),
    pointer: gl.getUniformLocation(program, 'pointer'),
    interaction: gl.getUniformLocation(program, 'interaction'),
  }
  return {
    draw(
      progress: number,
      strength: number,
      time: number,
      pointer: IdentityPointerFrame
    ) {
      const ratio = Math.min(window.devicePixelRatio, 1.5)
      const width = Math.max(1, Math.round(canvas.clientWidth * ratio))
      const height = Math.max(1, Math.round(canvas.clientHeight * ratio))
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width
        canvas.height = height
        gl.viewport(0, 0, width, height)
      }
      gl.uniform1f(uniforms.progress, progress)
      gl.uniform1f(uniforms.strength, strength)
      gl.uniform1f(uniforms.time, time)
      gl.uniform2f(uniforms.pointer, pointer.x, pointer.y)
      gl.uniform1f(uniforms.interaction, pointer.strength)
      gl.drawArrays(gl.TRIANGLES, 0, 6)
    },
    dispose,
  }
}
