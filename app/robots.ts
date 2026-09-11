import type { MetadataRoute } from 'next'
import { BASE_URL } from '@/lib/constants/site'

export default function robots(): MetadataRoute.Robots {
  return {
    // Crawlers must reach URLs to see their X-Robots-Tag: noindex headers.
    // Authentication, not robots.txt, protects private CV data.
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}
