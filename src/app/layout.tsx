import type { Metadata, Viewport } from 'next'
import { site, siteUrl, isIndexable, withBase } from '@/config/site'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { MobileActionBar } from '@/components/layout/MobileActionBar'
import { AnalyticsListener } from '@/components/layout/AnalyticsListener'
import { CookieNotice } from '@/components/layout/CookieNotice'
import { JsonLd, organizationLd } from '@/components/ui/JsonLd'
import { AppointmentModalProvider } from '@/components/appointment/AppointmentModal'
import { isAppointmentEnabled } from '@/lib/server/delivery'
import '@/styles/fonts.css'
import '@/styles/base.css'
import '@/styles/components.css'
import '@/styles/sections.css'
import '@/styles/forms.css'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Ветеринарная клиника EnZoo в Махачкале - круглосуточно',
    template: '%s - ветклиника EnZoo, Махачкала',
  },
  description: `Ветеринарная клиника EnZoo в Махачкале: терапия, диагностика, хирургия, вакцинация, стационар и груминг. Круглосуточно. ${site.address.street}, ${site.address.landmark}. Телефон ${site.phone.display}.`,
  applicationName: site.legalTitle,
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    siteName: site.legalTitle,
    images: [{ url: `${siteUrl}/brand/og-default.png`, width: 1200, height: 630, alt: 'Логотип ветеринарной клиники EnZoo' }],
  },
  robots: isIndexable ? { index: true, follow: true } : { index: false, follow: false },
  icons: {
    icon: [{ url: withBase('/brand/favicon-32.png'), sizes: '32x32', type: 'image/png' }, { url: withBase('/brand/icon-512.png'), sizes: '512x512', type: 'image/png' }],
    apple: withBase('/brand/apple-icon.png'),
  },
  formatDetection: { telephone: false },
}

export const viewport: Viewport = {
  themeColor: '#002f55',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Канал доставки определяется при сборке; в статической версии (GitHub Pages) приёма заявок нет.
  const appointmentEnabled = process.env.STATIC_EXPORT !== '1' && isAppointmentEnabled()
  return (
    <html lang="ru">
      <body>
        <a href="#main" className="skip-link">
          Перейти к содержанию
        </a>
        <AppointmentModalProvider enabled={appointmentEnabled}>
          <Header />
          <main id="main" tabIndex={-1}>
            {children}
          </main>
          <Footer />
        </AppointmentModalProvider>
        <MobileActionBar />
        <CookieNotice />
        <AnalyticsListener />
        <JsonLd data={organizationLd()} />
      </body>
    </html>
  )
}
