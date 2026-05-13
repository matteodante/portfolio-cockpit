import type { MetadataRoute } from 'next'
import { BASE_URL, CV_MARKDOWN_PATHS } from '@/lib/constants/site'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/', CV_MARKDOWN_PATHS.en, CV_MARKDOWN_PATHS.it, '/llms.txt'],
      disallow: ['/api/'],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  }
}
