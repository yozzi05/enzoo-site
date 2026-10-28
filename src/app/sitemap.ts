import type { MetadataRoute } from 'next'
import { siteUrl } from '@/config/site'
import { services } from '@/content/services'
import { offers } from '@/content/clinic'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ['', '/services', '/prices', '/about', '/grooming', '/reviews', '/owners', '/contacts', '/appointment', '/privacy', '/consent', ...(offers.length ? ['/offers'] : [])]
  const servicePages = services.filter((s) => !s.href).map((s) => `/services/${s.slug}`)
  return [...pages, ...servicePages].map((p) => ({
    url: `${siteUrl}${p}`,
    changeFrequency: 'monthly',
    priority: p === '' ? 1 : p.startsWith('/services/') ? 0.7 : 0.6,
  }))
}
