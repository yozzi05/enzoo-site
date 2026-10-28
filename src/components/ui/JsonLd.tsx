import { site, siteUrl } from '@/config/site'

export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }} />
}

/** Разметка организации. Без aggregateRating и сотрудников: подтверждённых данных нет. */
export function organizationLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'VeterinaryCare',
    '@id': `${siteUrl}/#clinic`,
    name: site.legalTitle,
    alternateName: site.name,
    url: siteUrl,
    logo: `${siteUrl}/brand/enzoo-logo-vertical.png`,
    image: `${siteUrl}/brand/og-default.png`,
    telephone: site.phone.e164,
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${site.address.street}, ${site.address.floor}`,
      addressLocality: site.address.city,
      addressRegion: site.address.region,
      addressCountry: site.address.country,
    },
    openingHoursSpecification: site.hours.isAroundTheClock
      ? [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            opens: '00:00',
            closes: '23:59',
          },
        ]
      : undefined,
  }
}
