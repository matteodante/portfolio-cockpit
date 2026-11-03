import { and, asc, eq, exists, inArray, or } from 'drizzle-orm'
import type { CourseUser } from '@/lib/courses/auth'
import type { Db } from '@/lib/courses/db'
import {
  courses,
  enrollments,
  lessonProgress,
  lessons,
} from '@/lib/courses/schema'

export type CourseRow = typeof courses.$inferSelect
export type LessonRow = typeof lessons.$inferSelect

/**
 * A course an account can open: published and free, or published and assigned
 * to it. Admins also see drafts, to check them before publishing.
 */
function visibleTo(db: Db, viewer: CourseUser) {
  if (viewer.admin) return undefined
  return and(
    eq(courses.published, true),
    or(
      eq(courses.access, 'free'),
      exists(
        db
          .select()
          .from(enrollments)
          .where(
            and(
              eq(enrollments.courseId, courses.id),
              eq(enrollments.userId, viewer.id)
            )
          )
      )
    )
  )
}

export async function listCourses(db: Db, viewer: CourseUser) {
  const rows = await db
    .select()
    .from(courses)
    .where(visibleTo(db, viewer))
    .orderBy(asc(courses.position), asc(courses.createdAt))
  if (rows.length === 0) return []
  const ids = rows.map((row) => row.id)
  const lessonRows = await db
    .select({ id: lessons.id, courseId: lessons.courseId })
    .from(lessons)
    .where(and(inArray(lessons.courseId, ids), publishedLesson(viewer)))
  const done = await completedLessons(db, viewer.id)
  return rows.map((course) => {
    const own = lessonRows.filter((lesson) => lesson.courseId === course.id)
    return {
      ...course,
      lessonCount: own.length,
      completedCount: own.filter((lesson) => done.has(lesson.id)).length,
    }
  })
}

function publishedLesson(viewer: CourseUser) {
  return viewer.admin ? undefined : eq(lessons.published, true)
}

async function completedLessons(db: Db, userId: string) {
  const rows = await db
    .select({ lessonId: lessonProgress.lessonId })
    .from(lessonProgress)
    .where(eq(lessonProgress.userId, userId))
  return new Set(rows.map((row) => row.lessonId))
}

export async function getCourse(db: Db, viewer: CourseUser, slug: string) {
  const [course] = await db
    .select()
    .from(courses)
    .where(and(eq(courses.slug, slug), visibleTo(db, viewer)))
    .limit(1)
  if (!course) return null
  const rows = await db
    .select()
    .from(lessons)
    .where(and(eq(lessons.courseId, course.id), publishedLesson(viewer)))
    .orderBy(asc(lessons.position), asc(lessons.createdAt))
  const done = await completedLessons(db, viewer.id)
  return {
    course,
    lessons: rows.map((lesson) => ({
      ...lesson,
      completed: done.has(lesson.id),
    })),
  }
}
