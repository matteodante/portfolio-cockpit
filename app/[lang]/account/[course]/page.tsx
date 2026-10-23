import type { Route } from 'next'
import { notFound, redirect } from 'next/navigation'
import AccountShell from '@/components/courses/account-shell'
import CourseView from '@/components/courses/course-view'
import { accountContext } from '@/lib/courses/page-context'
import { getCourse } from '@/lib/courses/queries'
import { accountPath } from '@/lib/seo/courses-page'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ lang: string; course: string }> }

export default async function CoursePage({ params }: Props) {
  const { locale, db, viewer } = await accountContext(params)
  if (!(db && viewer)) redirect(accountPath(locale) as Route)
  const found = await getCourse(db, viewer, (await params).course)
  if (!found) notFound()
  return (
    <AccountShell locale={locale} viewer={viewer}>
      <CourseView locale={locale} found={found} />
    </AccountShell>
  )
}
