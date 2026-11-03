import type { Route } from 'next'
import Link from 'next/link'
import { ACCOUNT_COPY } from '@/components/courses/account-copy'
import AccountShell from '@/components/courses/account-shell'
import SignInPanel from '@/components/courses/sign-in-panel'
import LearningOrbit from '@/components/shared/learning-orbit'
import {
  devPasswordEnabled,
  getAuth,
  googleSignInEnabled,
} from '@/lib/courses/auth'
import { accountContext } from '@/lib/courses/page-context'
import { listCourses } from '@/lib/courses/queries'
import { accountPath, COURSES_PATHS } from '@/lib/seo/courses-page'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ lang: string }> }

export default async function AccountPage({ params }: Props) {
  const { locale, db, viewer } = await accountContext(params)
  const t = ACCOUNT_COPY[locale]

  if (!(viewer && db)) {
    const available = Boolean(getAuth())
    return (
      <AccountShell locale={locale} viewer={null}>
        <section className="account-gate" aria-labelledby="account-title">
          <div className="account-gate-copy">
            <h1 id="account-title">{t.signInTitle}</h1>
            {available ? (
              <>
                <p>{t.signInBody}</p>
                <SignInPanel
                  copy={{
                    google: t.google,
                    devSignIn: t.devSignIn,
                    devEmail: t.devEmail,
                    devPassword: t.devPassword,
                    devSubmit: t.devSubmit,
                    error: t.error,
                  }}
                  callbackURL={accountPath(locale)}
                  google={googleSignInEnabled()}
                  devPassword={devPasswordEnabled()}
                />
              </>
            ) : (
              <>
                <p>{t.unavailable}</p>
                <Link className="booking-link" href={COURSES_PATHS[locale]}>
                  {t.toCourses}
                </Link>
              </>
            )}
          </div>
          <LearningOrbit className="account-gate-orbit" />
        </section>
      </AccountShell>
    )
  }

  const courses = await listCourses(db, viewer)
  const firstName = viewer.name.split(' ')[0] ?? viewer.name
  return (
    <AccountShell locale={locale} viewer={viewer}>
      <div className="account-head">
        <h1>{t.yourCourses(firstName)}</h1>
      </div>
      {courses.length === 0 ? (
        <section className="account-empty">
          <h2>{t.emptyTitle}</h2>
          <p>{t.emptyBody}</p>
          <Link
            className="booking-link"
            href={`${COURSES_PATHS[locale]}#posto` as Route}
          >
            {t.apply}
          </Link>
        </section>
      ) : (
        <ul className="account-courses">
          {courses.map((course) => {
            const ratio = course.lessonCount
              ? course.completedCount / course.lessonCount
              : 0
            return (
              <li key={course.id}>
                <Link
                  href={accountPath(locale, course.slug) as Route}
                  className="account-course"
                >
                  <h2>{course.title}</h2>
                  <span className="account-course-meta">
                    {course.access === 'free' ? t.free : t.assigned}
                    {!course.published && ` · ${t.draft}`}
                    {' · '}
                    {course.language.toUpperCase()}
                  </span>
                  {course.summary && <p>{course.summary}</p>}
                  <span className="account-progress">
                    <span
                      className="account-progress-bar"
                      style={{ inlineSize: `${Math.round(ratio * 100)}%` }}
                    />
                  </span>
                  <span className="account-course-foot">
                    {t.lessons(course.lessonCount)}
                    {course.lessonCount > 0 &&
                      ` · ${t.completed(course.completedCount, course.lessonCount)}`}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </AccountShell>
  )
}
