import { LLMS_PUBLIC } from '@/lib/seo/llms-content'

export const dynamic = 'force-static'

export async function GET(): Promise<Response> {
  return new Response(LLMS_PUBLIC, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control':
        'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
