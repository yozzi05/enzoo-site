import type { MetadataRoute } from 'next'
import { isIndexable, siteUrl } from '@/config/site'

/** Preview и staging закрыты от индексации; production задаётся NEXT_PUBLIC_SITE_ENV=production. */
export default function robots(): MetadataRoute.Robots {
  if (!isIndexable) return { rules: { userAgent: '*', disallow: '/' } }
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/api/'] },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  }
}
