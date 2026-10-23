'use server'

import { and, eq } from 'drizzle-orm'
import { refresh } from 'next/cache'
import { currentUser } from '@/lib/courses/auth'
import { getDb } from '@/lib/courses/db'
import { getCourse } from '@/lib/courses/queries'
import { lessonProgress } from '@/lib/courses/schema'

/** Marks a lesson the viewer can open as completed, or not. */
export async function setLessonDone(
  courseSlug: string,
  lessonId: string,
  done: boolean
) {
  const db = getDb()
  const viewer = await currentUser()
  if (!(db && viewer)) return
  const found = await getCourse(db, viewer, courseSlug)
  if (!found?.lessons.some((lesson) => lesson.id === lessonId)) return
  if (done) {
    await db
      .insert(lessonProgress)
      .values({ userId: viewer.id, lessonId })
      .onConflictDoNothing()
  } else {
    await db
      .delete(lessonProgress)
      .where(
        and(
          eq(lessonProgress.userId, viewer.id),
          eq(lessonProgress.lessonId, lessonId)
        )
      )
  }
  refresh()
}
