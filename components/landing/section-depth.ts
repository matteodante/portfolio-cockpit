import { gsap } from 'gsap'

/** Real HTML planes keep their links and reading order while moving in depth. */
export function createSectionDepth(root: HTMLElement) {
  const animations: gsap.core.Tween[] = []
  const services = root.querySelector<HTMLElement>('#services')
  if (services) {
    animations.push(
      gsap.fromTo(
        services,
        { '--arrival': 0 },
        {
          '--arrival': 1,
          ease: 'none',
          scrollTrigger: {
            trigger: services,
            start: 'top 95%',
            end: 'top 14%',
            scrub: 0.65,
            invalidateOnRefresh: true,
          },
        }
      )
    )
  }
  for (const project of root.querySelectorAll<HTMLElement>(
    '[data-project-depth]'
  )) {
    animations.push(
      gsap.fromTo(
        project,
        { '--project-progress': 0 },
        {
          '--project-progress': 1,
          ease: 'none',
          scrollTrigger: {
            trigger: project,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.65,
            invalidateOnRefresh: true,
          },
        }
      )
    )
  }
  return animations.flatMap((animation) =>
    animation.scrollTrigger ? [animation.scrollTrigger] : []
  )
}
