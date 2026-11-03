import type { Route } from 'next'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { ACCOUNT_COPY } from '@/components/courses/account-copy'
import { BackArrow } from '@/components/courses/icons'
import LessonDoneButton from '@/components/courses/lesson-done-button'
import type { getCourse } from '@/lib/courses/queries'
import { presignPlayback } from '@/lib/courses/storage'
import type { Locale } from '@/lib/i18n/config'
import { accountPath } from '@/lib/seo/courses-page'

type Course = NonNullable<Awaited<ReturnType<typeof getCourse>>>

function Done({ done }: { done: boolean }) {
  return (
    <svg
      className="lesson-mark"
      data-done={done || undefined}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      aria-hidden="true"
    >
      <circle cx="10" cy="10" r="8.5" fill="none" stroke="currentColor" />
      {done && (
        <path
          d="M6 10.5 8.8 13 14 7.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        />
      )}
    </svg>
  )
}

/** A course: its lessons beside the open lesson (or the course overview). */
export default async function CourseView({
  locale,
  found,
  lessonSlug,
}: {
  locale: Locale
  found: Course
  lessonSlug?: string
}) {
  const t = ACCOUNT_COPY[locale]
  const { course, lessons } = found
  const index = lessonSlug
    ? lessons.findIndex((lesson) => lesson.slug === lessonSlug)
    : -1
  const lesson = lessons[index]
  const next = lessons[index + 1]
  const video = lesson?.videoKey ? await presignPlayback(lesson.videoKey) : null
  const href = (slug?: string) =>
    (slug
      ? accountPath(locale, course.slug, slug)
      : accountPath(locale, course.slug)) as Route
  return (
    <div className="course-view">
      <aside className="course-side" aria-label={t.lessonList}>
        <Link className="course-back" href={accountPath(locale) as Route}>
          <BackArrow />
          {t.back}
        </Link>
        <Link className="course-side-title" href={href()}>
          {course.title}
        </Link>
        {lessons.length === 0 ? (
          <p className="course-muted">{t.noLessons}</p>
        ) : (
          <ol className="course-lessons">
            {lessons.map((item) => (
              <li key={item.id}>
                <Link
                  href={href(item.slug)}
                  aria-current={item.id === lesson?.id ? 'page' : undefined}
                >
                  <Done done={item.completed} />
                  <span>{item.title}</span>
                </Link>
              </li>
            ))}
          </ol>
        )}
      </aside>
      <article className="course-main">
        <Link className="course-back" href={href()}>
          <BackArrow />
          {course.title}
        </Link>
        {lesson ? (
          <>
            <h1>{lesson.title}</h1>
            {video ? (
              <video
                className="lesson-video"
                src={video}
                controls
                preload="metadata"
                playsInline
              >
                <track kind="captions" />
              </video>
            ) : (
              lesson.videoKey === null && (
                <p className="course-muted">{t.noVideo}</p>
              )
            )}
            {lesson.body && (
              <div className="lesson-body">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {lesson.body}
                </ReactMarkdown>
              </div>
            )}
            <div className="lesson-actions">
              <LessonDoneButton
                courseSlug={course.slug}
                lessonId={lesson.id}
                done={lesson.completed}
                labels={{ done: t.markDone, undone: t.markUndone }}
              />
              {next && (
                <Link className="marketing-text-link" href={href(next.slug)}>
                  {t.next}: {next.title}
                </Link>
              )}
            </div>
          </>
        ) : (
          <>
            <h1>{course.title}</h1>
            {course.summary && (
              <p className="course-summary">{course.summary}</p>
            )}
            {lessons[0] && (
              <Link className="booking-link" href={href(lessons[0].slug)}>
                {lessons[0].title}
              </Link>
            )}
          </>
        )}
      </article>
    </div>
  )
}
