import { asc, eq } from 'drizzle-orm'
import type { Route } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { z } from 'zod'
import AccountShell from '@/components/courses/account-shell'
import ActionButton from '@/components/courses/admin-buttons'
import {
  CourseForm,
  EnrollForm,
  LessonForm,
  VideoUpload,
} from '@/components/courses/admin-forms'
import { BackArrow, Plus } from '@/components/courses/icons'
import {
  deleteCourse,
  deleteLesson,
  removeVideo,
  unenroll,
} from '@/lib/courses/admin-actions'
import { accountContext } from '@/lib/courses/page-context'
import { courses, enrollments, lessons, user } from '@/lib/courses/schema'
import { storageEnabled } from '@/lib/courses/storage'
import { accountPath } from '@/lib/seo/courses-page'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ lang: string; courseId: string }> }

export default async function AdminCoursePage({ params }: Props) {
  const { locale, db, viewer } = await accountContext(params)
  if (!(db && viewer?.admin)) notFound()
  const id = z.uuid().safeParse((await params).courseId)
  if (!id.success) notFound()
  const [course] = await db
    .select()
    .from(courses)
    .where(eq(courses.id, id.data))
  if (!course) notFound()
  const [lessonRows, students] = await Promise.all([
    db
      .select()
      .from(lessons)
      .where(eq(lessons.courseId, course.id))
      .orderBy(asc(lessons.position), asc(lessons.createdAt)),
    db
      .select({ id: user.id, name: user.name, email: user.email })
      .from(enrollments)
      .innerJoin(user, eq(user.id, enrollments.userId))
      .where(eq(enrollments.courseId, course.id))
      .orderBy(asc(user.name)),
  ])
  const uploads = storageEnabled()
  return (
    <AccountShell locale={locale} viewer={viewer}>
      <div className="account-head">
        <Link
          className="course-back"
          href={accountPath(locale, 'admin') as Route}
        >
          <BackArrow />
          Gestione corsi
        </Link>
        <h1>{course.title}</h1>
        <Link
          className="marketing-text-link"
          href={accountPath(locale, course.slug) as Route}
        >
          Apri come studente
        </Link>
      </div>

      <section className="admin-section" aria-labelledby="admin-course">
        <h2 id="admin-course">Impostazioni</h2>
        <CourseForm key={course.updatedAt.toISOString()} course={course} />
        <ActionButton
          label="Elimina corso"
          confirm="Eliminare il corso, le lezioni e le registrazioni? Non si può annullare."
          action={deleteCourse.bind(null, course.id)}
        />
      </section>

      <section className="admin-section" aria-labelledby="admin-lessons">
        <h2 id="admin-lessons">
          Lezioni <span>{lessonRows.length}</span>
        </h2>
        {!uploads && (
          <p className="course-muted">
            Bucket non configurato: le registrazioni si caricano quando le
            variabili STORAGE_* sono impostate.
          </p>
        )}
        {lessonRows.map((lesson) => (
          <details key={lesson.id} className="admin-lesson">
            <summary>
              {lesson.title}
              <span>
                {lesson.published ? 'Pubblicata' : 'Bozza'}
                {lesson.videoKey ? ' · con registrazione' : ''}
              </span>
            </summary>
            <LessonForm
              key={lesson.updatedAt.toISOString()}
              courseId={course.id}
              lesson={lesson}
            />
            {uploads && <VideoUpload lessonId={lesson.id} />}
            <div className="admin-row-actions">
              {lesson.videoKey && (
                <ActionButton
                  label="Rimuovi registrazione"
                  confirm="Eliminare la registrazione dal bucket?"
                  action={removeVideo.bind(null, lesson.id)}
                />
              )}
              <ActionButton
                label="Elimina lezione"
                confirm="Eliminare la lezione?"
                action={deleteLesson.bind(null, lesson.id)}
              />
            </div>
          </details>
        ))}
        <details className="admin-new">
          <summary>
            <Plus />
            Nuova lezione
          </summary>
          <LessonForm
            courseId={course.id}
            lesson={{ position: lessonRows.length }}
          />
        </details>
      </section>

      <section className="admin-section" aria-labelledby="admin-students">
        <h2 id="admin-students">
          Iscritti <span>{students.length}</span>
        </h2>
        {course.access === 'free' && (
          <p className="course-muted">
            Corso gratuito: lo vede ogni account, anche senza iscrizione.
          </p>
        )}
        <EnrollForm courseId={course.id} />
        <ul className="admin-list">
          {students.map((student) => (
            <li key={student.id}>
              <strong>{student.name}</strong>
              <span>{student.email}</span>
              <ActionButton
                label="Rimuovi"
                action={unenroll.bind(null, student.id, course.id)}
              />
            </li>
          ))}
        </ul>
      </section>
    </AccountShell>
  )
}
