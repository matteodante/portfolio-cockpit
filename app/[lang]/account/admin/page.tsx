import { asc, count, desc, eq } from 'drizzle-orm'
import type { Route } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import AccountShell from '@/components/courses/account-shell'
import ActionButton from '@/components/courses/admin-buttons'
import { CourseForm } from '@/components/courses/admin-forms'
import { Plus } from '@/components/courses/icons'
import { setApplicationStatus } from '@/lib/courses/admin-actions'
import { accountContext } from '@/lib/courses/page-context'
import { applications, courses, lessons, user } from '@/lib/courses/schema'
import { accountPath } from '@/lib/seo/courses-page'

export const dynamic = 'force-dynamic'

const LABELS: Record<string, string> = {
  'ai-dev': 'AI per sviluppatori',
  'ai-work': 'AI per il lavoro',
  unsure: 'Non sa',
  'one-to-one': 'Uno a uno',
  group: 'Gruppo',
  either: 'Indifferente',
  beginner: 'Da zero',
  some: 'Usa già l’AI',
  developer: 'Sviluppatore',
  new: 'Nuova',
  accepted: 'Accettata',
  declined: 'Rifiutata',
}

const date = new Intl.DateTimeFormat('it-IT', {
  dateStyle: 'medium',
  timeStyle: 'short',
  timeZone: 'Europe/Rome',
})

type Props = { params: Promise<{ lang: string }> }

export default async function AdminPage({ params }: Props) {
  const { locale, db, viewer } = await accountContext(params)
  if (!(db && viewer?.admin)) notFound()
  const [requests, courseRows, people] = await Promise.all([
    db
      .select()
      .from(applications)
      .orderBy(desc(applications.createdAt))
      .limit(200),
    db
      .select({
        id: courses.id,
        title: courses.title,
        slug: courses.slug,
        access: courses.access,
        published: courses.published,
        lessonCount: count(lessons.id),
      })
      .from(courses)
      .leftJoin(lessons, eq(lessons.courseId, courses.id))
      .groupBy(courses.id)
      .orderBy(asc(courses.position), asc(courses.createdAt)),
    db
      .select({
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      })
      .from(user)
      .orderBy(desc(user.createdAt))
      .limit(200),
  ])
  return (
    <AccountShell locale={locale} viewer={viewer}>
      <div className="account-head">
        <h1>Gestione corsi</h1>
      </div>

      <section className="admin-section" aria-labelledby="admin-requests">
        <h2 id="admin-requests">
          Candidature <span>{requests.length}</span>
        </h2>
        {requests.length === 0 ? (
          <p className="course-muted">Nessuna candidatura ancora.</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th scope="col">Data</th>
                  <th scope="col">Persona</th>
                  <th scope="col">Percorso</th>
                  <th scope="col">Obiettivo</th>
                  <th scope="col">Stato</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => (
                  <tr key={request.id}>
                    <td>{date.format(request.createdAt)}</td>
                    <td>
                      <strong>{request.name}</strong>
                      <Link href={`mailto:${request.email}`}>
                        {request.email}
                      </Link>
                      <span>{request.locale.toUpperCase()}</span>
                    </td>
                    <td>
                      {LABELS[request.topic]}
                      <span>
                        {LABELS[request.format]} · {LABELS[request.level]}
                      </span>
                    </td>
                    <td className="admin-goal">{request.goal}</td>
                    <td>
                      <span
                        className="admin-status"
                        data-status={request.status}
                      >
                        {LABELS[request.status]}
                      </span>
                      <span className="admin-row-actions">
                        {(['accepted', 'declined', 'new'] as const)
                          .filter((status) => status !== request.status)
                          .map((status) => (
                            <ActionButton
                              key={status}
                              label={LABELS[status] ?? status}
                              action={setApplicationStatus.bind(
                                null,
                                request.id,
                                status
                              )}
                            />
                          ))}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="admin-section" aria-labelledby="admin-courses">
        <h2 id="admin-courses">
          Corsi <span>{courseRows.length}</span>
        </h2>
        {courseRows.length > 0 && (
          <ul className="admin-list">
            {courseRows.map((course) => (
              <li key={course.id}>
                <Link href={accountPath(locale, 'admin', course.id) as Route}>
                  {course.title}
                </Link>
                <span>
                  {course.access === 'free' ? 'Gratuito' : 'Assegnato'} ·{' '}
                  {course.published ? 'Pubblicato' : 'Bozza'} ·{' '}
                  {course.lessonCount} lezioni · /{course.slug}
                </span>
              </li>
            ))}
          </ul>
        )}
        <details className="admin-new">
          <summary>
            <Plus />
            Nuovo corso
          </summary>
          <CourseForm key={courseRows.length} />
        </details>
      </section>

      <section className="admin-section" aria-labelledby="admin-people">
        <h2 id="admin-people">
          Account <span>{people.length}</span>
        </h2>
        <ul className="admin-list">
          {people.map((person) => (
            <li key={person.email}>
              <strong>{person.name}</strong>
              <span>
                {person.email} · dal {date.format(person.createdAt)}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </AccountShell>
  )
}
