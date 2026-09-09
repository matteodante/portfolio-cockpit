/** An ambient loop only runs while the contact scene is visible and enabled. */
export function observeContactFilm(host: HTMLElement) {
  const video = host.querySelector('video')
  if (!video) return
  let visible = false
  let disposed = false

  const sync = () => {
    if (disposed) return
    if (!visible || document.hidden) {
      video.pause()
      return
    }
    if (!video.getAttribute('src') && video.dataset.src) {
      video.src = video.dataset.src
      video.muted = true
      video.load()
    }
    void video.play().catch(() => host.removeAttribute('data-playing'))
  }
  const onPlaying = () => {
    if (disposed || !visible || document.hidden) {
      video.pause()
      return
    }
    host.setAttribute('data-playing', '')
  }
  const onError = () => host.removeAttribute('data-playing')
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry?.isIntersecting ?? false
    sync()
  })
  observer.observe(host)
  video.addEventListener('playing', onPlaying)
  video.addEventListener('error', onError)
  document.addEventListener('visibilitychange', sync)

  return () => {
    disposed = true
    observer.disconnect()
    document.removeEventListener('visibilitychange', sync)
    video.removeEventListener('playing', onPlaying)
    video.removeEventListener('error', onError)
    video.pause()
    host.removeAttribute('data-playing')
  }
}
