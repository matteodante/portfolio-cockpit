'use server'

import { and, eq } from 'drizzle-orm'
import { refresh } from 'next/cache'
import { headers } from 'next/headers'
import { z } from 'zod'
import { currentUser } from '@/lib/courses/auth'
import { getDb } from '@/lib/courses/db'
import {
  APPLICATION_STATUSES,
  applications,
  COURSE_ACCESS,
  COURSE_LANGUAGES,
  courses,
  enrollments,
  lessons,
  user,
} from '@/lib/courses/schema'
import {
  deleteObject,
  MAX_VIDEO_BYTES,
  presignUpload,
  VIDEO_TYPES,
} from '@/lib/courses/storage'

/**
 * Matteo's course management (ADMIN_EMAILS). Every action checks the
 * signed-in account again: a server action is a public endpoint.
 */
async function admin() {
  const db = getDb()
  const viewer = await currentUser()
  if (!(db && viewer?.admin)) throw new Error('forbidden')
  return db
}

export type AdminState = { ok?: string; error?: string }

// `admin` is the management page's own segment under /account.
const Slug = z
  .string()
  .trim()
  .toLowerCase()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  .max(80)
  .refine((value) => value !== 'admin')

const CourseFields = z.object({
  title: z.string().trim().min(1).max(160),
  slug: Slug,
  summary: z.string().trim().max(600),
  language: z.enum(COURSE_LANGUAGES),
  access: z.enum(COURSE_ACCESS),
  position: z.coerce.number().int().min(0).max(999),
})

const fields = (form: FormData) => ({
  ...Object.fromEntries(form),
  published: form.get('published') === 'on',
})

function failure(error: unknown): AdminState {
  const message = String((error as Error)?.message ?? error)
  if (message.includes('unique') || message.includes('duplicate'))
    return { error: 'Slug già usato.' }
  if (error instanceof z.ZodError)
    return {
      error: `Controlla: ${error.issues.map((issue) => issue.path.join('.')).join(', ')}`,
    }
  return { error: 'Operazione non riuscita.' }
}

export async function saveCourse(
  _state: AdminState,
  form: FormData
): Promise<AdminState> {
  try {
    const db = await admin()
    const values = {
      ...CourseFields.parse(fields(form)),
      published: form.get('published') === 'on',
    }
    const id = form.get('id')
    if (typeof id === 'string' && id) {
      await db.update(courses).set(values).where(eq(courses.id, id))
    } else {
      await db.insert(courses).values(values)
    }
    refresh()
    return { ok: 'Corso salvato.' }
  } catch (error) {
    return failure(error)
  }
}

export async function deleteCourse(id: string) {
  const db = await admin()
  const own = await db
    .select({ videoKey: lessons.videoKey })
    .from(lessons)
    .where(eq(lessons.courseId, id))
  for (const { videoKey } of own) if (videoKey) await deleteObject(videoKey)
  await db.delete(courses).where(eq(courses.id, id))
  refresh()
}

const LessonFields = z.object({
  courseId: z.uuid(),
  title: z.string().trim().min(1).max(160),
  slug: Slug,
  body: z.string().max(50_000),
  position: z.coerce.number().int().min(0).max(999),
})

export async function saveLesson(
  _state: AdminState,
  form: FormData
): Promise<AdminState> {
  try {
    const db = await admin()
    const values = {
      ...LessonFields.parse(fields(form)),
      published: form.get('published') === 'on',
    }
    const id = form.get('id')
    if (typeof id === 'string' && id) {
      await db.update(lessons).set(values).where(eq(lessons.id, id))
    } else {
      await db.insert(lessons).values(values)
    }
    refresh()
    return { ok: 'Lezione salvata.' }
  } catch (error) {
    return failure(error)
  }
}

export async function deleteLesson(id: string) {
  const db = await admin()
  const [row] = await db
    .delete(lessons)
    .where(eq(lessons.id, id))
    .returning({ videoKey: lessons.videoKey })
  if (row?.videoKey) await deleteObject(row.videoKey)
  refresh()
}

/** A signed URL the browser uploads the recording to, straight to the bucket. */
export async function startVideoUpload(
  lessonId: string,
  file: { name: string; type: string; size: number }
): Promise<{ url: string; key: string } | { error: string }> {
  await admin()
  if (!VIDEO_TYPES.includes(file.type))
    return { error: 'Formato non supportato (MP4, WebM o MOV).' }
  if (file.size > MAX_VIDEO_BYTES) return { error: 'File oltre 5 GB.' }
  const extension = file.name.split('.').pop()?.toLowerCase() ?? 'mp4'
  const safe = /^[a-z0-9]{2,5}$/.test(extension) ? extension : 'mp4'
  const key = `lessons/${lessonId}/${Date.now()}.${safe}`
  const requestHeaders = await headers()
  const origin =
    requestHeaders.get('origin') ??
    process.env.BETTER_AUTH_URL ??
    'http://localhost:3000'
  try {
    return { url: await presignUpload(key, file.type, origin), key }
  } catch {
    return { error: 'Bucket non configurato.' }
  }
}

/** Saves the uploaded recording on its lesson, replacing the old one. */
export async function finishVideoUpload(lessonId: string, key: string) {
  const db = await admin()
  if (!key.startsWith(`lessons/${lessonId}/`)) throw new Error('bad key')
  const [old] = await db
    .select({ videoKey: lessons.videoKey, courseId: lessons.courseId })
    .from(lessons)
    .where(eq(lessons.id, lessonId))
  if (!old) return
  await db
    .update(lessons)
    .set({ videoKey: key })
    .where(eq(lessons.id, lessonId))
  if (old.videoKey && old.videoKey !== key) await deleteObject(old.videoKey)
  refresh()
}

export async function removeVideo(lessonId: string) {
  const db = await admin()
  const [row] = await db
    .select({ videoKey: lessons.videoKey })
    .from(lessons)
    .where(eq(lessons.id, lessonId))
  if (row?.videoKey) await deleteObject(row.videoKey)
  await db
    .update(lessons)
    .set({ videoKey: null })
    .where(eq(lessons.id, lessonId))
  refresh()
}

/** Enrols an existing account (it signs in once first) by its email. */
export async function enroll(
  _state: AdminState,
  form: FormData
): Promise<AdminState> {
  try {
    const db = await admin()
    const courseId = z.uuid().parse(form.get('courseId'))
    const email = z
      .email()
      .parse(String(form.get('email')).trim().toLowerCase())
    const [account] = await db
      .select({ id: user.id })
      .from(user)
      .where(eq(user.email, email))
    if (!account)
      return {
        error:
          'Nessun account con questa email: chiedi alla persona di entrare una volta nell’area corsi.',
      }
    await db
      .insert(enrollments)
      .values({ userId: account.id, courseId })
      .onConflictDoNothing()
    refresh()
    return { ok: `${email} iscritto.` }
  } catch (error) {
    return failure(error)
  }
}

export async function unenroll(userId: string, courseId: string) {
  const db = await admin()
  await db
    .delete(enrollments)
    .where(
      and(eq(enrollments.userId, userId), eq(enrollments.courseId, courseId))
    )
  refresh()
}

export async function setApplicationStatus(
  id: string,
  status: (typeof APPLICATION_STATUSES)[number]
) {
  const db = await admin()
  await db
    .update(applications)
    .set({ status: z.enum(APPLICATION_STATUSES).parse(status) })
    .where(eq(applications.id, id))
  refresh()
}
