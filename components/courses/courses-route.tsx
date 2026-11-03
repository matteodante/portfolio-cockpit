import { notFound } from 'next/navigation'
import CoursesPage from '@/components/courses/courses-page'
import type { Locale } from '@/lib/i18n/config'
import { coursesMetadata, coursesSchema } from '@/lib/seo/courses-page'
import '@/components/landing/landing.css'
import '@/components/marketing/marketing.css'
import '@/components/courses/courses.css'

type Params = Promise<{ lang: string }>

/** /it/corsi and /en/courses: each folder serves only its own language. */
export function coursesRoute(locale: Locale) {
  async function check(params: Params) {
    if ((await params).lang !== locale) notFound()
  }
  return {
    generateStaticParams: () => [{ lang: locale }],
    async generateMetadata({ params }: { params: Params }) {
      await check(params)
      return coursesMetadata(locale)
    },
    async Page({ params }: { params: Params }) {
      await check(params)
      return (
        <>
          <script
            type="application/ld+json"
            // biome-ignore lint/security/noDangerouslySetInnerHtml: static, escaped JSON-LD
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(coursesSchema(locale)).replace(
                /</g,
                '\\u003c'
              ),
            }}
          />
          <CoursesPage locale={locale} />
        </>
      )
    },
  }
}
