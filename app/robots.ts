import type { MetadataRoute } from 'next'
import { BASE_URL } from '@/lib/constants/site'

export default function robots(): MetadataRoute.Robots {
  return {
    // The same public access applies to search and AI crawlers. Keep rendering
    // assets and llms.txt crawlable; authentication protects private CV data.
    rules: { userAgent: '*', allow: '/', disallow: '/api/' },
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}
