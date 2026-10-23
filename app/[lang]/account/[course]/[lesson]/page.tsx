import type { Route } from 'next'
import { notFound, redirect } from 'next/navigation'
import AccountShell from '@/components/courses/account-shell'
import CourseView from '@/components/courses/course-view'
import { accountContext } from '@/lib/courses/page-context'
import { getCourse } from '@/lib/courses/queries'
import { accountPath } from '@/lib/seo/courses-page'

export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ lang: string; course: string; lesson: string }>
}

export default async function LessonPage({ params }: Props) {
  const { locale, db, viewer } = await accountContext(params)
  if (!(db && viewer)) redirect(accountPath(locale) as Route)
  const { course, lesson } = await params
  const found = await getCourse(db, viewer, course)
  if (!found?.lessons.some((item) => item.slug === lesson)) notFound()
  return (
    <AccountShell locale={locale} viewer={viewer}>
      <CourseView locale={locale} found={found} lessonSlug={lesson} />
    </AccountShell>
  )
}
