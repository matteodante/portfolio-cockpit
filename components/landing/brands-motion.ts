import { gsap } from 'gsap'

/** Native scroll adds a small impulse without changing the loops' positions. */
export function observeBrandsWall(scene: HTMLElement) {
  const animations = Array.from(
    scene.querySelectorAll('.brands-track')
  ).flatMap((track) => track.getAnimations())
  const motion = { rate: 1 }
  let visible = false
  let lastY = window.scrollY
  let lastScroll = performance.now()
  const applyRate = () => {
    for (const animation of animations)
      animation.updatePlaybackRate(motion.rate)
  }
  const reset = () => {
    gsap.killTweensOf(motion)
    motion.rate = 1
    applyRate()
  }
  const sync = () => {
    const playing = visible && !document.hidden
    scene.toggleAttribute('data-wall-playing', playing)
    lastY = window.scrollY
    lastScroll = performance.now()
    if (!playing) reset()
  }
  const settle = () => {
    gsap.to(motion, {
      rate: 1,
      duration: 1.1,
      ease: 'power2.out',
      onUpdate: applyRate,
    })
  }
  const onScroll = () => {
    const now = performance.now()
    const distance = Math.abs(window.scrollY - lastY)
    const elapsed = Math.max(16, Math.min(64, now - lastScroll))
    lastY = window.scrollY
    lastScroll = now
    if (!visible || document.hidden || distance === 0) return
    gsap.to(motion, {
      rate: 1 + Math.min(1.25, (distance / elapsed) * 0.4),
      duration: 0.16,
      ease: 'power2.out',
      overwrite: true,
      onUpdate: applyRate,
      onComplete: settle,
    })
  }
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry?.isIntersecting ?? false
    sync()
  })
  observer.observe(scene)
  document.addEventListener('visibilitychange', sync)
  window.addEventListener('scroll', onScroll, { passive: true })
  return () => {
    observer.disconnect()
    document.removeEventListener('visibilitychange', sync)
    window.removeEventListener('scroll', onScroll)
    scene.removeAttribute('data-wall-playing')
    reset()
  }
}
