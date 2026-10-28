import type { NextConfig } from 'next'
import { legacyRedirects } from './src/config/redirects'

/**
 * STATIC_EXPORT=1 — статическая сборка в out/ для GitHub Pages:
 * без серверного приёма заявок, редиректов и заголовков (их Pages не поддерживает).
 * NEXT_PUBLIC_BASE_PATH — подкаталог сайта, например /enzoo-site.
 */
const isExport = process.env.STATIC_EXPORT === '1'
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''

const nextConfig: NextConfig = {
  poweredByHeader: false,
  basePath: basePath || undefined,
  // Серверный обработчик заявок назван route.server.ts и в статической сборке не подключается.
  pageExtensions: isExport ? ['tsx', 'ts'] : ['tsx', 'ts', 'server.ts'],
  ...(isExport
    ? {
        output: 'export',
        trailingSlash: true,
        images: { unoptimized: true },
      }
    : {
        images: { formats: ['image/avif', 'image/webp'] },
        async redirects() {
          return legacyRedirects
        },
        async headers() {
          return [
            {
              source: '/:path*',
              headers: [
                { key: 'X-Content-Type-Options', value: 'nosniff' },
                { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
                { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
                { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
              ],
            },
            ...(process.env.NEXT_PUBLIC_SITE_ENV === 'production'
              ? []
              : [{ source: '/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] }]),
          ]
        },
      }),
}

export default nextConfig
