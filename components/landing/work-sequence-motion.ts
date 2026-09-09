import { gsap } from 'gsap'

/** Seek only the latest requested frame; a decoder never accumulates a queue. */
export function createWorkSequence(scene: HTMLElement) {
  const stage = scene.querySelector<HTMLElement>('.work-stage')
  const videos = Array.from(scene.querySelectorAll('video'))
  if (!(stage && videos.length)) return

  const state = { progress: 0 }
  let visible = false
  let disposed = false
  const seek = (video: HTMLVideoElement) => {
    if (
      disposed ||
      !visible ||
      document.hidden ||
      video.readyState < 2 ||
      video.seeking ||
      !Number.isFinite(video.duration)
    )
      return
    const time = state.progress * Math.max(0, video.duration - 1 / 30)
    if (Math.abs(video.currentTime - time) > 1 / 60) video.currentTime = time
  }
  const update = () => {
    for (const video of videos) seek(video)
  }
  const cleanups = videos.map((video) => {
    const onReady = () => {
      if (disposed) return
      video.setAttribute('data-ready', '')
      seek(video)
    }
    const onSeeked = () => seek(video)
    const onError = () => video.removeAttribute('data-ready')
    video.addEventListener('loadeddata', onReady)
    video.addEventListener('seeked', onSeeked)
    video.addEventListener('error', onError)
    if (video.readyState >= 2) onReady()
    return () => {
      video.pause()
      video.removeAttribute('data-ready')
      video.removeEventListener('loadeddata', onReady)
      video.removeEventListener('seeked', onSeeked)
      video.removeEventListener('error', onError)
    }
  })
  // Approaching the stage may buffer media; the initial hero never requests it.
  const preload = new IntersectionObserver(
    ([entry]) => {
      if (!entry?.isIntersecting) return
      for (const video of videos) {
        if (!video.getAttribute('src') && video.dataset.src) {
          video.preload = 'auto'
          video.src = video.dataset.src
          video.load()
        }
      }
      preload.disconnect()
    },
    { rootMargin: '100% 0px' }
  )
  preload.observe(stage)
  const visibility = new IntersectionObserver(([entry]) => {
    visible = entry?.isIntersecting ?? false
    if (visible) update()
  })
  visibility.observe(stage)
  document.addEventListener('visibilitychange', update)

  const setProgress = gsap.quickSetter(scene, '--work-progress')
  const render = () => {
    setProgress(state.progress)
    update()
  }
  const animation = gsap.fromTo(
    state,
    { progress: 0 },
    {
      progress: 1,
      ease: 'none',
      onUpdate: render,
      scrollTrigger: {
        trigger: scene,
        start: 'top top',
        end: () => `+=${Math.max(1, scene.offsetHeight - stage.offsetHeight)}`,
        scrub: 0.45,
        invalidateOnRefresh: true,
        // Refresh restores animation progress with callbacks suppressed.
        // Explicitly restore both the films and their frame after layout changes.
        onRefresh: (self) => {
          state.progress = self.progress
          render()
        },
      },
    }
  )

  return {
    trigger: animation.scrollTrigger,
    destroy: () => {
      disposed = true
      scene.style.removeProperty('--work-progress')
      preload.disconnect()
      visibility.disconnect()
      document.removeEventListener('visibilitychange', update)
      for (const cleanup of cleanups) cleanup()
    },
  }
}
