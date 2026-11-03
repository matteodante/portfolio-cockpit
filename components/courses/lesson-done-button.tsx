'use client'

import { useTransition } from 'react'
import { setLessonDone } from '@/lib/courses/progress'

export default function LessonDoneButton({
  courseSlug,
  lessonId,
  done,
  labels,
}: {
  courseSlug: string
  lessonId: string
  done: boolean
  labels: { done: string; undone: string }
}) {
  const [pending, start] = useTransition()
  return (
    <button
      className={done ? 'hero-play lesson-done' : 'booking-link'}
      type="button"
      disabled={pending}
      aria-pressed={done}
      onClick={() => start(() => setLessonDone(courseSlug, lessonId, !done))}
    >
      {done ? labels.undone : labels.done}
    </button>
  )
}
